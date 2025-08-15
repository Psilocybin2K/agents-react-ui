import { render, screen } from '@testing-library/react';

jest.mock('./components/ChatMemories', () => ({ __esModule: true, default: () => null }));
jest.mock('./services/prompts/store', () => ({
  __esModule: true,
  PromptsProvider: ({ children }) => children,
  usePrompts: () => ({ prompts: [], loading: false, error: null, refresh: jest.fn(), createPrompt: jest.fn(), updatePrompt: jest.fn(), deletePrompt: jest.fn() }),
}));
jest.mock('./services/agents/store', () => ({
  __esModule: true,
  AgentsProvider: ({ children }) => children,
  useAgents: () => ({ agents: [], isLoading: false, error: null, refresh: jest.fn(), createAgent: jest.fn(), updateAgent: jest.fn(), deleteAgent: jest.fn() }),
}));

import App from './App';

test('renders app chrome', () => {
  render(<App />);
  expect(screen.getByText('Ciphy')).toBeInTheDocument();
  expect(screen.getByText(/GPT 4o Model/i)).toBeInTheDocument();
});
