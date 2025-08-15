import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { listAgents as svcList, createAgent as svcCreate, updateAgent as svcUpdate, deleteAgent as svcDelete } from './index';

const AgentsContext = createContext(null);

function sortByUpdatedAtDesc(items) {
  return items.slice().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export function AgentsProvider({ children }) {
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    (async () => {
      try {
        const data = await svcList();
        if (mountedRef.current) setAgents(sortByUpdatedAtDesc(data));
      } catch (err) {
        if (mountedRef.current) setError(err);
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    })();
    return () => { mountedRef.current = false; };
  }, []);

  const refresh = useCallback(async () => {
    const data = await svcList();
    if (mountedRef.current) setAgents(sortByUpdatedAtDesc(data));
  }, []);

  const createAgent = useCallback(async (data) => {
    const created = await svcCreate(data);
    if (mountedRef.current) setAgents(prev => sortByUpdatedAtDesc([...prev, created]));
    return created;
  }, []);

  const updateAgent = useCallback(async (id, updates) => {
    const updated = await svcUpdate(id, updates);
    if (mountedRef.current) setAgents(prev => {
      const idx = prev.findIndex(a => a.id === id);
      if (idx === -1) return prev;
      const next = prev.slice();
      next[idx] = updated;
      return sortByUpdatedAtDesc(next);
    });
    return updated;
  }, []);

  const deleteAgent = useCallback(async (id) => {
    await svcDelete(id);
    if (mountedRef.current) setAgents(prev => prev.filter(a => a.id !== id));
  }, []);

  const value = useMemo(() => ({
    agents,
    isLoading,
    error,
    refresh,
    createAgent,
    updateAgent,
    deleteAgent,
  }), [agents, isLoading, error, refresh, createAgent, updateAgent, deleteAgent]);

  return (
    <AgentsContext.Provider value={value}>
      {children}
    </AgentsContext.Provider>
  );
}

export function useAgents() {
  const ctx = useContext(AgentsContext);
  if (!ctx) {
    throw new Error('useAgents must be used within an AgentsProvider');
  }
  return ctx;
}


