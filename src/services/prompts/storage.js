// Lightweight localStorage adapter for Prompt records
// Storage shape: Array<Prompt> serialized as JSON under STORAGE_KEY
/**
 * @typedef {import('../../types').Prompt} Prompt
 */

const STORAGE_KEY = 'ado.prompts.v1';

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
 * Read all prompts from storage.
 * @returns {Prompt[]} prompts array (could be empty)
 */
export function getAll() {
  const ls = getLocalStorage();
  if (!ls) return [];
  const raw = ls.getItem(STORAGE_KEY);
  if (!raw) return [];
  return safeParse(raw, []);
}

/**
 * Overwrite storage with the provided prompts array.
 * @param {Prompt[]} prompts
 */
export function setAll(prompts) {
  const ls = getLocalStorage();
  if (!ls) return;
  ls.setItem(STORAGE_KEY, JSON.stringify(prompts || []));
}

/**
 * Clear all prompts from storage.
 */
export function clear() {
  const ls = getLocalStorage();
  if (!ls) return;
  ls.removeItem(STORAGE_KEY);
}

/**
 * Seed storage with provided prompts if currently empty.
 * @param {Prompt[]} seedPrompts
 * @returns {boolean} true if seeding occurred
 */
export function seedIfEmpty(seedPrompts) {
  const current = getAll();
  if (current.length > 0) return false;
  if (!Array.isArray(seedPrompts) || seedPrompts.length === 0) return false;
  setAll(seedPrompts);
  return true;
}


