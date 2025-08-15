import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PromptManagementModal from '..';
import { PromptsProvider } from '../../../services/prompts/store';

function renderModal(props = {}) {
  return render(
    <PromptsProvider>
      <PromptManagementModal isOpen onClose={() => {}} {...props} />
    </PromptsProvider>
  );
}

test('renders and validates required fields', async () => {
  renderModal();
  expect(screen.getByText('Manage Prompts')).toBeInTheDocument();
  const save = screen.getByRole('button', { name: /save/i });
  expect(save).toBeDisabled();
});

test('can create then delete a prompt', async () => {
  renderModal();
  fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test Prompt' } });
  fireEvent.change(screen.getByLabelText(/content/i), { target: { value: 'Hello' } });

  const save = screen.getByRole('button', { name: /save/i });
  fireEvent.click(save);

  await waitFor(() => expect(screen.getByText('Test Prompt')).toBeInTheDocument());

  // select the item in list and delete
  fireEvent.click(screen.getByRole('button', { name: /^Delete$/i }));
  const deleteButtons = await screen.findAllByRole('button', { name: /^Delete$/i });
  fireEvent.click(deleteButtons[deleteButtons.length - 1]);
});

test('basic render shows title and disabled Save', () => {
  render(
    <PromptsProvider>
      <PromptManagementModal isOpen onClose={() => {}} />
    </PromptsProvider>
  );
  expect(screen.getByText('Manage Prompts')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
});


