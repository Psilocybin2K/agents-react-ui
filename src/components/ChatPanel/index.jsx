import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { Text, Badge, Toolbar, ToolbarButton, ToolbarDivider, Button, Card, Textarea, Toaster, useToastController, Toast, ToastTitle, Dialog, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions } from '@fluentui/react-components';
import { Add24Regular, Settings24Regular, ArrowSync24Regular, Delete24Regular, Save24Regular, DataUsage24Regular, Search24Regular, Share24Regular, Copy24Regular, ThumbLike24Regular, ThumbDislike24Regular, MoreHorizontal24Regular, TextBold24Regular, TextItalic24Regular, TextUnderline24Regular, Link24Regular, Attach24Regular, Mic24Regular, Library24Regular, Apps24Regular, Send24Regular, Branch24Regular } from '@fluentui/react-icons';
import { Avatar } from '@fluentui/react-components';
import { tokens } from '@fluentui/react-components';
import useStyles from './styles';
import { chat as chatService } from '../../services';
import { useChatPlugins } from '../../services/plugins';
import ReactMarkdown from 'react-markdown';
import ChatMemoriesPanel from '../ChatMemories';
import AgentSelection from '../AgentSelection';
import { useAgents } from '../../services/agents/store';

const ChatPanel = ({ chat, onNewChat, onDeleteChat, onRequestRefresh }) => {
  const styles = useStyles();
  const { sendMessage } = useChatPlugins();
  const { agents } = useAgents();
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const abortRef = useRef(null);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [confirmEditSend, setConfirmEditSend] = useState(null);
  const { dispatchToast } = useToastController();
  const restoreRef = useRef(null);
  const bottomRef = useRef(null);
  const [selectedAgentIds, setSelectedAgentIds] = useState([]);

  const messages = useMemo(() => chat?.messages || [], [chat]);

  // Load agent selection from chat
  useEffect(() => {
    if (chat?.id) {
      const selection = chatService.getChatAgentSelection(chat.id);
      if (selection?.agentIds) {
        setSelectedAgentIds(selection.agentIds);
      }
    }
  }, [chat?.id]);

  // Function to get agent display name
  const getAgentDisplayName = (message) => {
    if (message.role !== 'assistant' || !message.agentInfo) {
      return 'Ciphy.io'; // Default fallback
    }

    const { agentNames, isMultiAgent, agentCount } = message.agentInfo;
    
    if (!agentNames || agentNames.length === 0) {
      return 'Ciphy.io';
    }

    if (isMultiAgent && agentCount > 1) {
      if (agentCount === 2) {
        return `${agentNames[0]} & ${agentNames[1]}`;
      } else {
        return `${agentNames[0]} + ${agentCount - 1} others`;
      }
    }

    return agentNames[0] || 'Ciphy.io';
  };

  // Function to get agent display name for streaming messages
  const getStreamingAgentDisplayName = () => {
    if (selectedAgentIds.length === 0) {
      return 'Ciphy.io';
    }

    const selectedAgents = agents.filter(agent => selectedAgentIds.includes(agent.id));
    const agentNames = selectedAgents.map(agent => agent.name);

    if (agentNames.length === 0) {
      return 'Ciphy.io';
    }

    if (agentNames.length === 1) {
      return agentNames[0];
    }

    if (agentNames.length === 2) {
      return `${agentNames[0]} & ${agentNames[1]}`;
    }

    return `${agentNames[0]} + ${agentNames.length - 1} others`;
  };

  // Persist agent selection changes
  const handleAgentSelectionChange = useCallback((agentIds) => {
    setSelectedAgentIds(agentIds);
    if (chat?.id) {
      chatService.updateChatAgentSelection(chat.id, { agentIds });
    }
  }, [chat?.id]);

  useEffect(() => {
    const node = bottomRef.current;
    if (node && typeof node.scrollIntoView === 'function') {
      node.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages.length, isStreaming, streamingText]);

  const handleSend = useCallback(async () => {
    if (!chat?.id || !input.trim() || isStreaming) return;
    setIsStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;
    setStreamingText('');
    try {
      await sendMessage(chat.id, input, {
        onDelta: (chunk) => {
          setStreamingText(prev => prev + chunk);
        },
        signal: controller.signal,
        agentIds: selectedAgentIds.length > 0 ? selectedAgentIds : undefined,
      });
      setInput('');
      onRequestRefresh && onRequestRefresh();
    } catch (err) {
      // swallow for now; could show toast
    } finally {
      setIsStreaming(false);
      setStreamingText('');
      abortRef.current = null;
    }
  }, [chat?.id, input, isStreaming, onRequestRefresh, sendMessage, selectedAgentIds]);

  const handleAbort = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
  }, []);

  return (
    <>
      <header className={styles.chatHeader}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Text weight="semibold" size={400}>{chat?.title || 'New chat'}</Text>
          <Badge shape="rounded" appearance="outline">GPT-4</Badge>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <AgentSelection
            selectedAgentIds={selectedAgentIds}
            onSelectionChange={handleAgentSelectionChange}
            disabled={isStreaming}
          />
          <Toolbar>
            <Button appearance="primary" icon={<Add24Regular />} onClick={() => onNewChat && onNewChat()}>New chat</Button>
            <ToolbarButton className={styles.iconButton} aria-label="Settings" icon={<Settings24Regular />} />
            <ToolbarButton className={styles.iconButton} aria-label="Refresh" icon={<ArrowSync24Regular />} />
            <ToolbarButton className={styles.iconButton} aria-label="Delete" icon={<Delete24Regular />} onClick={() => onDeleteChat && onDeleteChat()} />
            <ToolbarButton className={styles.iconButton} aria-label="Save" icon={<Save24Regular />} />
            <ToolbarButton className={styles.iconButton} aria-label="Fork" icon={<Branch24Regular />} onClick={() => {
              const fork = chatService.forkChat(chat.id, null, `${chat?.title || 'Chat'} (fork)`);
              if (fork && onNewChat) onNewChat(fork);
            }} />
          </Toolbar>
        </div>
      </header>
      <main className={styles.chatContent}>
        {chat?.id && (
          <div style={{ marginBottom: 12 }}>
            <ChatMemoriesPanel threadId={chat.id} messages={messages} />
          </div>
        )}
        {messages.length === 0 && (
          <Text align="center" size={200} style={{color: tokens.colorNeutralForeground3}}>Start the conversation…</Text>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? styles.userMessageContainer : styles.aiMessageContainer}>
            {m.role === 'assistant' && <Avatar color="brand" icon={<DataUsage24Regular />} />}
            <div className={styles.message}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px'}}>
                <Text weight="semibold" size={300} style={m.role === 'assistant' ? {color: tokens.colorBrandForeground1} : undefined}>
                  {m.role === 'assistant' ? getAgentDisplayName(m) : 'You'}
                </Text>
                <Text size={200} style={{color: tokens.colorNeutralForeground3}}>{new Date(m.createdAt).toLocaleTimeString()}</Text>
                {m.role === 'assistant' && (
                  <>
                    <Button className={styles.iconButton} appearance="transparent" size="small" icon={<Search24Regular />}>Fact check</Button>
                    <Button className={styles.iconButton} appearance="transparent" size="small" icon={<Share24Regular />}>Share</Button>
                  </>
                )}
              </div>
              <Card className={m.role === 'assistant' ? styles.aiMessageCard : styles.userMessageCard}>
                {editingId === m.id ? (
                  <Textarea value={editingText} onChange={(e, d) => setEditingText(d.value)} rows={4} />
                ) : (
                  m.role === 'assistant' ? <ReactMarkdown>{m.content}</ReactMarkdown> : <Text>{m.content}</Text>
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  {editingId === m.id ? (
                    <>
                      <Button appearance="primary" size="small" onClick={() => {
                        chatService.updateMessage(chat.id, m.id, editingText);
                        setEditingId(null);
                        onRequestRefresh && onRequestRefresh();
                      }}>Save</Button>
                      <Button appearance="secondary" size="small" onClick={() => setConfirmEditSend({ id: m.id, role: m.role })}>Edit and Send</Button>
                      <Button appearance="secondary" size="small" onClick={() => { setEditingId(null); setEditingText(''); }}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button appearance="subtle" size="small" onClick={() => { setEditingId(m.id); setEditingText(m.content); }}>Edit</Button>
                      <Button appearance="subtle" size="small" onClick={() => {
                        const fork = chatService.forkChat(chat.id, m.id, `${chat?.title || 'Chat'} (from here)`);
                        if (fork) {
                          if (m.role === 'user') {
                            // Immediately send response for UX continuity
                            chatService.respondToLastUser(fork.id);
                          }
                          if (onNewChat) onNewChat(fork);
                        }
                      }}>Fork from here</Button>
                      <Button appearance="subtle" size="small" onClick={() => {
                        const removed = chatService.deleteMessage(chat.id, m.id);
                        restoreRef.current = { chatId: chat.id, message: removed, index: messages.findIndex(x => x.id === m.id) };
                        dispatchToast(
                          <Toast>
                            <ToastTitle action={{
                              children: 'Undo',
                              onClick: () => {
                                if (!restoreRef.current) return;
                                const c = chatService.getChat(chat.id);
                                const msgs = (c?.messages || []).slice();
                                msgs.splice(restoreRef.current.index, 0, restoreRef.current.message);
                                chatService.replaceMessages(chat.id, msgs);
                                restoreRef.current = null;
                                onRequestRefresh && onRequestRefresh();
                              }
                            }}>Message deleted</ToastTitle>
                          </Toast>,
                          { intent: 'warning', timeout: 10000 }
                        );
                        onRequestRefresh && onRequestRefresh();
                      }}>Delete</Button>
                    </>
                  )}
                </div>
              </Card>
            </div>
            {m.role === 'user' && <Avatar image={{ src: "https://placehold.co/40x40/E0E0E0/333?text=ME" }} />}
          </div>
        ))}
        {isStreaming && streamingText && (
          <div className={styles.aiMessageContainer}>
            <Avatar color="brand" icon={<DataUsage24Regular />} />
            <div className={styles.message}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px'}}>
                <Text weight="semibold" size={300} style={{color: tokens.colorBrandForeground1}}>
                  {selectedAgentIds.length > 0 ? getStreamingAgentDisplayName() : 'Ciphy.io'}
                </Text>
                <Text size={200} style={{color: tokens.colorNeutralForeground3}}>…</Text>
              </div>
              <Card className={styles.aiMessageCard}>
                <Text>{streamingText}</Text>
              </Card>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </main>
      <footer className={styles.chatInputContainer}>
        <div className={styles.chatInputBox}>
          <Textarea
            textarea={{ style: { minHeight: '80px', width: '100%', border: 'none', resize: 'none', outline: 'none', backgroundColor: 'transparent' } }}
            placeholder="How can I help you?"
            value={input}
            onChange={(e, data) => setInput(data.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <div className={styles.inputToolbar}>
            <Toolbar>
              <ToolbarButton className={styles.iconButton} aria-label="Bold" icon={<TextBold24Regular />} />
              <ToolbarButton className={styles.iconButton} aria-label="Italic" icon={<TextItalic24Regular />} />
              <ToolbarButton className={styles.iconButton} aria-label="Underline" icon={<TextUnderline24Regular />} />
              <ToolbarButton className={styles.iconButton} aria-label="Link" icon={<Link24Regular />} />
              <ToolbarDivider />
              <ToolbarButton className={styles.iconButton} aria-label="Attach" icon={<Attach24Regular />} />
              <ToolbarButton className={styles.iconButton} aria-label="Mic" icon={<Mic24Regular />} />
            </Toolbar>
            <div style={{display: 'flex', gap: '8px'}}>
              <Button icon={<Library24Regular />} appearance="subtle">Library</Button>
              <Button icon={<Apps24Regular />} appearance="subtle">Apps</Button>
              {!isStreaming ? (
                <Button appearance="primary" icon={<Send24Regular />} onClick={handleSend} disabled={!input.trim() || !chat?.id}>Send message</Button>
              ) : (
                <Button appearance="primary" onClick={handleAbort}>Stop</Button>
              )}
            </div>
          </div>
        </div>
      </footer>
      <Toaster />

      <Dialog open={Boolean(confirmEditSend)} onOpenChange={() => setConfirmEditSend(null)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Replace and resend?</DialogTitle>
            <DialogContent>Editing and sending will remove this message and all following messages. Continue?</DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setConfirmEditSend(null)}>Cancel</Button>
              <Button appearance="primary" onClick={async () => {
                if (!confirmEditSend) return;
                const c = chatService.getChat(chat.id);
                const idx = (c?.messages || []).findIndex(x => x.id === confirmEditSend.id);
                if (idx === -1) { setConfirmEditSend(null); return; }
                if (confirmEditSend.role === 'user') {
                  const keep = (c.messages || []).slice(0, idx); // remove edited and after
                  chatService.replaceMessages(chat.id, keep);
                  setConfirmEditSend(null);
                  setEditingId(null);
                  setEditingText('');
                  await sendMessage(chat.id, editingText, {});
                  onRequestRefresh && onRequestRefresh();
                } else {
                  // assistant: trim to user before it and re-send that user message
                  const prev = c.messages[idx - 1];
                  const keep = (c.messages || []).slice(0, Math.max(0, idx));
                  chatService.replaceMessages(chat.id, keep);
                  setConfirmEditSend(null);
                  setEditingId(null);
                  setEditingText('');
                  if (prev && prev.role === 'user') {
                    await sendMessage(chat.id, prev.content, {});
                  }
                  onRequestRefresh && onRequestRefresh();
                }
              }}>Edit and Send</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
};

export default ChatPanel;
