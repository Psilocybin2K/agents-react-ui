import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AgentSelection from './index';
import { AgentsProvider } from '../../services/agents/store';

function renderWithProviders(ui) {
  return render(
    <AgentsProvider>
      {ui}
    </AgentsProvider>
  );
}

describe('AgentSelection', () => {
  beforeEach(() => {
    process.env.REACT_APP_SEED_AGENTS = '0';
    process.env.VITE_SEED_AGENTS = '0';
    window.localStorage && window.localStorage.clear();
  });

  test('renders without crashing', () => {
    const onSelectionChange = jest.fn();
    renderWithProviders(
      <AgentSelection 
        selectedAgentIds={[]} 
        onSelectionChange={onSelectionChange} 
      />
    );
    expect(screen.getByText('Select agents...')).toBeInTheDocument();
  });

  test('shows selected agent count when agents are selected', () => {
    const onSelectionChange = jest.fn();
    const mockAgents = [
      { id: '1', name: 'Agent 1', description: 'Test agent 1' },
      { id: '2', name: 'Agent 2', description: 'Test agent 2' },
      { id: '3', name: 'Agent 3', description: 'Test agent 3' },
      { id: '4', name: 'Agent 4', description: 'Test agent 4' },
    ];
    
    // Mock the agents store
    jest.spyOn(require('../../services/agents/store'), 'useAgents').mockReturnValue({
      agents: mockAgents,
      addAgent: jest.fn(),
      updateAgent: jest.fn(),
      deleteAgent: jest.fn(),
    });

    renderWithProviders(
      <AgentSelection 
        selectedAgentIds={['1', '2']} 
        onSelectionChange={onSelectionChange} 
      />
    );
    expect(screen.getByText('2 agents selected')).toBeInTheDocument();
  });

  test('shows single agent name when only one agent is selected', () => {
    const onSelectionChange = jest.fn();
    const mockAgents = [
      { id: '1', name: 'Agent 1', description: 'Test agent 1' },
    ];
    
    jest.spyOn(require('../../services/agents/store'), 'useAgents').mockReturnValue({
      agents: mockAgents,
      addAgent: jest.fn(),
      updateAgent: jest.fn(),
      deleteAgent: jest.fn(),
    });

    renderWithProviders(
      <AgentSelection 
        selectedAgentIds={['1']} 
        onSelectionChange={onSelectionChange} 
      />
    );
    expect(screen.getByRole('button', { name: 'Agent 1' })).toBeInTheDocument();
  });

  test('disables agents when max limit (3) is reached', () => {
    const onSelectionChange = jest.fn();
    const mockAgents = [
      { id: '1', name: 'Agent 1', description: 'Test agent 1' },
      { id: '2', name: 'Agent 2', description: 'Test agent 2' },
      { id: '3', name: 'Agent 3', description: 'Test agent 3' },
      { id: '4', name: 'Agent 4', description: 'Test agent 4' },
    ];
    
    jest.spyOn(require('../../services/agents/store'), 'useAgents').mockReturnValue({
      agents: mockAgents,
      addAgent: jest.fn(),
      updateAgent: jest.fn(),
      deleteAgent: jest.fn(),
    });

    renderWithProviders(
      <AgentSelection 
        selectedAgentIds={['1', '2', '3']} 
        onSelectionChange={onSelectionChange} 
      />
    );
    
    // Open dropdown
    fireEvent.click(screen.getByText('3 agents selected'));
    
    // Check that Agent 4 checkbox is disabled
    const agent4Checkbox = screen.getByLabelText('Agent 4');
    expect(agent4Checkbox).toBeDisabled();
  });

  test('allows removing agents even when at max limit', () => {
    const onSelectionChange = jest.fn();
    const mockAgents = [
      { id: '1', name: 'Agent 1', description: 'Test agent 1' },
      { id: '2', name: 'Agent 2', description: 'Test agent 2' },
      { id: '3', name: 'Agent 3', description: 'Test agent 3' },
    ];
    
    jest.spyOn(require('../../services/agents/store'), 'useAgents').mockReturnValue({
      agents: mockAgents,
      addAgent: jest.fn(),
      updateAgent: jest.fn(),
      deleteAgent: jest.fn(),
    });

    renderWithProviders(
      <AgentSelection 
        selectedAgentIds={['1', '2', '3']} 
        onSelectionChange={onSelectionChange} 
      />
    );
    
    // Open dropdown
    fireEvent.click(screen.getByText('3 agents selected'));
    
    // Check that selected agents are not disabled
    const agent1Checkbox = screen.getByLabelText('Agent 1');
    expect(agent1Checkbox).not.toBeDisabled();
  });

  test('allows exactly 3 agents to be selected', () => {
    const onSelectionChange = jest.fn();
    const mockAgents = [
      { id: '1', name: 'Agent 1', description: 'Test agent 1' },
      { id: '2', name: 'Agent 2', description: 'Test agent 2' },
      { id: '3', name: 'Agent 3', description: 'Test agent 3' },
      { id: '4', name: 'Agent 4', description: 'Test agent 4' },
      { id: '5', name: 'Agent 5', description: 'Test agent 5' },
    ];
    
    jest.spyOn(require('../../services/agents/store'), 'useAgents').mockReturnValue({
      agents: mockAgents,
      addAgent: jest.fn(),
      updateAgent: jest.fn(),
      deleteAgent: jest.fn(),
    });

    renderWithProviders(
      <AgentSelection 
        selectedAgentIds={['1', '2', '3']} 
        onSelectionChange={onSelectionChange} 
      />
    );
    
    // Open dropdown
    fireEvent.click(screen.getByText('3 agents selected'));
    
    // Check that Agent 4 and Agent 5 are disabled
    const agent4Checkbox = screen.getByLabelText('Agent 4');
    const agent5Checkbox = screen.getByLabelText('Agent 5');
    expect(agent4Checkbox).toBeDisabled();
    expect(agent5Checkbox).toBeDisabled();
    
    // Check that selected agents (1, 2, 3) are not disabled
    const agent1Checkbox = screen.getByLabelText('Agent 1');
    const agent2Checkbox = screen.getByLabelText('Agent 2');
    const agent3Checkbox = screen.getByLabelText('Agent 3');
    expect(agent1Checkbox).not.toBeDisabled();
    expect(agent2Checkbox).not.toBeDisabled();
    expect(agent3Checkbox).not.toBeDisabled();
  });

  test('simulates step-by-step agent selection', () => {
    const onSelectionChange = jest.fn();
    const mockAgents = [
      { id: '1', name: 'Agent 1', description: 'Test agent 1' },
      { id: '2', name: 'Agent 2', description: 'Test agent 2' },
      { id: '3', name: 'Agent 3', description: 'Test agent 3' },
      { id: '4', name: 'Agent 4', description: 'Test agent 4' },
    ];
    
    jest.spyOn(require('../../services/agents/store'), 'useAgents').mockReturnValue({
      agents: mockAgents,
      addAgent: jest.fn(),
      updateAgent: jest.fn(),
      deleteAgent: jest.fn(),
    });

    const { rerender } = renderWithProviders(
      <AgentSelection 
        selectedAgentIds={[]} 
        onSelectionChange={onSelectionChange} 
      />
    );
    
    // Step 1: Select first agent
    fireEvent.click(screen.getByText('Select agents...'));
    fireEvent.click(screen.getByLabelText('Agent 1'));
    expect(onSelectionChange).toHaveBeenCalledWith(['1']);
    
    // Step 2: Select second agent
    onSelectionChange.mockClear();
    rerender(
      <AgentSelection 
        selectedAgentIds={['1']} 
        onSelectionChange={onSelectionChange} 
      />
    );
    fireEvent.click(screen.getByLabelText('Agent 2'));
    expect(onSelectionChange).toHaveBeenCalledWith(['1', '2']);
    
    // Step 3: Select third agent
    onSelectionChange.mockClear();
    rerender(
      <AgentSelection 
        selectedAgentIds={['1', '2']} 
        onSelectionChange={onSelectionChange} 
      />
    );
    fireEvent.click(screen.getByLabelText('Agent 3'));
    expect(onSelectionChange).toHaveBeenCalledWith(['1', '2', '3']);
    
    // Step 4: Try to select fourth agent (should be disabled)
    onSelectionChange.mockClear();
    rerender(
      <AgentSelection 
        selectedAgentIds={['1', '2', '3']} 
        onSelectionChange={onSelectionChange} 
      />
    );
    const agent4Checkbox = screen.getByLabelText('Agent 4');
    expect(agent4Checkbox).toBeDisabled();
    fireEvent.click(agent4Checkbox);
    expect(onSelectionChange).not.toHaveBeenCalled(); // Should not call onSelectionChange
  });
});
