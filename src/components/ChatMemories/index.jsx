import React, { useCallback, useMemo, useState } from 'react';
import { Text, Switch, Toast, ToastTitle, Toaster, useToastController } from '@fluentui/react-components';
import useStyles from './styles';
import GenerateButton from './GenerateButton';
import GenerateModal from './GenerateModal';
import MemoryList from './MemoryList';
import { ChatMemoriesProvider, useChatMemories } from '../../services/chat/memories/store';

function InnerPanel({ threadId, messages }) {
  const styles = useStyles();
  const { dispatchToast } = useToastController();
  const { memories, createMemory, updateMemory, deleteMemory, generate } = useChatMemories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [autoEnabled, setAutoEnabled] = useState(false);
  const [autoOptions, setAutoOptions] = useState({ importanceThreshold: 0.6, windowSize: 20, allowAutoSave: false, maxCandidates: 5 });

  const onGenerateClick = useCallback(async () => {
    setIsGenerating(true);
    try {
      const cands = await generate(messages, { windowSize: autoOptions.windowSize, maxCandidates: autoOptions.maxCandidates });
      setCandidates(cands);
      setIsModalOpen(true);
    } finally {
      setIsGenerating(false);
    }
  }, [generate, messages, autoOptions.windowSize, autoOptions.maxCandidates]);

  const onSaveCandidates = useCallback(async (selected) => {
    if (!Array.isArray(selected) || selected.length === 0) {
      setIsModalOpen(false);
      setCandidates([]);
      return;
    }
    const saved = [];
    for (const c of selected) {
      // eslint-disable-next-line no-await-in-loop
      const m = await createMemory({ title: c.title, content: c.content, kind: c.kind, importance: c.importance, sourceMessageIds: c.sourceMessageIds, origin: 'manual' });
      saved.push(m);
    }
    dispatchToast(
      <Toast>
        <ToastTitle>{`Saved ${saved.length} memories`}</ToastTitle>
      </Toast>,
      { intent: 'success', timeout: 4000 }
    );
    setIsModalOpen(false);
    setCandidates([]);
  }, [createMemory, dispatchToast]);

  // Auto-generation hook is expected to be wired by parent on message send/receive in a later integration pass.

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <Text weight="semibold">Memories</Text>
        <div className={styles.controls}>
          <Switch label={autoEnabled ? 'Auto on' : 'Auto off'} checked={autoEnabled} onChange={(e, d) => setAutoEnabled(d.checked)} />
          <GenerateButton onClick={onGenerateClick} disabled={isGenerating} loading={isGenerating} />
        </div>
      </div>
      <MemoryList memories={memories} onUpdate={(id, updates) => updateMemory(id, updates)} onDelete={(id) => deleteMemory(id)} />
      <GenerateModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setCandidates([]); }} candidates={candidates} isLoading={isGenerating} onSave={onSaveCandidates} />
      <Toaster />
    </div>
  );
}

const ChatMemoriesPanel = ({ threadId, messages }) => {
  // Provider scoped per thread
  return (
    <ChatMemoriesProvider threadId={threadId}>
      <InnerPanel threadId={threadId} messages={messages} />
    </ChatMemoriesProvider>
  );
};

export default ChatMemoriesPanel;


