import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Dialog, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogActions, Spinner, MessageBar } from '@fluentui/react-components';
import AgentList from './AgentList';
import AgentForm from './AgentForm';
import DeleteConfirm from './DeleteConfirm';
import DiscardConfirm from './DiscardConfirm';
import useStyles from './styles';
import useModalSurfaceStyles from '../Layout/modalSurfaceStyles';
import { useAgents } from '../../services/agents/store';
import PromptManagementModal from '../PromptManagement';
import DocumentSourceManagementModal from '../DocumentSourceManagement';

export default function AgentManagementModal({ isOpen = false, onClose, onSaved, initialAgentId = null }) {
  const styles = useStyles();
  const modalSurfaceStyles = useModalSurfaceStyles();
  const { agents, createAgent, updateAgent, deleteAgent, refresh, isLoading, error } = useAgents();

  const [selectedId, setSelectedId] = useState(initialAgentId || null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const selectionInitializedRef = useRef(false);
  const [isPromptPickerOpen, setIsPromptPickerOpen] = useState(false);
  const [isInstructionPickerOpen, setIsInstructionPickerOpen] = useState(false);

  const selected = useMemo(() => agents.find(a => a.id === selectedId) || null, [agents, selectedId]);

  const [draft, setDraft] = useState(() => selected || { id: null, name: '', description: '', instructions: '', prompt: '' });

  useEffect(() => {
    // Ensure we have fresh data when modal opens
    if (isOpen) refresh();
  }, [isOpen, refresh]);

  useEffect(() => {
    if (!isOpen) { selectionInitializedRef.current = false; return; }
    // Initialize selection only once per open
    if (selectionInitializedRef.current) return;
    if (!selectedId) {
      if (initialAgentId) setSelectedId(initialAgentId);
      else if (agents && agents.length > 0) setSelectedId(agents[0].id);
    }
    selectionInitializedRef.current = true;
  }, [isOpen, agents, selectedId, initialAgentId]);

  useEffect(() => {
    // Keep draft in sync with current selection
    if (!isOpen) return;
    const next = selected ? selected : { id: null, name: '', description: '', instructions: '', prompt: '' };
    setDraft(next);
  }, [selected, isOpen]);

  const handleSelect = (id) => {
    setSelectedId(id);
    const next = agents.find(a => a.id === id) || { id: null, name: '', description: '', instructions: '', prompt: '' };
    setDraft(next);
  };

  const handleChange = (updates) => {
    setDraft(prev => ({ ...prev, ...updates }));
  };

  const isDirty = useMemo(() => {
    const base = selected || { id: null, name: '', description: '', instructions: '', prompt: '' };
    return (
      (draft.name || '') !== (base.name || '') ||
      (draft.description || '') !== (base.description || '') ||
      (draft.instructions || '') !== (base.instructions || '') ||
      (draft.prompt || '') !== (base.prompt || '')
    );
  }, [draft, selected]);

  const handleCancel = () => {
    if (isDirty) { setShowDiscardConfirm(true); return; }
    if (selected) setDraft(selected);
    else setDraft({ id: null, name: '', description: '', instructions: '', prompt: '' });
  };

  const handleSave = async () => {
    try {
      let saved = null;
      if (draft.id) {
        saved = await updateAgent(draft.id, {
          name: draft.name,
          description: draft.description,
          instructions: draft.instructions,
          prompt: draft.prompt,
        });
      } else {
        saved = await createAgent({
          name: draft.name,
          description: draft.description,
          instructions: draft.instructions,
          prompt: draft.prompt,
        });
        setSelectedId(saved.id);
        // Ensure selection sticks until user changes it
        selectionInitializedRef.current = true;
      }
      if (onSaved) onSaved(saved);
    } catch (err) {
      // Minimal error handling (Phase 4): surface message
      // eslint-disable-next-line no-alert
      alert(err?.message || 'Failed to save agent');
    }
  };

  const handleCreate = () => {
    setSelectedId(null);
    setDraft({ id: null, name: '', description: '', instructions: '', prompt: '' });
    // Allow re-initialization logic to pick up when list changes after save
    selectionInitializedRef.current = true;
  };

  const handleDelete = async () => {
    if (!draft.id) return;
    setShowDeleteConfirm(true);
  };

  const handleClone = async () => {
    if (!draft.id) return;
    try {
      const clonedAgent = await createAgent({
        name: `${draft.name} (Copy)`,
        description: draft.description,
        instructions: draft.instructions,
        prompt: draft.prompt,
      });
      setSelectedId(clonedAgent.id);
      // Ensure selection sticks until user changes it
      selectionInitializedRef.current = true;
      if (onSaved) onSaved(clonedAgent);
    } catch (err) {
      // Minimal error handling (Phase 4): surface message
      // eslint-disable-next-line no-alert
      alert(err?.message || 'Failed to clone agent');
    }
  };

  const confirmDelete = async () => {
    if (!draft.id) { setShowDeleteConfirm(false); return; }
    await deleteAgent(draft.id);
    
    // Find the first available agent to select after deletion
    const remainingAgents = agents.filter(a => a.id !== draft.id);
    if (remainingAgents.length > 0) {
      // Select the first remaining agent
      const firstAgent = remainingAgents[0];
      setSelectedId(firstAgent.id);
      setDraft(firstAgent);
    } else {
      // No agents left, reset to empty state
      setSelectedId(null);
      setDraft({ id: null, name: '', description: '', instructions: '', prompt: '' });
    }
    
    setShowDeleteConfirm(false);
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={(_, data) => { if (!data.open) {
        if (isDirty) { setShowDiscardConfirm(true); return; }
        if (onClose) onClose();
      } }} modalType="modal">
      <DialogSurface className={modalSurfaceStyles.surface}>
        <DialogBody>
          <DialogTitle>Manage Agents</DialogTitle>
          <DialogContent className={styles.content}>
            {error ? (
              <MessageBar intent="error" style={{ marginBottom: 8 }}>{String(error.message || error)}</MessageBar>
            ) : null}
            <div className={styles.splitPane}>
              <div className={styles.listPane}>
                {isLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
                    <Spinner label="Loading agents..." />
                  </div>
                ) : (
                  <AgentList items={agents} selectedId={selectedId} onSelect={handleSelect} onCreate={handleCreate} />
                )}
              </div>
              <div className={styles.formPane}>
                <AgentForm
                  value={draft}
                  onChange={handleChange}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onDelete={handleDelete}
                  onSelectPrompt={() => setIsPromptPickerOpen(true)}
                  onSelectInstruction={() => setIsInstructionPickerOpen(true)}
                  onClone={handleClone}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => onClose && onClose()}>Close</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
    <DeleteConfirm open={showDeleteConfirm} onConfirm={confirmDelete} onCancel={() => setShowDeleteConfirm(false)} />
    <DiscardConfirm open={showDiscardConfirm} onConfirm={() => { setShowDiscardConfirm(false); if (onClose) onClose(); }} onCancel={() => setShowDiscardConfirm(false)} />
    {isPromptPickerOpen && (
      <PromptManagementModal
        isOpen
        onClose={() => setIsPromptPickerOpen(false)}
        picker
        onPick={(p) => { setIsPromptPickerOpen(false); setDraft(prev => ({ ...prev, prompt: p?.content || '' })); }}
      />
    )}
    {isInstructionPickerOpen && (
      <DocumentSourceManagementModal
        isOpen
        onClose={() => setIsInstructionPickerOpen(false)}
        picker
        initialDocuments={[]}
        onPick={(doc) => { setIsInstructionPickerOpen(false); setDraft(prev => ({ ...prev, instructions: doc?.content || doc?.url || '' })); }}
      />
    )}
    </>
  );
}


