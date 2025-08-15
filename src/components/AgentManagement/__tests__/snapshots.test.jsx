import React from 'react';
import { render, screen } from '@testing-library/react';
import AgentManagementModal from '../index';
import { PromptsProvider } from '../../../services/prompts/store';
import { AgentsProvider } from '../../../services/agents/store';

describe('AgentManagementModal snapshots', () => {
  beforeEach(() => {
    process.env.REACT_APP_SEED_AGENTS = '0';
    process.env.VITE_SEED_AGENTS = '0';
    if (window.localStorage) window.localStorage.clear();
  });

  test('empty list state', async () => {
    render(
      <PromptsProvider>
        <AgentsProvider>
          <AgentManagementModal isOpen onClose={() => {}} />
        </AgentsProvider>
      </PromptsProvider>
    );
    expect(await screen.findByText('Manage Agents')).toBeInTheDocument();
  });

  test('populated list state', async () => {
    const snapshotAgents = [
      { id: 'a1', name: 'Alpha', description: 'desc', instructions: '', prompt: '', createdAt: Date.now(), updatedAt: Date.now() },
      { id: 'b2', name: 'Beta', description: '', instructions: '', prompt: '', createdAt: Date.now(), updatedAt: Date.now() },
    ];
    window.localStorage.setItem('ado.agents.v1', JSON.stringify(snapshotAgents));
    render(
      <PromptsProvider>
        <AgentsProvider>
          <AgentManagementModal isOpen onClose={() => {}} />
        </AgentsProvider>
      </PromptsProvider>
    );
    await screen.findByText('Manage Agents');
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  test('error state', () => {
    const store = require('../../../services/agents/store');
    const spy = jest.spyOn(store, 'useAgents').mockReturnValue({
      agents: [],
      isLoading: false,
      error: new Error('Load failed'),
      refresh: jest.fn(),
      createAgent: jest.fn(),
      updateAgent: jest.fn(),
      deleteAgent: jest.fn(),
    });
    render(
      <PromptsProvider>
        <AgentManagementModal isOpen onClose={() => {}} />
      </PromptsProvider>
    );
    expect(screen.getByText('Load failed')).toBeInTheDocument();
    spy.mockRestore();
  });
});


