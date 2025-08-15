import { getAllMap, setAllMap } from '../../memories/storage';
import { listMemories, createMemory, updateMemory, deleteMemory, generateMemoriesFromMessages } from '../../memories';

describe('chat memories service', () => {
  const threadId = 't1';

  beforeEach(() => {
    setAllMap({});
  });

  test('listMemories returns array for thread', async () => {
    const list = await listMemories(threadId);
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBe(0);
  });

  test('createMemory validates and persists', async () => {
    await expect(createMemory(threadId, { title: '', content: '' })).rejects.toThrow();
    const created = await createMemory(threadId, { title: 'Title', content: 'Content', kind: 'fact' });
    expect(created.id).toBeDefined();
    const all = await listMemories(threadId);
    expect(all.find(m => m.id === created.id)).toBeTruthy();
  });

  test('updateMemory updates fields and validates requireds', async () => {
    const created = await createMemory(threadId, { title: 'T', content: 'C' });
    const updated = await updateMemory(threadId, created.id, { title: 'T2', content: 'C2', importance: 0.8 });
    expect(updated.title).toBe('T2');
    expect(updated.content).toBe('C2');
    expect(updated.importance).toBeGreaterThan(0.7);
    await expect(updateMemory(threadId, created.id, { title: '' })).rejects.toThrow();
  });

  test('deleteMemory removes record', async () => {
    const created = await createMemory(threadId, { title: 'T', content: 'C' });
    await deleteMemory(threadId, created.id);
    const all = await listMemories(threadId);
    expect(all.find(m => m.id === created.id)).toBeFalsy();
  });

  test('generateMemoriesFromMessages returns candidates', async () => {
    const messages = [
      { id: 'm1', role: 'user', content: 'My name is Alex.' },
      { id: 'm2', role: 'user', content: 'I prefer concise answers.' },
      { id: 'm3', role: 'assistant', content: 'Okay.' },
    ];
    const cands = await generateMemoriesFromMessages(messages, { windowSize: 10, maxCandidates: 5 });
    expect(Array.isArray(cands)).toBe(true);
    expect(cands.length).toBeGreaterThan(0);
  });
});


