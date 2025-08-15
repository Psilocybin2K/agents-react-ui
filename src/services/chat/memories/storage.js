// Lightweight localStorage adapter for per-thread chat memories
// Storage shape: Record<threadId, Memory[]> serialized as JSON under STORAGE_KEY
/**
 * @typedef {import('../../../types').Memory} Memory
 */

const STORAGE_KEY = 'ado.chat.memories.v1';

function getLocalStorage() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage || null;
  } catch (_) {
    return null;
  }
}

function safeParse(json, fallback) {
  try {
    const value = JSON.parse(json);
    return value && typeof value === 'object' && !Array.isArray(value) ? value : fallback;
  } catch (_) {
    return fallback;
  }
}

/**
 * Read map of threadId to memories array.
 * @returns {Record<string, Memory[]>}
 */
export function getAllMap() {
  const ls = getLocalStorage();
  if (!ls) return {};
  const raw = ls.getItem(STORAGE_KEY);
  if (!raw) return {};
  return safeParse(raw, {});
}

/**
 * Overwrite storage with the provided map.
 * @param {Record<string, Memory[]>} map
 */
export function setAllMap(map) {
  const ls = getLocalStorage();
  if (!ls) return;
  ls.setItem(STORAGE_KEY, JSON.stringify(map || {}));
}

/**
 * Read memories for a specific thread.
 * @param {string} threadId
 * @returns {Memory[]}
 */
export function getByThread(threadId) {
  const map = getAllMap();
  const list = map[threadId];
  return Array.isArray(list) ? list : [];
}

/**
 * Write memories for a specific thread.
 * @param {string} threadId
 * @param {Memory[]} memories
 */
export function setByThread(threadId, memories) {
  const map = getAllMap();
  map[threadId] = memories || [];
  setAllMap(map);
}

/**
 * Clear all stored memories.
 */
export function clear() {
  const ls = getLocalStorage();
  if (!ls) return;
  ls.removeItem(STORAGE_KEY);
}


