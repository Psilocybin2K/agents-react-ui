import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as service from './index';

const PromptsContext = createContext(null);

export function PromptsProvider({ children }) {
  const mountedRef = useRef(false);
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function tempId() {
    return 'tmp_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now().toString(36);
  }

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await service.listPrompts();
      setPrompts(prev => {
        const fetched = Array.isArray(list) ? list : [];
        const optimistic = Array.isArray(prev) ? prev.filter(p => p.__optimistic) : [];
        const merged = [...optimistic, ...fetched];
        return merged;
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    refresh();
  }, [refresh]);

  const sortByUpdatedAtDesc = useCallback((items) => items.slice().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)), []);

  const createPrompt = useCallback(async (data) => {
    // Optimistic insert
    const optimistic = {
      id: tempId(),
      name: data?.name || '',
      description: data?.description || '',
      content: data?.content || '',
      variables: Array.isArray(data?.variables) ? data.variables : [],
      tags: Array.isArray(data?.tags) ? data.tags : [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      __optimistic: true,
    };
    setPrompts(prev => [optimistic, ...prev]);
    try {
      const created = await service.createPrompt(data);
      setPrompts(prev => {
        const withoutOptimistic = (prev || []).filter(p => !p.__optimistic);
        return sortByUpdatedAtDesc([created, ...withoutOptimistic]);
      });
      return created;
    } catch (err) {
      setPrompts(prev => prev.filter(p => p.id !== optimistic.id));
      setError(err);
      throw err;
    }
  }, [tempId, sortByUpdatedAtDesc]);

  const updatePrompt = useCallback(async (id, updates) => {
    const prevList = prompts;
    // Optimistic update
    setPrompts(prev => sortByUpdatedAtDesc(prev.map(p => (p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p))));
    try {
      const updated = await service.updatePrompt(id, updates);
      setPrompts(prev => sortByUpdatedAtDesc(prev.map(p => (p.id === id ? updated : p))));
      return updated;
    } catch (err) {
      setPrompts(prevList);
      setError(err);
      throw err;
    }
  }, [prompts, sortByUpdatedAtDesc]);

  const deletePrompt = useCallback(async (id) => {
    const prevList = prompts;
    // Optimistic remove
    setPrompts(prev => prev.filter(p => p.id !== id));
    try {
      await service.deletePrompt(id);
    } catch (err) {
      setPrompts(prevList);
      setError(err);
      throw err;
    }
  }, [prompts]);

  const value = useMemo(() => ({
    prompts,
    loading,
    error,
    refresh,
    createPrompt,
    updatePrompt,
    deletePrompt,
  }), [prompts, loading, error, refresh, createPrompt, updatePrompt, deletePrompt]);

  return (
    <PromptsContext.Provider value={value}>
      {children}
    </PromptsContext.Provider>
  );
}

export function usePrompts() {
  const ctx = useContext(PromptsContext);
  if (!ctx) {
    throw new Error('usePrompts must be used within a PromptsProvider');
  }
  return ctx;
}


