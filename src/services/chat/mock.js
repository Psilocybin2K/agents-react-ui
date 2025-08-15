import { getAgent } from '../agents';

// Chat mock service with localStorage persistence and streaming support

const STORAGE_KEY = 'chatStore_v1';

function generateId() {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch (_) {}
  const random = Math.random().toString(36).slice(2);
  return 'id-' + Date.now().toString(36) + '-' + random;
}

function nowIso() {
  return new Date().toISOString();
}

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch (_) {
    return null;
  }
}

function loadStore() {
  if (typeof localStorage === 'undefined') {
    return { chatsById: {}, chatIds: [] };
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? safeParse(raw) : null;
  if (!parsed || typeof parsed !== 'object') {
    return { chatsById: {}, chatIds: [] };
  }
  const { chatsById, chatIds } = parsed;
  if (!chatsById || !chatIds || !Array.isArray(chatIds)) {
    return { chatsById: {}, chatIds: [] };
  }
  return { chatsById, chatIds };
}

function saveStore(store) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (_) {}
}

let store = loadStore();

function getChatInternal(chatId) {
  return store.chatsById[chatId] || null;
}

function sortChatsForList(chats) {
  return chats
    .slice()
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      // Newest updated first
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
}

export function listChats() {
  const chats = store.chatIds.map(id => store.chatsById[id]).filter(Boolean);
  return sortChatsForList(chats).map(c => ({ ...c }));
}

export function getChat(chatId) {
  const chat = getChatInternal(chatId);
  return chat ? JSON.parse(JSON.stringify(chat)) : null;
}

export function createChat(title = 'New chat') {
  const id = generateId();
  const timestamp = nowIso();
  const chat = {
    id,
    title,
    pinned: false,
    createdAt: timestamp,
    updatedAt: timestamp,
    messages: []
  };
  store.chatsById[id] = chat;
  store.chatIds.push(id);
  saveStore(store);
  return { ...chat };
}

export function renameChat(chatId, newTitle) {
  const chat = getChatInternal(chatId);
  if (!chat) return null;
  chat.title = newTitle;
  chat.updatedAt = nowIso();
  saveStore(store);
  return { ...chat };
}

export function deleteChat(chatId) {
  if (!store.chatsById[chatId]) return false;
  delete store.chatsById[chatId];
  store.chatIds = store.chatIds.filter(id => id !== chatId);
  saveStore(store);
  return true;
}

export function pinChat(chatId, pinned = true) {
  const chat = getChatInternal(chatId);
  if (!chat) return null;
  chat.pinned = Boolean(pinned);
  chat.updatedAt = nowIso();
  saveStore(store);
  return { ...chat };
}

export function searchChats(query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return listChats();
  const matches = store.chatIds
    .map(id => store.chatsById[id])
    .filter(Boolean)
    .filter(chat => {
      if (chat.title && chat.title.toLowerCase().includes(q)) return true;
      return chat.messages && chat.messages.some(m => m.content && m.content.toLowerCase().includes(q));
    });
  return sortChatsForList(matches).map(c => ({ ...c }));
}

function createMessage(role, content, agentInfo = null) {
  return {
    id: generateId(),
    role,
    content,
    createdAt: nowIso(),
    agentInfo // Store agent information for assistant messages
  };
}

function makeAbortError() {
  try {
    // Some environments support DOMException
    return new DOMException('The operation was aborted.', 'AbortError');
  } catch (_) {
    const err = new Error('The operation was aborted.');
    err.name = 'AbortError';
    return err;
  }
}

function defaultResponder(userText) {
  const prefix = "You said: ";
  const suffix = userText.trim().endsWith('?')
    ? " Here's a way to think about it: break the problem down into smaller steps and iterate."
    : " Let me know if you'd like me to expand on any part.";
  return prefix + userText + suffix;
}

function streamChunks({ text, onDelta, signal, onDone, onAbort }) {
  const words = text.split(/(\s+)/); // keep spaces
  let index = 0;
  let cancelled = false;

  function cleanup() {
    if (signalListener) signal.removeEventListener('abort', signalListener);
  }

  function tick() {
    if (cancelled) return;
    if (index >= words.length) {
      cleanup();
      onDone();
      return;
    }
    const chunk = words[index++];
    if (onDelta) onDelta(chunk);
    timeoutId = setTimeout(tick, 20 + Math.floor(Math.random() * 30));
  }

  if (signal && signal.aborted) {
    onAbort();
    return () => {};
  }

  let timeoutId = null;
  const signalListener = signal
    ? () => {
        cancelled = true;
        if (timeoutId) clearTimeout(timeoutId);
        cleanup();
        onAbort();
      }
    : null;
  if (signal && signalListener) signal.addEventListener('abort', signalListener);

  timeoutId = setTimeout(tick, 0);
  return () => {
    cancelled = true;
    if (timeoutId) clearTimeout(timeoutId);
    cleanup();
  };
}

export async function sendMessage(chatId, userContent, options = {}) {
  const { onDelta, signal, responder = defaultResponder, agentIds } = options;
  const chat = getChatInternal(chatId);
  if (!chat) {
    return Promise.reject(new Error('Chat not found'));
  }

  const userMessage = createMessage('user', String(userContent || ''));
  chat.messages.push(userMessage);
  chat.updatedAt = nowIso();
  saveStore(store);

  // If multiple agents selected, handle multi-agent response
  if (agentIds && agentIds.length > 1) {
    return sendMultiAgentMessage(chatId, userMessage, agentIds, { onDelta, signal });
  }

  // Single agent or default response
  const fullText = responder(userMessage.content);
  let assembled = '';

  // Get agent info for single agent case
  let agentInfo = null;
  if (agentIds && agentIds.length === 1) {
    const agent = await getAgent(agentIds[0]);
    if (agent) {
      agentInfo = {
        agentIds: [agent.id],
        agentNames: [agent.name],
        isMultiAgent: false,
        agentCount: 1
      };
    }
  }

  return new Promise((resolve, reject) => {
    const stop = streamChunks({
      text: fullText,
      onDelta: chunk => {
        assembled += chunk;
        if (onDelta) onDelta(chunk);
      },
      signal,
      onDone: () => {
        const assistantMessage = createMessage('assistant', assembled, agentInfo);
        chat.messages.push(assistantMessage);
        chat.updatedAt = nowIso();
        saveStore(store);
        resolve({ ...assistantMessage });
      },
      onAbort: () => {
        reject(makeAbortError());
      }
    });

    if (signal && signal.aborted) {
      stop();
    }
  });
}

async function sendMultiAgentMessage(chatId, userMessage, agentIds, options = {}) {
  const { onDelta, signal } = options;
  const chat = getChatInternal(chatId);
  if (!chat) return;

  // Step 1: Get all selected agents
  const agents = [];
  for (const agentId of agentIds) {
    const agent = await getAgent(agentId);
    if (agent) {
      agents.push(agent);
    }
  }

  if (agents.length === 0) {
    // Fallback to default response if no agents found
    const defaultResponse = defaultResponder(userMessage.content);
    const assistantMessage = createMessage('assistant', defaultResponse);
    chat.messages.push(assistantMessage);
    chat.updatedAt = nowIso();
    saveStore(store);
    return assistantMessage;
  }

  // Step 2: Generate responses from all agents simultaneously
  const agentResponses = await Promise.all(
    agents.map(async (agent) => {
      try {
        // Simulate agent-specific response generation
        const agentResponse = await generateAgentResponse(agent, userMessage.content);
        return {
          agentId: agent.id,
          agentName: agent.name,
          content: agentResponse,
          success: true
        };
      } catch (error) {
        return {
          agentId: agent.id,
          agentName: agent.name,
          content: `Error: ${error.message}`,
          success: false
        };
      }
    })
  );

  // Step 3: Use a merge agent to create a coherent final response
  const mergedResponse = await mergeAgentResponses(userMessage.content, agentResponses);

  // Step 4: Stream the merged response
  const assistantMessage = createMessage('assistant', mergedResponse, { 
    agentIds,
    agentNames: agents.map(a => a.name),
    isMultiAgent: agents.length > 1,
    agentCount: agents.length
  });
  chat.messages.push(assistantMessage);
  chat.updatedAt = nowIso();
  saveStore(store);

  // Stream the response character by character
  let streamedText = '';
  for (const char of mergedResponse) {
    if (signal?.aborted) break;
    streamedText += char;
    onDelta?.(char);
    await new Promise(resolve => setTimeout(resolve, 10)); // Simulate streaming
  }

  return assistantMessage;
}

// Helper function to generate agent-specific responses
async function generateAgentResponse(agent, userMessage) {
  // Simulate different response styles based on agent characteristics
  const baseResponse = defaultResponder(userMessage);
  
  // Apply agent-specific modifications
  let response = baseResponse;
  
  if (agent.tags?.includes('technical')) {
    response = `[Technical Analysis] ${response}`;
  } else if (agent.tags?.includes('creative')) {
    response = `[Creative Perspective] ${response}`;
  } else if (agent.tags?.includes('analytical')) {
    response = `[Analytical View] ${response}`;
  }
  
  // Add agent signature
  response += `\n\n— Generated by ${agent.name}`;
  
  return response;
}

// Helper function to merge multiple agent responses using a merge agent
async function mergeAgentResponses(userMessage, agentResponses) {
  // Filter out failed responses
  const successfulResponses = agentResponses.filter(r => r.success);
  
  if (successfulResponses.length === 0) {
    return "I apologize, but I encountered issues generating responses from the selected agents.";
  }

  if (successfulResponses.length === 1) {
    return successfulResponses[0].content;
  }

  // Create a structured prompt for the merge agent
  const mergePrompt = `
User Question: "${userMessage}"

Individual Agent Responses:
${successfulResponses.map((r, index) => `
Agent ${index + 1} (${r.agentName}):
${r.content}
`).join('\n')}

Please create a coherent, natural response that synthesizes the insights from all agents. 
The response should:
- Be well-structured and easy to follow
- Incorporate the best insights from each agent
- Maintain a natural conversational tone
- Not repeat information unnecessarily
- Provide a comprehensive answer to the user's question

Merged Response:`;

  // Simulate the merge agent processing
  // In a real implementation, this would call an actual AI service
  const mergedContent = await simulateMergeAgent(mergePrompt);
  
  return mergedContent;
}

// Simulate the merge agent processing
async function simulateMergeAgent(prompt) {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Extract the individual responses from the prompt
  const responseMatch = prompt.match(/Individual Agent Responses:\n([\s\S]*?)\n\nPlease create/);
  if (!responseMatch) {
    return "I've synthesized the available information to provide you with a comprehensive answer.";
  }
  
  const responsesText = responseMatch[1];
  const responses = responsesText.split(/Agent \d+ \([^)]+\):/).filter(Boolean);
  
  // Create a synthesized response
  let mergedResponse = "Based on the analysis from multiple specialized agents, here's a comprehensive answer:\n\n";
  
  // Extract key insights from each response
  responses.forEach((response, index) => {
    const cleanResponse = response.trim();
    if (cleanResponse) {
      // Remove agent signatures and tags for cleaner synthesis
      const cleanContent = cleanResponse
        .replace(/\[[^\]]+\]/g, '') // Remove tags like [Technical Analysis]
        .replace(/— Generated by [^\n]+/g, '') // Remove signatures
        .trim();
      
      if (cleanContent) {
        mergedResponse += `${cleanContent}\n\n`;
      }
    }
  });
  
  // Add a conclusion
  mergedResponse += "This synthesized response combines the expertise of multiple agents to provide you with the most comprehensive and accurate information available.";
  
  return mergedResponse;
}

export function updateMessage(chatId, messageId, content) {
  const chat = getChatInternal(chatId);
  if (!chat) return null;
  const idx = chat.messages.findIndex(m => m.id === messageId);
  if (idx === -1) return null;
  const updated = { ...chat.messages[idx], content: String(content || '') };
  chat.messages[idx] = updated;
  chat.updatedAt = nowIso();
  saveStore(store);
  return { ...updated };
}

export function deleteMessage(chatId, messageId) {
  const chat = getChatInternal(chatId);
  if (!chat) return null;
  const idx = chat.messages.findIndex(m => m.id === messageId);
  if (idx === -1) return null;
  const [removed] = chat.messages.splice(idx, 1);
  chat.updatedAt = nowIso();
  saveStore(store);
  return removed ? { ...removed } : null;
}

export function replaceMessages(chatId, messages) {
  const chat = getChatInternal(chatId);
  if (!chat) return null;
  chat.messages = Array.isArray(messages) ? messages.map(m => ({ ...m })) : [];
  chat.updatedAt = nowIso();
  saveStore(store);
  return { ...chat };
}

export function forkChat(chatId, upToMessageId = null, newTitle = null) {
  const original = getChatInternal(chatId);
  if (!original) return null;
  const id = generateId();
  const timestamp = nowIso();
  let endIdx = original.messages.length - 1;
  if (upToMessageId) {
    const idx = original.messages.findIndex(m => m.id === upToMessageId);
    if (idx !== -1) endIdx = idx;
  }
  const copiedMessages = original.messages.slice(0, endIdx + 1).map(m => ({ ...m }));
  const chat = {
    id,
    title: newTitle || `${original.title || 'Chat'} (fork)`,
    pinned: false,
    createdAt: timestamp,
    updatedAt: timestamp,
    messages: copiedMessages,
  };
  store.chatsById[id] = chat;
  store.chatIds.push(id);
  saveStore(store);
  return { ...chat };
}

export function respondToLastUser(chatId) {
  const chat = getChatInternal(chatId);
  if (!chat) return null;
  const last = (chat.messages || [])[chat.messages.length - 1];
  if (!last || last.role !== 'user') return null;
  const assembled = defaultResponder(last.content || '');
  const assistantMessage = createMessage('assistant', assembled);
  chat.messages.push(assistantMessage);
  chat.updatedAt = nowIso();
  saveStore(store);
  return { ...assistantMessage };
}

export function updateChatAgentSelection(chatId, agentSelection) {
  const chat = getChatInternal(chatId);
  if (!chat) return null;
  chat.agentSelection = agentSelection;
  chat.updatedAt = nowIso();
  saveStore(store);
  return { ...chat };
}

export function getChatAgentSelection(chatId) {
  const chat = getChatInternal(chatId);
  return chat?.agentSelection || null;
}

// Optional initializer for consumers who want to ensure store exists
export function __resetStoreForTests() {
  store = { chatsById: {}, chatIds: [] };
  saveStore(store);
}


