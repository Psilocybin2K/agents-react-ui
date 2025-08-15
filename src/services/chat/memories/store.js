import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { listMemories as svcList, createMemory as svcCreate, updateMemory as svcUpdate, deleteMemory as svcDelete, generateMemoriesFromMessages as svcGenerate } from './index';

const ChatMemoriesContext = createContext(null);

function sortByUpdatedAtDesc(items) {
  return items.slice().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export function ChatMemoriesProvider({ threadId, children }) {
  const [memories, setMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  const threadRef = useRef(threadId);

  useEffect(() => {
    threadRef.current = threadId;
  }, [threadId]);

  useEffect(() => {
    mountedRef.current = true;
    (async () => {
      try {
        setIsLoading(true);
        const data = await svcList(threadId);
        if (mountedRef.current) setMemories(sortByUpdatedAtDesc(data));
      } catch (err) {
        if (mountedRef.current) setError(err);
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    })();
    return () => { mountedRef.current = false; };
  }, [threadId]);

  const refresh = useCallback(async () => {
    const data = await svcList(threadRef.current);
    if (mountedRef.current) setMemories(sortByUpdatedAtDesc(data));
  }, []);

  const createMemory = useCallback(async (data) => {
    const created = await svcCreate(threadRef.current, data);
    if (mountedRef.current) setMemories(prev => sortByUpdatedAtDesc([...prev, created]));
    return created;
  }, []);

  const updateMemory = useCallback(async (id, updates) => {
    const updated = await svcUpdate(threadRef.current, id, updates);
    if (mountedRef.current) setMemories(prev => {
      const idx = prev.findIndex(m => m.id === id);
      if (idx === -1) return prev;
      const next = prev.slice();
      next[idx] = updated;
      return sortByUpdatedAtDesc(next);
    });
    return updated;
  }, []);

  const deleteMemory = useCallback(async (id) => {
    await svcDelete(threadRef.current, id);
    if (mountedRef.current) setMemories(prev => prev.filter(m => m.id !== id));
  }, []);

  const generate = useCallback(async (messages, options) => {
    return svcGenerate(messages, options);
  }, []);

  const value = useMemo(() => ({
    threadId: threadRef.current,
    memories,
    isLoading,
    error,
    refresh,
    createMemory,
    updateMemory,
    deleteMemory,
    generate,
  }), [memories, isLoading, error, refresh, createMemory, updateMemory, deleteMemory, generate]);

  return (
    <ChatMemoriesContext.Provider value={value}>
      {children}
    </ChatMemoriesContext.Provider>
  );
}

export function useChatMemories() {
  const ctx = useContext(ChatMemoriesContext);
  if (!ctx) {
    throw new Error('useChatMemories must be used within a ChatMemoriesProvider');
  }
  return ctx;
}


