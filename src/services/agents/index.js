// Agents service: CRUD operations backed by localStorage adapter
import { getAll, setAll, seedIfEmpty } from './storage';

const DEFAULT_SEED_FLAG = (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production') ? '0' : '1';

function nowMs() {
  return Date.now();
}

function generateId() {
  // Simple RFC4122-ish id; sufficient for client-only persistence
  return 'agt_' + Math.random().toString(36).slice(2, 10) + '_' + nowMs().toString(36);
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
  instructions: 5000,
  prompt: 5000,
};

/**
 * Optionally seed default agents when storage is empty.
 * Controlled by env flags: VITE_SEED_AGENTS or REACT_APP_SEED_AGENTS (truthy to enable).
 */
export function maybeSeed() {
  const env = (typeof process !== 'undefined' && process.env) ? process.env : {};
  const flag = env.VITE_SEED_AGENTS ?? env.REACT_APP_SEED_AGENTS ?? DEFAULT_SEED_FLAG;
  const enabled = String(flag) !== '0' && String(flag).toLowerCase() !== 'false';
  if (!enabled) return false;
  const ts = nowMs();
  const seed = [
    {
      id: generateId(),
      name: 'General Assistant',
      description: 'Helpful AI assistant for general tasks',
      instructions: 'Be concise and helpful.',
      prompt: '',
      createdAt: ts,
      updatedAt: ts,
      tags: ['general']
    },
    {
      id: generateId(),
      name: 'Technical Expert',
      description: 'Specialized in technical and programming questions',
      instructions: 'Provide detailed technical explanations with code examples when appropriate.',
      prompt: '',
      createdAt: ts,
      updatedAt: ts,
      tags: ['technical', 'programming']
    },
    {
      id: generateId(),
      name: 'Creative Specialist',
      description: 'Focused on creative writing and brainstorming',
      instructions: 'Be imaginative and creative in your responses. Think outside the box.',
      prompt: '',
      createdAt: ts,
      updatedAt: ts,
      tags: ['creative', 'writing']
    },
    {
      id: generateId(),
      name: 'Analytical Thinker',
      description: 'Deep analytical and problem-solving capabilities',
      instructions: 'Break down complex problems into logical steps. Provide thorough analysis.',
      prompt: '',
      createdAt: ts,
      updatedAt: ts,
      tags: ['analytical', 'problem-solving']
    },
    {
      id: generateId(),
      name: 'Research Assistant',
      description: 'Specialized in research and fact-checking',
      instructions: 'Provide well-researched answers with citations when possible.',
      prompt: '',
      createdAt: ts,
      updatedAt: ts,
      tags: ['research', 'fact-checking']
    }
  ];
  return seedIfEmpty(seed);
}

/**
 * List all agents.
 * @returns {Promise<Agent[]>}
 */
export async function listAgents() {
  // Ensure seed once per session if applicable
  maybeSeed();
  const agents = getAll();
  // Sort by updatedAt desc for stable ordering
  return agents.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

/**
 * Create a new agent
 * @param {{ name: string; description?: string; instructions?: string; prompt?: string; }} data
 * @returns {Promise<Agent>}
 */
export async function createAgent(data) {
  const name = clampString(String(data?.name || '').trim(), LIMITS.name);
  if (!name) {
    throw new Error('Name is required');
  }
  const agent = {
    id: generateId(),
    name,
    description: clampString(data?.description || '', LIMITS.description),
    instructions: clampString(data?.instructions || '', LIMITS.instructions),
    prompt: clampString(data?.prompt || '', LIMITS.prompt),
    createdAt: nowMs(),
    updatedAt: nowMs(),
  };
  const agents = getAll();
  agents.push(agent);
  setAll(agents);
  return agent;
}

/**
 * Update an existing agent by id
 * @param {string} id
 * @param {Partial<Agent>} updates
 * @returns {Promise<Agent>}
 */
export async function updateAgent(id, updates) {
  const agents = getAll();
  const idx = agents.findIndex(a => a.id === id);
  if (idx === -1) throw new Error('Agent not found');
  const current = agents[idx];
  const next = {
    ...current,
    ...(updates?.name !== undefined ? { name: clampString(String(updates.name).trim(), LIMITS.name) } : {}),
    ...(updates?.description !== undefined ? { description: clampString(String(updates.description), LIMITS.description) } : {}),
    ...(updates?.instructions !== undefined ? { instructions: clampString(String(updates.instructions), LIMITS.instructions) } : {}),
    ...(updates?.prompt !== undefined ? { prompt: clampString(String(updates.prompt), LIMITS.prompt) } : {}),
    updatedAt: nowMs(),
  };
  if (!next.name) throw new Error('Name is required');
  agents[idx] = next;
  setAll(agents);
  return next;
}

/**
 * Delete an agent by id
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteAgent(id) {
  const agents = getAll();
  const next = agents.filter(a => a.id !== id);
  setAll(next);
}

/**
 * Get a single agent by id
 * @param {string} id
 * @returns {Promise<Agent|null>}
 */
export async function getAgent(id) {
  const agents = getAll();
  const agent = agents.find(a => a.id === id);
  return agent ? { ...agent } : null;
}

