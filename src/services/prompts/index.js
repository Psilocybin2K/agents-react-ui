// Prompts service: CRUD operations backed by localStorage adapter
/**
 * @typedef {import('../../types').Prompt} Prompt
 */
import { getAll, setAll, seedIfEmpty } from './storage';

const DEFAULT_SEED_FLAG = '1';

function nowMs() {
  return Date.now();
}

function generateId() {
  // Simple RFC4122-ish id; sufficient for client-only persistence
  return 'prm_' + Math.random().toString(36).slice(2, 10) + '_' + nowMs().toString(36);
}

function clampString(input, max) {
  if (typeof input !== 'string') return '';
  if (max && input.length > max) return input.slice(0, max);
  return input;
}

// Defensive limits mirrored from validation plan
const LIMITS = {
  name: 100,
  description: 500,
  content: 5000,
  tag: 50,
};

const MAX_TAGS = 10;
const MAX_VARIABLES = 50;

/**
 * Optionally seed default prompts when storage is empty.
 * Controlled by env flags: VITE_SEED_PROMPTS or REACT_APP_SEED_PROMPTS (truthy to enable).
 */
export function maybeSeed() {
  const env = (typeof process !== 'undefined' && process.env) ? process.env : {};
  const flag = env.VITE_SEED_PROMPTS ?? env.REACT_APP_SEED_PROMPTS ?? DEFAULT_SEED_FLAG;
  const enabled = String(flag) !== '0' && String(flag).toLowerCase() !== 'false';
  if (!enabled) return false;
  const ts = nowMs();
  const seed = [
    {
      id: generateId(),
      name: 'General Purpose Prompt',
      description: 'Reusable generic prompt scaffold for tasks',
      content: 'You are a helpful assistant. Use clear, concise answers.',
      variables: [],
      tags: ['general'],
      createdAt: ts,
      updatedAt: ts,
    },
  ];
  return seedIfEmpty(seed);
}

/**
 * List all prompts.
 * @returns {Promise<Prompt[]>}
 */
export async function listPrompts() {
  // Ensure seed once per session if applicable
  maybeSeed();
  const prompts = getAll();
  // Sort by updatedAt desc for stable ordering
  return prompts.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

/**
 * Create a new prompt
 * @param {{ name: string; content: string; description?: string; variables?: Array<{ name: string; description?: string; required?: boolean; example?: string }>; tags?: string[]; }} data
 * @returns {Promise<Prompt>}
 */
export async function createPrompt(data) {
  const name = clampString(String(data?.name || '').trim(), LIMITS.name);
  const content = clampString(String(data?.content || '').trim(), LIMITS.content);
  if (!name) throw new Error('Name is required');
  if (!content) throw new Error('Content is required');

  const variablesInput = Array.isArray(data?.variables) ? data.variables.slice(0, MAX_VARIABLES) : [];
  const variables = variablesInput
    .map(v => ({
      name: clampString(String(v?.name || '').trim(), LIMITS.tag),
      description: clampString(v?.description || '', 200),
      required: Boolean(v?.required),
      example: clampString(v?.example || '', 500),
    }))
    .filter(v => v.name);

  const tagsInput = Array.isArray(data?.tags) ? data.tags.slice(0, MAX_TAGS) : [];
  const tags = tagsInput
    .map(t => clampString(String(t || '').trim(), LIMITS.tag))
    .filter(Boolean);

  const now = nowMs();
  const prompt = {
    id: generateId(),
    name,
    description: clampString(data?.description || '', LIMITS.description),
    content,
    variables,
    tags,
    createdAt: now,
    updatedAt: now,
  };
  const prompts = getAll();
  prompts.push(prompt);
  setAll(prompts);
  return prompt;
}

/**
 * Update an existing prompt by id
 * @param {string} id
 * @param {Partial<Prompt>} updates
 * @returns {Promise<Prompt>}
 */
export async function updatePrompt(id, updates) {
  const prompts = getAll();
  const idx = prompts.findIndex(p => p.id === id);
  if (idx === -1) throw new Error('Prompt not found');
  const current = prompts[idx];

  let nextVariables = current.variables || [];
  if (updates && 'variables' in updates) {
    const input = Array.isArray(updates.variables) ? updates.variables.slice(0, MAX_VARIABLES) : [];
    nextVariables = input
      .map(v => ({
        name: clampString(String(v?.name || '').trim(), LIMITS.tag),
        description: clampString(v?.description || '', 200),
        required: Boolean(v?.required),
        example: clampString(v?.example || '', 500),
      }))
      .filter(v => v.name);
  }

  let nextTags = current.tags || [];
  if (updates && 'tags' in updates) {
    const tagsInput = Array.isArray(updates.tags) ? updates.tags.slice(0, MAX_TAGS) : [];
    nextTags = tagsInput
      .map(t => clampString(String(t || '').trim(), LIMITS.tag))
      .filter(Boolean);
  }

  const next = {
    ...current,
    ...(updates?.name !== undefined ? { name: clampString(String(updates.name).trim(), LIMITS.name) } : {}),
    ...(updates?.description !== undefined ? { description: clampString(String(updates.description), LIMITS.description) } : {}),
    ...(updates?.content !== undefined ? { content: clampString(String(updates.content).trim(), LIMITS.content) } : {}),
    ...(updates?.variables !== undefined ? { variables: nextVariables } : {}),
    ...(updates?.tags !== undefined ? { tags: nextTags } : {}),
    updatedAt: nowMs(),
  };
  if (!next.name) throw new Error('Name is required');
  if (!next.content) throw new Error('Content is required');
  prompts[idx] = next;
  setAll(prompts);
  return next;
}

/**
 * Delete a prompt by id
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deletePrompt(id) {
  const prompts = getAll();
  const next = prompts.filter(p => p.id !== id);
  setAll(next);
}


