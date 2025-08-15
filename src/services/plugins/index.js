import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { chat as chatService } from '..';

// Plugin interface (JS Doc for clarity)
// A plugin can implement any of the following optional hooks:
// - beforeSend: async ({ chatId, content, options, ctx }) => ({ content?, options? })
// - wrapResponder: (responder, { chatId, ctx }) => newResponder
// - onDelta: (chunk, { chatId, content, ctx }) => chunk | null | undefined
// - afterSend: async ({ chatId, content, assistantMessage, error, ctx }) => void

const PluginsContext = createContext({
  plugins: [],
  sendMessage: async () => { throw new Error('PluginsProvider not mounted'); },
});

export function PluginsProvider({ plugins = [], context = {}, children }) {
  const stablePlugins = useMemo(() => Array.isArray(plugins) ? plugins.slice() : [], [plugins]);

  const sendMessage = useCallback(async (chatId, content, options = {}) => {
    let processedContent = String(content ?? '');
    let processedOptions = { ...options };
    const ctx = context || {};

    // beforeSend hooks (can mutate content/options)
    for (const plugin of stablePlugins) {
      if (typeof plugin?.beforeSend === 'function') {
        try {
          const result = await plugin.beforeSend({ chatId, content: processedContent, options: processedOptions, ctx });
          if (result && typeof result === 'object') {
            if (Object.prototype.hasOwnProperty.call(result, 'content')) {
              processedContent = String(result.content ?? processedContent);
            }
            if (Object.prototype.hasOwnProperty.call(result, 'options')) {
              processedOptions = { ...processedOptions, ...(result.options || {}) };
            }
          }
        } catch (_) {
          // ignore plugin errors to avoid blocking send
        }
      }
    }

    // compose responder wrappers
    if (stablePlugins.some(p => typeof p?.wrapResponder === 'function')) {
      const baseResponder = processedOptions.responder; // may be undefined; chat service will fallback
      let composedResponder = baseResponder;
      for (const plugin of stablePlugins) {
        if (typeof plugin?.wrapResponder === 'function') {
          try {
            composedResponder = plugin.wrapResponder(composedResponder, { chatId, ctx });
          } catch (_) {
            // ignore
          }
        }
      }
      processedOptions.responder = composedResponder;
    }

    // compose onDelta wrappers
    const originalOnDelta = processedOptions.onDelta;
    processedOptions.onDelta = (chunk) => {
      let nextChunk = chunk;
      for (const plugin of stablePlugins) {
        if (typeof plugin?.onDelta === 'function') {
          try {
            const maybe = plugin.onDelta(nextChunk, { chatId, content: processedContent, ctx });
            if (typeof maybe !== 'undefined') {
              nextChunk = maybe;
            }
            if (nextChunk == null) {
              // Swallow chunk if null/undefined
              return;
            }
          } catch (_) {
            // ignore
          }
        }
      }
      if (typeof originalOnDelta === 'function' && nextChunk != null) {
        originalOnDelta(nextChunk);
      }
    };

    try {
      const assistantMessage = await chatService.sendMessage(chatId, processedContent, processedOptions);
      for (const plugin of stablePlugins) {
        if (typeof plugin?.afterSend === 'function') {
          try {
            await plugin.afterSend({ chatId, content: processedContent, assistantMessage, error: null, ctx });
          } catch (_) {
            // ignore
          }
        }
      }
      return assistantMessage;
    } catch (error) {
      for (const plugin of stablePlugins) {
        if (typeof plugin?.afterSend === 'function') {
          try {
            await plugin.afterSend({ chatId, content: processedContent, assistantMessage: null, error, ctx });
          } catch (_) {
            // ignore
          }
        }
      }
      throw error;
    }
  }, [stablePlugins, context]);

  const value = useMemo(() => ({ plugins: stablePlugins, sendMessage }), [stablePlugins, sendMessage]);
  return (
    <PluginsContext.Provider value={value}>{children}</PluginsContext.Provider>
  );
}

export function useChatPlugins() {
  return useContext(PluginsContext);
}


