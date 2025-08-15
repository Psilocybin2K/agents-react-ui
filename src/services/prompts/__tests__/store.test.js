import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { PromptsProvider, usePrompts } from '../store';

function wrapper({ children }) {
  return <PromptsProvider>{children}</PromptsProvider>;
}

test('store loads and creates/updates/deletes', async () => {
  const { result } = renderHook(() => usePrompts(), { wrapper });
  expect(Array.isArray(result.current.prompts)).toBe(true);

  let created;
  await act(async () => {
    created = await result.current.createPrompt({ name: 'X', content: 'Body' });
  });
  expect(result.current.prompts.find(p => p.id === created.id)).toBeTruthy();

  await act(async () => {
    const updated = await result.current.updatePrompt(created.id, { name: 'Y' });
    expect(updated.name).toBe('Y');
  });

  await act(async () => {
    await result.current.deletePrompt(created.id);
  });
  expect(result.current.prompts.find(p => p.id === created.id)).toBeFalsy();
});


