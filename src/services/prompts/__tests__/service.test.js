import { getAll, setAll, clear } from '../storage';
import { listPrompts, createPrompt, updatePrompt, deletePrompt } from '..';

beforeEach(() => {
  clear();
});

test('listPrompts returns array (may seed)', async () => {
  const list = await listPrompts();
  expect(Array.isArray(list)).toBe(true);
});

test('createPrompt validates and persists', async () => {
  await expect(createPrompt({ name: '', content: '' })).rejects.toThrow();
  const created = await createPrompt({ name: 'A', content: 'Body' });
  expect(created.id).toBeDefined();
  const all = getAll();
  expect(all.find(p => p.id === created.id)).toBeTruthy();
});

test('updatePrompt updates fields and maintains requireds', async () => {
  const created = await createPrompt({ name: 'A', content: 'Body' });
  const updated = await updatePrompt(created.id, { name: 'B', content: 'New' });
  expect(updated.name).toBe('B');
  expect(updated.content).toBe('New');
  await expect(updatePrompt(created.id, { name: '' })).rejects.toThrow();
});

test('deletePrompt removes record', async () => {
  const created = await createPrompt({ name: 'A', content: 'Body' });
  await deletePrompt(created.id);
  const all = getAll();
  expect(all.find(p => p.id === created.id)).toBeFalsy();
});


