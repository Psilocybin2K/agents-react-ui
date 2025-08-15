// Select client based on environment flag VITE_USE_MOCK (truthy => mock)
// Fallback to mock in undefined environments
import * as chatAll from './chat';

const envFlag = (typeof process !== 'undefined' && process.env)
  ? (process.env.VITE_USE_MOCK ?? process.env.REACT_APP_USE_MOCK ?? '1')
  : '1';
const useMock = String(envFlag) !== '0' && String(envFlag).toLowerCase() !== 'false';
const chat = useMock ? chatAll.mock : chatAll.api;

export { chat };

// Agents namespace (storage-backed)
export * as agents from './agents';

// Prompts namespace (storage-backed)
export * as prompts from './prompts';

// Chat Memories (storage-backed)
export * as chatMemories from './chat/memories';


