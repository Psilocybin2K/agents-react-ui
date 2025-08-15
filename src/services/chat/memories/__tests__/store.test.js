import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { ChatMemoriesProvider, useChatMemories } from '../../memories/store';

function Harness() {
  const { memories, createMemory, updateMemory, deleteMemory } = useChatMemories();
  return (
    <div>
      <div data-testid="count">{memories.length}</div>
      <button type="button" onClick={() => createMemory({ title: 'T', content: 'C' })}>create</button>
      <button type="button" onClick={() => { const first = memories[0]; if (first) updateMemory(first.id, { title: 'T2' }); }}>update</button>
      <button type="button" onClick={() => { const first = memories[0]; if (first) deleteMemory(first.id); }}>delete</button>
      <div data-testid="firstTitle">{memories[0]?.title || ''}</div>
    </div>
  );
}

describe('Chat memories store', () => {
  beforeEach(() => {
    window.localStorage && window.localStorage.clear();
  });

  test('create, update, delete sequence updates store state', async () => {
    render(
      <ChatMemoriesProvider threadId="t1">
        <Harness />
      </ChatMemoriesProvider>
    );

    const count = () => Number(screen.getByTestId('count').textContent);
    const firstTitle = () => screen.getByTestId('firstTitle').textContent;

    expect(count()).toBe(0);

    await act(async () => { fireEvent.click(screen.getByText('create')); });
    expect(count()).toBe(1);
    expect(firstTitle()).toBe('T');

    await act(async () => { fireEvent.click(screen.getByText('update')); });
    expect(firstTitle()).toBe('T2');

    await act(async () => { fireEvent.click(screen.getByText('delete')); });
    expect(count()).toBe(0);
  });
});


