import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import Sidebar from './components/Sidebar';
import AgentManagementModal from './components/AgentManagement';
import PromptManagementModal from './components/PromptManagement';
import DocumentSourceManagementModal from './components/DocumentSourceManagement';
import ChatPanel from './components/ChatPanel';
import InfoPanel from './components/InfoPanel';
import useStyles from './App.styles';
import { chat as chatService } from './services';
import { AgentsProvider } from './services/agents/store';
import { PromptsProvider } from './services/prompts/store';
import { PluginsProvider } from './services/plugins';
import dateTimePlugin from './plugins/date-time';

export default function App() {
  const styles = useStyles();
  const [chats, setChats] = useState([]);
  const [displayChats, setDisplayChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
  const manageAgentsBtnRef = useRef(null);
  const manageDocumentsBtnRef = useRef(null);

  const refreshChats = useCallback(() => {
    const next = chatService.listChats();
    setChats(next);
    if (searchQuery && searchQuery.trim()) {
      setDisplayChats(chatService.searchChats(searchQuery));
    } else {
      setDisplayChats(next);
    }
  }, [searchQuery]);

  useEffect(() => {
    let current = chatService.listChats();
    if (!current || current.length === 0) {
      const created = chatService.createChat('New chat');
      current = chatService.listChats();
      setSelectedChatId(created.id);
    } else {
      setSelectedChatId(prev => prev || current[0]?.id || null);
    }
    setChats(current);
    setDisplayChats(current);
  }, []);

  useEffect(() => {
    if (searchQuery && searchQuery.trim()) {
      setDisplayChats(chatService.searchChats(searchQuery));
    } else {
      setDisplayChats(chats);
    }
  }, [searchQuery, chats]);

  const selectedChat = useMemo(() => {
    return selectedChatId ? chatService.getChat(selectedChatId) : null;
  }, [selectedChatId, chats]);

  const lastAssistantMessage = useMemo(() => {
    const messages = selectedChat?.messages || [];
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].role === 'assistant') return messages[i];
    }
    return null;
  }, [selectedChat]);

  const handleCreateChat = useCallback((precreated) => {
    if (precreated && precreated.id) {
      // Use provided chat (e.g., fork) and select it
      setSelectedChatId(precreated.id);
      refreshChats();
      return;
    }
    const created = chatService.createChat('New chat');
    setSelectedChatId(created.id);
    refreshChats();
  }, [refreshChats]);

  const handleSelectChat = useCallback((chatId) => {
    setSelectedChatId(chatId);
  }, []);

  const handleTogglePin = useCallback((chatId) => {
    const chat = chatService.getChat(chatId);
    if (!chat) return;
    chatService.pinChat(chatId, !chat.pinned);
    refreshChats();
  }, [refreshChats]);

  const handleDeleteChat = useCallback((chatId) => {
    if (!chatId) return;
    const wasSelected = chatId === selectedChatId;
    chatService.deleteChat(chatId);
    const next = chatService.listChats();
    setChats(next);
    if (wasSelected) {
      setSelectedChatId(next[0]?.id || null);
    }
    if (searchQuery && searchQuery.trim()) {
      setDisplayChats(chatService.searchChats(searchQuery));
    } else {
      setDisplayChats(next);
    }
  }, [selectedChatId, searchQuery]);

  const pinnedChats = useMemo(() => displayChats.filter(c => c.pinned), [displayChats]);
  const recentChats = useMemo(() => displayChats.filter(c => !c.pinned), [displayChats]);
    return (
      <FluentProvider theme={webLightTheme}>
        <PromptsProvider>
        <AgentsProvider>
        <PluginsProvider plugins={[dateTimePlugin]}>
      <div className={styles.root}>
        <Sidebar
          pinnedChats={pinnedChats}
          recentChats={recentChats}
          selectedChatId={selectedChatId}
          onCreateChat={handleCreateChat}
          onSelectChat={handleSelectChat}
          onTogglePin={handleTogglePin}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onOpenAgents={() => setIsAgentModalOpen(true)}
          onOpenPrompts={() => setIsPromptModalOpen(true)}
          onOpenDocuments={() => setIsDocumentsModalOpen(true)}
          manageAgentsButtonRef={manageAgentsBtnRef}
          manageDocumentsButtonRef={manageDocumentsBtnRef}
        />
        <div className={styles.chatPanel}>
          <ChatPanel
            chat={selectedChat}
            onNewChat={handleCreateChat}
            onDeleteChat={() => handleDeleteChat(selectedChatId)}
            onRequestRefresh={refreshChats}
          />
        </div>
        <InfoPanel lastAssistantMessage={lastAssistantMessage} />
        <AgentManagementModal
          isOpen={isAgentModalOpen}
          onClose={() => {
            setIsAgentModalOpen(false);
            // Return focus to trigger for accessibility
            const btn = manageAgentsBtnRef.current;
            if (btn && typeof btn.focus === 'function') btn.focus();
          }}
        />
          <PromptManagementModal isOpen={isPromptModalOpen} onClose={() => setIsPromptModalOpen(false)} />
          <DocumentSourceManagementModal
            isOpen={isDocumentsModalOpen}
            onClose={() => {
              setIsDocumentsModalOpen(false);
              const btn = manageDocumentsBtnRef.current;
              if (btn && typeof btn.focus === 'function') btn.focus();
            }}
          />
      </div>
        </PluginsProvider>
        </AgentsProvider>
        </PromptsProvider>
    </FluentProvider>
  );
}