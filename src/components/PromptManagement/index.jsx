import React, { useEffect, useMemo, useState } from 'react';
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, Text, MessageBar } from '@fluentui/react-components';
import useStyles from './styles';
import useModalSurfaceStyles from '../Layout/modalSurfaceStyles';
import PromptList from './PromptList';
import PromptForm from './PromptForm';
import DeleteConfirm from './DeleteConfirm';
import ConfirmDialog from './ConfirmDialog';
import { usePrompts } from '../../services/prompts/store';

/**
 * Modal component for managing prompts - allows viewing, creating, editing, and deleting prompts.
 * Can be used in two modes: full management mode or picker mode for selecting a prompt.
 * 
 * @param {Object} props - Component props
 * @param {boolean} [props.isOpen=false] - Whether the modal is open
 * @param {Function} [props.onClose] - Callback when modal is closed
 * @param {Function} [props.onSaved] - Callback when a prompt is saved, receives the saved prompt
 * @param {string|null} [props.initialPromptId=null] - ID of prompt to initially select
 * @param {boolean} [props.picker=false] - Whether to show in picker mode (for selecting prompts)
 * @param {Function} [props.onPick] - Callback when a prompt is picked in picker mode, receives the selected prompt
 * @returns {JSX.Element} The prompt management modal
 */
const PromptManagementModal = ({
  isOpen = false,
  onClose,
  onSaved,
  initialPromptId = null,
  picker = false,
  onPick,
}) => {
  const styles = useStyles();
  const modalSurfaceStyles = useModalSurfaceStyles();
  const { prompts, createPrompt, updatePrompt, deletePrompt, loading } = usePrompts();
  const [selectedId, setSelectedId] = useState(initialPromptId);

  // Local, placeholder prompt state (skeleton only; not wired to store)
  const [draft, setDraft] = useState({
    id: null,
    name: '',
    description: '',
    content: '',
    variables: [],
    tags: [],
  });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUnsavedOpen, setIsUnsavedOpen] = useState(false);
  const [isAttemptingClose, setIsAttemptingClose] = useState(false);

  /**
   * Effect to sync draft state with selected prompt from store
   */
  useEffect(() => {
    if (!selectedId) {
      setDraft({ id: null, name: '', description: '', content: '', variables: [], tags: [] });
      return;
    }
    const found = (prompts || []).find(p => p.id === selectedId) || null;
    if (found) {
      setDraft({
        id: found.id,
        name: found.name || '',
        description: found.description || '',
        content: found.content || '',
        variables: Array.isArray(found.variables) ? found.variables.map(v => ({ ...v })) : [],
        tags: Array.isArray(found.tags) ? [...found.tags] : [],
      });
    }
  }, [selectedId, prompts]);

  const [formErrors, setFormErrors] = useState({});
  
  /**
   * Computed property that determines if the current draft can be saved
   */
  const canSave = useMemo(() => {
    return draft.name.trim().length > 0 && draft.content.trim().length > 0;
  }, [draft]);

  /**
   * Validates the current draft and sets form errors
   * @returns {boolean} True if validation passes, false otherwise
   */
  function validateDraft() {
    const errs = {};
    if (!draft.name?.trim()) errs.name = 'Name is required';
    if (!draft.content?.trim()) errs.content = 'Content is required';
    if (Array.isArray(draft.variables) && draft.variables.length > 50) errs.variables = 'At most 50 variables';
    if (Array.isArray(draft.tags) && draft.tags.length > 10) errs.tags = 'At most 10 tags';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  /**
   * Handles saving the current draft - either creates new prompt or updates existing one
   */
  async function handleSave() {
    if (!validateDraft()) return;
    const payload = {
      name: draft.name?.trim() || '',
      description: draft.description || '',
      content: draft.content?.trim() || '',
      variables: Array.isArray(draft.variables) ? draft.variables : [],
      tags: Array.isArray(draft.tags) ? draft.tags : [],
    };
    if (draft.id) {
      const updated = await updatePrompt(draft.id, payload);
      setDraft({ ...updated });
      setSelectedId(updated.id);
      onSaved && onSaved(updated);
    } else {
      const created = await createPrompt(payload);
      setDraft({ ...created });
      setSelectedId(created.id);
      onSaved && onSaved(created);
    }
  }

  /**
   * Handles confirming prompt deletion
   */
  async function handleConfirmDelete() {
    if (!draft.id) return;
    await deletePrompt(draft.id);
    setIsDeleteOpen(false);
    setSelectedId(null);
    setDraft({ id: null, name: '', description: '', content: '', variables: [], tags: [] });
  }

  /**
   * Checks if there are unsaved changes in the current draft
   * @returns {boolean} True if there are unsaved changes, false otherwise
   */
  function hasUnsavedChanges() {
    const existing = (prompts || []).find(p => p.id === selectedId);
    if (!existing) {
      // If creating new, check if any meaningful field has content
      return !!(draft.name || draft.description || draft.content || (draft.tags || []).length || (draft.variables || []).length);
    }
    const norm = (obj) => JSON.stringify(obj);
    return (
      (existing.name || '') !== (draft.name || '') ||
      (existing.description || '') !== (draft.description || '') ||
      (existing.content || '') !== (draft.content || '') ||
      norm(existing.tags || []) !== norm(draft.tags || []) ||
      norm(existing.variables || []) !== norm(draft.variables || [])
    );
  }

  /**
   * Handles modal close request - checks for unsaved changes and shows confirmation if needed
   */
  function requestClose() {
    if (hasUnsavedChanges()) {
      setIsAttemptingClose(true);
      setIsUnsavedOpen(true);
      return;
    }
    onClose && onClose();
  }

  return (
    <>
    <Dialog open={isOpen} onOpenChange={(_, data) => {
      if (data.type === 'backdropClick' || data.type === 'escapeKeyDown') {
        requestClose();
      }
    }} modalType="modal">
      <DialogSurface aria-label="Prompt management dialog" className={modalSurfaceStyles.surface}>
        <DialogBody>
          <DialogTitle>{picker ? 'Select Prompt' : 'Manage Prompts'}</DialogTitle>
          <DialogContent className={styles.content}>
            {picker ? (
              <MessageBar intent="warning" style={{ marginBottom: 8 }}>
                Edits you make here are saved directly to this prompt.
              </MessageBar>
            ) : null}
            <div className={styles.splitPane}>
              <div className={styles.listPane}>
                <PromptList
                  prompts={prompts}
                  selectedId={selectedId}
                  onSelect={(id) => setSelectedId(id)}
                  onCreateNew={() => setSelectedId(null)}
                />
              </div>
              <div className={styles.formPane}>
                <PromptForm
                  value={draft}
                  onChange={setDraft}
                  errors={formErrors}
                  disabled={false}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <div className={styles.actions}>
              <div>
                {loading ? <Text size={200} style={{ opacity: 0.7 }}>Loading…</Text> : null}
              </div>
              <div className={styles.actionButtons}>
                {picker && (
                  <Button appearance="primary" disabled={!draft.content?.trim()} onClick={() => { onPick && onPick(draft); onClose && onClose(); }}>Use</Button>
                )}
                {draft.id && (
                  <Button appearance="secondary" onClick={() => setIsDeleteOpen(true)}>Delete</Button>
                )}
                <Button appearance="secondary" onClick={requestClose}>Cancel</Button>
                <Button appearance="primary" disabled={!canSave} onClick={handleSave}>Save</Button>
              </div>
            </div>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
    <DeleteConfirm
      open={isDeleteOpen}
      onCancel={() => setIsDeleteOpen(false)}
      onConfirm={handleConfirmDelete}
      itemName={draft.name || 'this prompt'}
    />
    <ConfirmDialog
      open={isUnsavedOpen}
      title="Discard changes?"
      content="You have unsaved changes. Are you sure you want to discard them?"
      confirmLabel="Discard"
      cancelLabel="Stay"
      onConfirm={() => { setIsUnsavedOpen(false); onClose && onClose(); }}
      onCancel={() => { setIsUnsavedOpen(false); setIsAttemptingClose(false); }}
    />
    </>
  );
};

export default PromptManagementModal;