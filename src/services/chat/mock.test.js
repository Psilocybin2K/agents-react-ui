import * as chat from './mock';

beforeEach(() => {
  chat.__resetStoreForTests();
});

test('create and list chats', () => {
  const c1 = chat.createChat('First');
  const c2 = chat.createChat('Second');
  const list = chat.listChats();
  // Sort by updatedAt desc; equal timestamps may keep insertion order
  const ids = list.map(c => c.id);
  expect(ids.includes(c1.id)).toBe(true);
  expect(ids.includes(c2.id)).toBe(true);
});

test('pinned chats appear first and are sorted by updatedAt within groups', async () => {
  const a = chat.createChat('A');
  const b = chat.createChat('B');
  const c = chat.createChat('C');

  // Pin B
  chat.pinChat(b.id, true);
  // Update B to be most recent among pinned
  await chat.sendMessage(b.id, 'ping');

  // Update C to be most recent among unpinned
  await chat.sendMessage(c.id, 'hello');

  const list = chat.listChats();
  const pinned = list.filter(x => x.pinned);
  const unpinned = list.filter(x => !x.pinned);

  // Pinned group comes first
  expect(pinned.length).toBe(1);
  expect(list[0].id).toBe(b.id);

  // Unpinned group sorted by updatedAt (c after update should be before a)
  const unpinnedIds = unpinned.map(x => x.id);
  expect(unpinnedIds[0]).toBe(c.id);
});

test('rename, pin, delete', () => {
  const c = chat.createChat('Original');
  chat.renameChat(c.id, 'Renamed');
  let fetched = chat.getChat(c.id);
  expect(fetched.title).toBe('Renamed');

  chat.pinChat(c.id, true);
  fetched = chat.getChat(c.id);
  expect(fetched.pinned).toBe(true);

  const ok = chat.deleteChat(c.id);
  expect(ok).toBe(true);
  expect(chat.getChat(c.id)).toBeNull();
});

test('search by title and message content', async () => {
  const c = chat.createChat('Grocery list');
  // add a message by sending one so updatedAt is maintained
  await chat.sendMessage(c.id, 'Need apples');
  const titleMatches = chat.searchChats('grocery');
  expect(titleMatches.length).toBe(1);
  const messageMatches = chat.searchChats('apples');
  expect(messageMatches.length).toBe(1);
});

test('sendMessage streams and persists assistant reply', async () => {
  const c = chat.createChat('Stream test');
  let deltas = '';
  const result = await chat.sendMessage(c.id, 'Hello?', {
    onDelta: (chunk) => { deltas += chunk; },
  });
  expect(result.id).toBeDefined();
  expect(deltas.length).toBeGreaterThan(0);
  const updated = chat.getChat(c.id);
  const last = updated.messages[updated.messages.length - 1];
  expect(last.role).toBe('assistant');
});

test('sendMessage can be aborted', async () => {
  const c = chat.createChat('Abort test');
  const controller = new AbortController();
  const promise = chat.sendMessage(c.id, 'This will abort', { signal: controller.signal });
  controller.abort();
  await expect(promise).rejects.toHaveProperty('name', 'AbortError');
});

test('returns are deep-cloned and safe to mutate', () => {
  const c = chat.createChat('Deep Clone');
  const fetched1 = chat.getChat(c.id);
  fetched1.title = 'Mutated';
  fetched1.messages.push({ id: 'x', role: 'user', content: 'hax', createdAt: new Date().toISOString() });
  const fetched2 = chat.getChat(c.id);
  expect(fetched2.title).toBe('Deep Clone');
  expect(fetched2.messages.length).toBe(0);
});

test('createChat default fields and unique IDs; timestamps are ISO', () => {
  const created = chat.createChat();
  expect(created.title).toBe('New chat');
  expect(typeof created.id).toBe('string');
  expect(typeof created.createdAt).toBe('string');
  expect(typeof created.updatedAt).toBe('string');
  expect(Array.isArray(created.messages)).toBe(true);
  // ISO validation
  expect(new Date(created.createdAt).toISOString()).toBe(created.createdAt);
  expect(new Date(created.updatedAt).toISOString()).toBe(created.updatedAt);

  const ids = new Set([created.id]);
  for (let i = 0; i < 200; i += 1) {
    ids.add(chat.createChat('x' + i).id);
  }
  expect(ids.size).toBe(201);
});

test('renameChat and pinChat update updatedAt only (not createdAt)', () => {
  const c = chat.createChat('Times');
  const orig = chat.getChat(c.id);
  chat.renameChat(c.id, 'Times2');
  const afterRename = chat.getChat(c.id);
  expect(afterRename.createdAt).toBe(orig.createdAt);
  expect(new Date(afterRename.updatedAt).getTime()).toBeGreaterThanOrEqual(new Date(orig.updatedAt).getTime());

  chat.pinChat(c.id, true);
  const afterPin = chat.getChat(c.id);
  expect(afterPin.createdAt).toBe(orig.createdAt);
  expect(new Date(afterPin.updatedAt).getTime()).toBeGreaterThanOrEqual(new Date(afterRename.updatedAt).getTime());
});

test('searchChats behaviors: empty query, trimming, case-insensitive, title and content match, sorted order', async () => {
  const c1 = chat.createChat('Hello World');
  const c2 = chat.createChat('lowercase title');
  await chat.sendMessage(c2.id, 'Message With MixedCase and emojis 😊');

  const all = chat.listChats();
  const empty = chat.searchChats('');
  expect(empty.map(c => c.id)).toEqual(all.map(c => c.id));

  const trimmed = chat.searchChats('  hello  ');
  expect(trimmed.find(c => c.id === c1.id)).toBeTruthy();

  const caseInsensitive = chat.searchChats('mixedcase');
  expect(caseInsensitive.find(c => c.id === c2.id)).toBeTruthy();

  // Ensure search results are pinned-first + recency-sorted
  chat.pinChat(c2.id, true);
  await chat.sendMessage(c2.id, 'update recency');
  const results = chat.searchChats('title');
  expect(results[0].id).toBe(c2.id);
});

test('sendMessage streams chunks including whitespace and final equals assembled deltas', async () => {
  const c = chat.createChat('Stream whitespace');
  let deltas = '';
  const result = await chat.sendMessage(c.id, 'With spaces and  multiple   spaces', {
    onDelta: (chunk) => { deltas += chunk; },
  });
  expect(typeof result.content).toBe('string');
  expect(deltas.length).toBeGreaterThan(0);
  expect(result.content).toBe(deltas);
});

test('aborting before first chunk yields AbortError and no assistant message is saved', async () => {
  const c = chat.createChat('Pre-abort');
  const controller = new AbortController();
  controller.abort();
  const before = chat.getChat(c.id);
  const userCountBefore = before.messages.length;
  await expect(chat.sendMessage(c.id, 'x', { signal: controller.signal })).rejects.toHaveProperty('name', 'AbortError');
  const after = chat.getChat(c.id);
  // user message was still persisted before streaming starts
  expect(after.messages.length).toBe(userCountBefore + 1);
  const last = after.messages[after.messages.length - 1];
  expect(last.role).toBe('user');
});

test('persistence across reload and malformed localStorage handling', async () => {
  const c = chat.createChat('Persist Me');
  await chat.sendMessage(c.id, 'Hello persistence');

  // Simulate reload by reloading module and reading from localStorage
  const key = 'chatStore_v1';
  const snapshot = window.localStorage.getItem(key);
  expect(snapshot).toBeTruthy();

  jest.isolateModules(() => {
    // eslint-disable-next-line global-require
    const reloaded = require('./mock');
    const list = reloaded.listChats();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    const got = reloaded.getChat(list[0].id);
    expect(Array.isArray(got.messages)).toBe(true);
    expect(got.messages.length).toBeGreaterThan(0);
  });

  // Malformed JSON should not throw and yields empty store
  window.localStorage.setItem(key, 'not-json');
  jest.isolateModules(() => {
    // eslint-disable-next-line global-require
    const reloaded = require('./mock');
    const list = reloaded.listChats();
    expect(list.length).toBe(0);
  });
});

test('write failures (quota) do not crash operations', () => {
  const orig = window.localStorage.setItem;
  window.localStorage.setItem = () => { throw new Error('quota'); };
  expect(() => chat.createChat('No Crash')).not.toThrow();
  // restore
  window.localStorage.setItem = orig;
});


