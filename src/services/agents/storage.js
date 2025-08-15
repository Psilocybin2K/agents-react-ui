// Lightweight localStorage adapter for Agent records
// Storage shape: Array<Agent> serialized as JSON under STORAGE_KEY

const STORAGE_KEY = 'ado.agents.v1';

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
    return Array.isArray(value) ? value : fallback;
  } catch (_) {
    return fallback;
  }
}

/**
 * Read all agents from storage.
 * @returns {Agent[]} agents array (could be empty)
 */
export function getAll() {
  const ls = getLocalStorage();
  if (!ls) return [];
  const raw = ls.getItem(STORAGE_KEY);
  if (!raw) return [];
  return safeParse(raw, []);
}

/**
 * Overwrite storage with the provided agents array.
 * @param {Agent[]} agents
 */
export function setAll(agents) {
  const ls = getLocalStorage();
  if (!ls) return;
  ls.setItem(STORAGE_KEY, JSON.stringify(agents || []));
}

/**
 * Clear all agents from storage.
 */
export function clear() {
  const ls = getLocalStorage();
  if (!ls) return;
  ls.removeItem(STORAGE_KEY);
}

/**
 * Seed storage with provided agents if currently empty.
 * @param {Agent[]} seedAgents
 * @returns {boolean} true if seeding occurred
 */
export function seedIfEmpty(seedAgents) {
  const current = getAll();
  if (current.length > 0) return false;
  if (!Array.isArray(seedAgents) || seedAgents.length === 0) return false;
  setAll(seedAgents);
  return true;
}

