import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import ChatMemoriesPanel from '..';

describe('ChatMemoriesPanel', () => {
  beforeEach(() => {
    window.localStorage && window.localStorage.clear();
  });

  test('renders and opens generate modal with candidates', async () => {
    const messages = [
      { id: '1', role: 'user', content: 'My name is Taylor.' },
      { id: '2', role: 'user', content: 'I prefer concise answers.' },
    ];
    render(<ChatMemoriesPanel threadId="t1" messages={messages} />);

    expect(screen.getByText('Memories')).toBeInTheDocument();
    
    // Click the generate button
    await act(async () => { 
      fireEvent.click(screen.getByRole('button', { name: 'Generate Memories' })); 
    });
    
    // Check that the modal content appears (the modal title should be unique)
    expect(screen.getByText('Review and edit suggested memories before saving.')).toBeInTheDocument();
  });
});


