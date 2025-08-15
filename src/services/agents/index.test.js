import { listAgents, createAgent, updateAgent, deleteAgent } from './index';
import { clear as clearStorage } from './storage';

describe('agents service (localStorage)', () => {
  beforeEach(() => {
    // Disable seeding for deterministic tests
    process.env.REACT_APP_SEED_AGENTS = '0';
    process.env.VITE_SEED_AGENTS = '0';
    clearStorage();
  });

  test('listAgents returns an empty array when no data', async () => {
    const agents = await listAgents();
    expect(Array.isArray(agents)).toBe(true);
    expect(agents.length).toBe(0);
  });

  test('createAgent persists and returns an agent with id and timestamps', async () => {
    const created = await createAgent({ name: 'Test Agent' });
    expect(created).toBeTruthy();
    expect(typeof created.id).toBe('string');
    expect(created.name).toBe('Test Agent');
    expect(typeof created.createdAt).toBe('number');
    expect(typeof created.updatedAt).toBe('number');

    const agents = await listAgents();
    expect(agents.find(a => a.id === created.id)).toBeTruthy();
  });

  test('updateAgent updates fields and timestamp', async () => {
    const created = await createAgent({ name: 'Original' });
    const updated = await updateAgent(created.id, { name: 'Updated', description: 'desc' });
    expect(updated.name).toBe('Updated');
    expect(updated.description).toBe('desc');
    expect(updated.updatedAt).toBeGreaterThanOrEqual(created.updatedAt);
  });

  test('deleteAgent removes the record', async () => {
    const a = await createAgent({ name: 'A' });
    const b = await createAgent({ name: 'B' });
    await deleteAgent(a.id);
    const agents = await listAgents();
    expect(agents.find(x => x.id === a.id)).toBeFalsy();
    expect(agents.find(x => x.id === b.id)).toBeTruthy();
  });
});


