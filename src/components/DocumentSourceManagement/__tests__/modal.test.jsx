import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DocumentSourceManagementModal from '..';

function renderModal(props = {}) {
  return render(
    <DocumentSourceManagementModal isOpen onClose={() => {}} {...props} />
  );
}

test('renders and validates required fields', async () => {
  renderModal();
  expect(screen.getByText('Manage Document Sources')).toBeInTheDocument();
  const save = screen.getByRole('button', { name: /save/i });
  expect(save).toBeDisabled();
  fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Policy Doc' } });
  expect(save).toBeDisabled();

  // default kind is text; require content
  fireEvent.change(screen.getByLabelText(/text content/i), { target: { value: 'Hello world' } });
  expect(save).not.toBeDisabled();
});

test('can create url doc then delete', async () => {
  renderModal();
  fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Site' } });
  fireEvent.click(screen.getByText('Kind'));
  fireEvent.click(screen.getByText('URL'));
  fireEvent.change(screen.getByLabelText(/^url$/i), { target: { value: 'https://example.com' } });
  const save = screen.getByRole('button', { name: /save/i });
  fireEvent.click(save);

  await waitFor(() => expect(screen.getByText('Site')).toBeInTheDocument());

  // Delete flow
  const deleteBtn = screen.getByRole('button', { name: /delete/i });
  fireEvent.click(deleteBtn);
  await waitFor(() => screen.getByRole('button', { name: /delete/i }));
  const confirmDelete = screen.getAllByRole('button', { name: /delete/i }).pop();
  fireEvent.click(confirmDelete);
});

test('snapshot: initial render structure', () => {
  const { container } = render(
    <DocumentSourceManagementModal isOpen onClose={() => {}} />
  );
  expect(container.firstChild).toMatchSnapshot();
});


