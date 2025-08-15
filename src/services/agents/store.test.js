import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { AgentsProvider, useAgents } from './store';

function Harness() {
  const { agents, createAgent, updateAgent, deleteAgent } = useAgents();
  return (
    <div>
      <div data-testid="count">{agents.length}</div>
      <button type="button" onClick={() => createAgent({ name: 'A' })}>create</button>
      <button
        type="button"
        onClick={() => {
          const first = agents[0];
          if (first) updateAgent(first.id, { name: 'B' });
        }}
      >update</button>
      <button
        type="button"
        onClick={() => {
          const first = agents[0];
          if (first) deleteAgent(first.id);
        }}
      >delete</button>
      <div data-testid="firstName">{agents[0]?.name || ''}</div>
    </div>
  );
}

describe('Agents store', () => {
  beforeEach(() => {
    // disable seeding and clear storage
    process.env.REACT_APP_SEED_AGENTS = '0';
    process.env.VITE_SEED_AGENTS = '0';
    window.localStorage && window.localStorage.clear();
  });

  test('create, update, delete sequence updates store state', async () => {
    render(
      <AgentsProvider>
        <Harness />
      </AgentsProvider>
    );

    const count = () => Number(screen.getByTestId('count').textContent);
    const firstName = () => screen.getByTestId('firstName').textContent;

    expect(count()).toBe(0);

    await act(async () => { fireEvent.click(screen.getByText('create')); });
    expect(count()).toBe(1);
    expect(firstName()).toBe('A');

    await act(async () => { fireEvent.click(screen.getByText('update')); });
    expect(firstName()).toBe('B');

    await act(async () => { fireEvent.click(screen.getByText('delete')); });
    expect(count()).toBe(0);
  });
});


