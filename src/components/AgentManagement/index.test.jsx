import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AgentManagementModal from './index';
import { AgentsProvider } from '../../services/agents/store';

function openModal(ui) {
  return render(
    <AgentsProvider>
      {ui}
    </AgentsProvider>
  );
}

describe('AgentManagementModal', () => {
  beforeEach(() => {
    process.env.REACT_APP_SEED_AGENTS = '0';
    process.env.VITE_SEED_AGENTS = '0';
    window.localStorage && window.localStorage.clear();
  });

  test('opens and closes', () => {
    const onClose = jest.fn();
    openModal(<AgentManagementModal isOpen onClose={onClose} />);
    expect(screen.getByText('Manage Agents')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  test('create and delete agent', async () => {
    openModal(<AgentManagementModal isOpen onClose={() => {}} />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('New Agent')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('New Agent'));
    
    // Find the name input in the form (not the search input)
    const inputs = screen.getAllByRole('textbox');
    const nameInput = inputs.find(input => input.closest('[label="Name"]'));
    fireEvent.change(nameInput, { target: { value: 'Agent X' } });
    fireEvent.click(screen.getByText('Save'));
    
    // Wait for the agent to be created and appear in the list
    await waitFor(() => {
      expect(screen.getByText('Agent X')).toBeInTheDocument();
    });
    
    // Create a second agent to test selection after deletion
    fireEvent.click(screen.getByText('New Agent'));
    const nameInput2 = inputs.find(input => input.closest('[label="Name"]'));
    fireEvent.change(nameInput2, { target: { value: 'Agent Y' } });
    fireEvent.click(screen.getByText('Save'));
    
    // Wait for the second agent to be created
    await waitFor(() => {
      expect(screen.getByText('Agent Y')).toBeInTheDocument();
    });
    
    // Select the first agent and delete it
    const listButtons = screen.getAllByRole('button');
    fireEvent.click(listButtons.find(b => b.textContent.includes('Agent X')));
    fireEvent.click(screen.getByText('Delete'));
    // Confirm dialog opens and Delete button exists - click the primary Delete button in the dialog
    const deleteButtons = screen.getAllByText('Delete');
    const confirmDeleteButton = deleteButtons.find(button => button.getAttribute('appearance') === 'primary');
    fireEvent.click(confirmDeleteButton);
    
    // After deletion, Agent Y should be automatically selected
    await waitFor(() => {
      expect(screen.getByDisplayValue('Agent Y')).toBeInTheDocument();
    });
  });

  test('clone agent', async () => {
    openModal(<AgentManagementModal isOpen onClose={() => {}} />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('New Agent')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('New Agent'));
    
    // Find the name input in the form (not the search input)
    const inputs = screen.getAllByRole('textbox');
    const nameInput = inputs.find(input => input.closest('[label="Name"]'));
    fireEvent.change(nameInput, { target: { value: 'Agent X' } });
    fireEvent.click(screen.getByText('Save'));
    
    // Wait for the agent to be created and selected
    await waitFor(() => {
      expect(screen.getByText('Agent X')).toBeInTheDocument();
    });
    
    // Select the created agent
    const listButtons = screen.getAllByRole('button');
    fireEvent.click(listButtons.find(b => b.textContent.includes('Agent X')));
    
    // Clone button should appear when editing an existing agent
    expect(screen.getByText('Clone')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Clone'));
    
    // Should create a copy with "(Copy)" suffix
    await waitFor(() => {
      expect(screen.getByText('Agent X (Copy)')).toBeInTheDocument();
    });
  });

  test('delete last agent resets to empty state', async () => {
    openModal(<AgentManagementModal isOpen onClose={() => {}} />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('New Agent')).toBeInTheDocument();
    });
    
    // Create a single agent
    fireEvent.click(screen.getByText('New Agent'));
    const inputs = screen.getAllByRole('textbox');
    const nameInput = inputs.find(input => input.closest('[label="Name"]'));
    fireEvent.change(nameInput, { target: { value: 'Agent X' } });
    fireEvent.click(screen.getByText('Save'));
    
    // Wait for the agent to be created
    await waitFor(() => {
      expect(screen.getByText('Agent X')).toBeInTheDocument();
    });
    
    // Delete the agent (which is the last one)
    const listButtons = screen.getAllByRole('button');
    fireEvent.click(listButtons.find(b => b.textContent.includes('Agent X')));
    fireEvent.click(screen.getByText('Delete'));
    const deleteButtons = screen.getAllByText('Delete');
    const confirmDeleteButton = deleteButtons.find(button => button.getAttribute('appearance') === 'primary');
    fireEvent.click(confirmDeleteButton);
    
    // After deleting the last agent, name input should be empty
    await waitFor(() => {
      const nameInputAfterDelete = screen.getAllByRole('textbox').find(input => input.closest('[label="Name"]'));
      expect(nameInputAfterDelete.value).toBe('');
    });
    
    // Clone and Delete buttons should not be visible for empty state
    expect(screen.queryByText('Clone')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });
});


