// API client scaffold with the same interface as mock.js
// These are no-op placeholders for now.

export function listChats() {
  return [];
}

export function getChat() {
  return null;
}

export function createChat() {
  throw new Error('API client not implemented');
}

export function renameChat() {
  throw new Error('API client not implemented');
}

export function deleteChat() {
  throw new Error('API client not implemented');
}

export function pinChat() {
  throw new Error('API client not implemented');
}

export function searchChats() {
  return [];
}

export function sendMessage() {
  return Promise.reject(new Error('API client not implemented'));
}


