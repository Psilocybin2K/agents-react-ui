// Chat memories service: CRUD and generator helpers backed by localStorage adapter
/**
 * @typedef {import('../../../types').Memory} Memory
 * @typedef {import('../../../types').MemoryGenerationOptions} MemoryGenerationOptions
 */
import { getByThread, setByThread } from './storage';

function nowMs() {
  return Date.now();
}

function generateId() {
  return 'mem_' + Math.random().toString(36).slice(2, 10) + '_' + nowMs().toString(36);
}

function clampString(input, max) {
  if (typeof input !== 'string') return '';
  if (max && input.length > max) return input.slice(0, max);
  return input;
}

const LIMITS = {
  title: 100,
  content: 1000,
  tag: 50,
};

/**
 * List memories for a thread.
 * @param {string} threadId
 * @returns {Promise<Memory[]>}
 */
export async function listMemories(threadId) {
  const items = getByThread(threadId);
  return items.slice().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

/**
 * Create a memory in a thread.
 * @param {string} threadId
 * @param {{ title: string; content: string; kind?: Memory['kind']; importance?: number; tags?: string[]; sourceMessageIds?: string[]; origin?: 'manual'|'auto'; }} data
 * @returns {Promise<Memory>}
 */
export async function createMemory(threadId, data) {
  const list = getByThread(threadId);
  const title = clampString(String(data?.title || '').trim(), LIMITS.title);
  const content = clampString(String(data?.content || '').trim(), LIMITS.content);
  if (!title) throw new Error('Title is required');
  if (!content) throw new Error('Content is required');
  const tags = Array.isArray(data?.tags) ? data.tags.map(t => clampString(String(t || '').trim(), LIMITS.tag)).filter(Boolean).slice(0, 10) : [];
  const mem = {
    id: generateId(),
    threadId,
    title,
    content,
    kind: data?.kind || 'other',
    importance: typeof data?.importance === 'number' ? Math.max(0, Math.min(1, data.importance)) : 0.5,
    sourceMessageIds: Array.isArray(data?.sourceMessageIds) ? data.sourceMessageIds.slice(0, 20) : [],
    origin: data?.origin || 'manual',
    tags,
    createdAt: nowMs(),
    updatedAt: nowMs(),
  };
  const next = list.concat(mem);
  setByThread(threadId, next);
  return mem;
}

/**
 * Update a memory.
 * @param {string} threadId
 * @param {string} id
 * @param {Partial<Memory>} updates
 * @returns {Promise<Memory>}
 */
export async function updateMemory(threadId, id, updates) {
  const list = getByThread(threadId);
  const idx = list.findIndex(m => m.id === id);
  if (idx === -1) throw new Error('Memory not found');
  const current = list[idx];
  const next = {
    ...current,
    ...(updates?.title !== undefined ? { title: clampString(String(updates.title).trim(), LIMITS.title) } : {}),
    ...(updates?.content !== undefined ? { content: clampString(String(updates.content).trim(), LIMITS.content) } : {}),
    ...(updates?.kind !== undefined ? { kind: updates.kind } : {}),
    ...(updates?.importance !== undefined ? { importance: Math.max(0, Math.min(1, Number(updates.importance))) } : {}),
    ...(updates?.tags !== undefined ? { tags: (Array.isArray(updates.tags) ? updates.tags.map(t => clampString(String(t || '').trim(), LIMITS.tag)).filter(Boolean).slice(0, 10) : current.tags || []) } : {}),
    ...(updates?.sourceMessageIds !== undefined ? { sourceMessageIds: (Array.isArray(updates.sourceMessageIds) ? updates.sourceMessageIds.slice(0, 20) : current.sourceMessageIds || []) } : {}),
    ...(updates?.origin !== undefined ? { origin: updates.origin } : {}),
    updatedAt: nowMs(),
  };
  if (!next.title) throw new Error('Title is required');
  if (!next.content) throw new Error('Content is required');
  const out = list.slice();
  out[idx] = next;
  setByThread(threadId, out);
  return next;
}

/**
 * Delete a memory.
 * @param {string} threadId
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteMemory(threadId, id) {
  const list = getByThread(threadId);
  const next = list.filter(m => m.id !== id);
  setByThread(threadId, next);
}

/**
 * Generate candidate memories from messages using lightweight heuristics.
 * This is a placeholder for future LLM-based extraction.
 * @param {Array<{ id: string; role: 'user'|'assistant'|'system'; content: string; createdAt?: number }>} messages
 * @param {MemoryGenerationOptions=} options
 * @returns {Promise<Array<{ title: string; content: string; kind: Memory['kind']; importance: number; sourceMessageIds?: string[]; origin: 'manual'|'auto'; }>>}
 */
export async function generateMemoriesFromMessages(messages, options) {
  const opts = options || {};
  const windowSize = typeof opts.windowSize === 'number' ? opts.windowSize : 20;
  const maxCandidates = typeof opts.maxCandidates === 'number' ? opts.maxCandidates : 5;

  const recent = (Array.isArray(messages) ? messages : []).slice(-windowSize);
  const candidates = [];

  for (const msg of recent) {
    if (!msg || typeof msg.content !== 'string') continue;
    const text = msg.content.trim();
    if (!text) continue;

    // Simple cue extraction
    const lower = text.toLowerCase();
    let kind = 'other';
    if (/(my name is|i am called|i'm)/i.test(text)) kind = 'fact';
    else if (/(i prefer|i like|i usually|please always)/i.test(text)) kind = 'preference';
    else if (/(todo|task|action item|please do|due on|deadline)/i.test(text)) kind = 'task';

    // Generate a compact title from first sentence fragment
    const sentence = text.split(/[.!?\n]/)[0].slice(0, 90);
    const title = sentence.length > 0 ? sentence : text.slice(0, 90);

    // Heuristic importance score
    let importance = 0.4;
    if (/(always|never|important|critical|required)/i.test(text)) importance += 0.2;
    if (kind === 'task') importance += 0.1;
    if (kind === 'preference') importance += 0.05;
    importance = Math.max(0, Math.min(1, importance));

    candidates.push({
      title,
      content: text.slice(0, 1000),
      kind,
      importance,
      sourceMessageIds: [msg.id].filter(Boolean),
      origin: 'auto',
    });
  }

  // Deduplicate by title/content hash (simple set)
  const seen = new Set();
  const unique = [];
  for (const c of candidates) {
    const key = (c.title + '|' + c.content).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(c);
  }

  // Sort by importance desc and trim
  unique.sort((a, b) => b.importance - a.importance);
  return unique.slice(0, maxCandidates);
}


