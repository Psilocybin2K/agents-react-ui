import React, { useEffect, useMemo, useState } from 'react';
import { Button, Dialog, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, Text, MessageBar } from '@fluentui/react-components';
import useStyles from './styles';
import useModalSurfaceStyles from '../Layout/modalSurfaceStyles';
import DocumentList from './DocumentList';
import DocumentForm from './DocumentForm';
import DeleteConfirm from './DeleteConfirm';
import UnsavedConfirm from './UnsavedConfirm';

/**
 * DocumentSourceManagementModal
 * Component-only modal for managing document sources in-memory.
 * This iteration avoids app-wide integrations and persistence.
 *
 * Props:
 * - isOpen: boolean — controls dialog visibility
 * - onClose: () => void — invoked when user closes the dialog
 * - onSaved?: (doc: DocumentSource) => void — called after create/update
 * - initialDocumentId?: string — pre-select a document for editing
 * - initialDocuments?: DocumentSource[] — initial list (component-only)
 */
const DocumentSourceManagementModal = ({
  isOpen = false,
  onClose,
  onSaved,
  initialDocumentId = null,
  initialDocuments = [],
  picker = false,
  onPick,
}) => {
  const styles = useStyles();
  const modalSurfaceStyles = useModalSurfaceStyles();

  const [documents, setDocuments] = useState(() => Array.isArray(initialDocuments) ? [...initialDocuments] : []);
  const [selectedId, setSelectedId] = useState(initialDocumentId);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false);
  const formRef = React.useRef(null);

  const emptyDraft = useMemo(() => ({
    id: null,
    name: '',
    description: '',
    kind: 'text',
    content: '',
    url: '',
    fileMeta: null,
    tags: [],
  }), []);

  const [draft, setDraft] = useState(emptyDraft);

  useEffect(() => {
    // Reset in-memory list when the modal is opened with new initialDocuments
    if (isOpen) {
      setDocuments(Array.isArray(initialDocuments) ? [...initialDocuments] : []);
      setSelectedId(initialDocumentId || null);
      setDraft(initialDocumentId ? (Array.isArray(initialDocuments) ? (initialDocuments.find(d => d.id === initialDocumentId) || emptyDraft) : emptyDraft) : emptyDraft);
      setIsDirty(false);
      setFormErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialDocumentId, initialDocuments]);

  const selected = useMemo(() => documents.find(d => d.id === selectedId) || null, [documents, selectedId]);

  useEffect(() => {
    if (selected) setDraft({
      id: selected.id,
      name: selected.name || '',
      description: selected.description || '',
      kind: selected.kind || 'text',
      content: selected.content || '',
      url: selected.url || '',
      fileMeta: selected.fileMeta || null,
      tags: Array.isArray(selected.tags) ? [...selected.tags] : [],
    });
    else setDraft(emptyDraft);
  }, [selected, emptyDraft]);

  const visibleDocuments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return documents;
    return documents.filter(d => {
      const name = (d.name || '').toLowerCase();
      const tags = (Array.isArray(d.tags) ? d.tags.join(',') : '').toLowerCase();
      return name.includes(q) || tags.includes(q);
    });
  }, [documents, searchQuery]);

  const canSave = useMemo(() => {
    if (!draft.name?.trim()) return false;
    if (draft.kind === 'text') return !!draft.content?.trim();
    if (draft.kind === 'url') return !!draft.url?.trim();
    if (draft.kind === 'file') return !!draft.fileMeta?.name;
    return false;
  }, [draft]);

  function validate(fieldName) {
    const errs = { ...formErrors };
    const setErr = (key, msg) => { if (msg) errs[key] = msg; else delete errs[key]; };
    const MAX = { name: 100, description: 500, content: 20000, url: 2000, tag: 50, tagsCount: 10 };

    const fieldsToCheck = fieldName ? [fieldName] : ['name', 'description', 'content', 'url', 'file', 'tags'];
    for (const f of fieldsToCheck) {
      switch (f) {
        case 'name': {
          const name = (draft.name || '').trim();
          setErr('name', !name ? 'Name is required' : name.length > MAX.name ? `Max ${MAX.name} characters` : null);
          break;
        }
        case 'description': {
          const desc = draft.description || '';
          setErr('description', desc.length > MAX.description ? `Max ${MAX.description} characters` : null);
          break;
        }
        case 'content': {
          if (draft.kind === 'text') {
            const content = (draft.content || '').trim();
            setErr('content', !content ? 'Text content is required' : content.length > MAX.content ? `Max ${MAX.content} characters` : null);
          } else delete errs.content;
          break;
        }
        case 'url': {
          if (draft.kind === 'url') {
            const url = (draft.url || '').trim();
            let msg = !url ? 'URL is required' : url.length > MAX.url ? `Max ${MAX.url} characters` : null;
            if (!msg) {
              try { new URL(url); } catch { msg = 'Enter a valid URL'; }
            }
            setErr('url', msg);
          } else delete errs.url;
          break;
        }
        case 'file': {
          if (draft.kind === 'file') {
            const m = draft.fileMeta;
            let msg = !m?.name ? 'Select a file' : null;
            if (!msg && (m.size > 5 * 1024 * 1024)) msg = 'Max size 5MB';
            if (!msg && m?.type && !(m.type.startsWith('text/') || m.type === 'application/pdf')) msg = 'Allowed types: text/*, application/pdf';
            setErr('file', msg);
          } else delete errs.file;
          break;
        }
        case 'tags': {
          const tags = Array.isArray(draft.tags) ? draft.tags : [];
          const tooLong = tags.find(t => t.length > MAX.tag);
          setErr('tags', tags.length > MAX.tagsCount ? 'At most 10 tags' : tooLong ? 'Each tag must be <= 50 characters' : null);
          break;
        }
        default:
          break;
      }
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function generateId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    return `doc_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  }

  const handleSave = () => {
    if (!validate()) {
      // focus first invalid field if possible
      const order = ['name', draft.kind === 'text' ? 'content' : draft.kind === 'url' ? 'url' : 'file', 'tags'];
      for (const f of order) {
        if (formErrors[f]) {
          if (formRef.current && typeof formRef.current.focusField === 'function') formRef.current.focusField(f);
          break;
        }
      }
      return;
    }
    const now = Date.now();
    if (draft.id) {
      // update
      setDocuments(prev => prev.map(d => d.id === draft.id ? {
        ...d,
        name: (draft.name || '').trim(),
        description: draft.description || '',
        kind: draft.kind,
        content: draft.kind === 'text' ? (draft.content || '') : '',
        url: draft.kind === 'url' ? (draft.url || '') : '',
        fileMeta: draft.kind === 'file' ? (draft.fileMeta || null) : null,
        tags: Array.isArray(draft.tags) ? [...draft.tags] : [],
        updatedAt: now,
      } : d));
      onSaved && onSaved(draft);
    } else {
      // create
      const newDoc = {
        id: generateId(),
        name: (draft.name || '').trim(),
        description: draft.description || '',
        kind: draft.kind,
        content: draft.kind === 'text' ? (draft.content || '') : '',
        url: draft.kind === 'url' ? (draft.url || '') : '',
        fileMeta: draft.kind === 'file' ? (draft.fileMeta || null) : null,
        tags: Array.isArray(draft.tags) ? [...draft.tags] : [],
        createdAt: now,
        updatedAt: now,
      };
      setDocuments(prev => [newDoc, ...prev]);
      setSelectedId(newDoc.id);
      setDraft(newDoc);
      onSaved && onSaved(newDoc);
    }
    setIsDirty(false);
  };

  const handleDelete = () => {
    if (!draft.id) { setIsDeleteOpen(false); return; }
    // Compute remaining from current snapshot to avoid stale state after setDocuments
    const remaining = documents.filter(d => d.id !== draft.id);
    setDocuments(remaining);
    setIsDeleteOpen(false);
    const nextId = remaining[0]?.id || null;
    setSelectedId(nextId);
    if (!nextId) setDraft(emptyDraft);
  };

  function onFormChange(next) {
    setIsDirty(true);
    setDraft(next);
  }

  function onFormFieldBlur(name) {
    validate(name);
  }

  function handleClose() {
    if (isDirty) { setShowUnsavedConfirm(true); return; }
    onClose && onClose();
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => { /* controlled by parent */ }} modalType="modal">
        <DialogSurface aria-label="Document source management dialog" className={modalSurfaceStyles.surface}>
          <DialogBody>
            <DialogTitle>{picker ? 'Select Document Source' : 'Manage Document Sources'}</DialogTitle>
            <DialogContent className={styles.content}>
              {picker ? (
                <MessageBar intent="warning" style={{ marginBottom: 8 }}>
                  Edits you make here are saved directly to this document source.
                </MessageBar>
              ) : null}
              <div className={styles.splitPane}>
                <div className={styles.listPane}>
                  <DocumentList
                    documents={visibleDocuments}
                    selectedId={selectedId}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSelect={(id) => setSelectedId(id)}
                    onCreateNew={() => setSelectedId(null)}
                  />
                </div>
                <div className={styles.formPane}>
                  <DocumentForm
                    ref={formRef}
                    value={draft}
                    onChange={onFormChange}
                    errors={formErrors}
                    disabled={false}
                    onFieldBlur={onFormFieldBlur}
                  />
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <div className={styles.actions}>
                <div>
                  <Text size={200} style={{ opacity: 0.7 }}>Component-only prototype</Text>
                </div>
                <div className={styles.actionButtons}>
                  {picker && (
                    <Button appearance="primary" disabled={!canSave} onClick={() => { onPick && onPick(draft); onClose && onClose(); }}>Use</Button>
                  )}
                  {draft.id && (
                    <Button appearance="secondary" onClick={() => setIsDeleteOpen(true)}>Delete</Button>
                  )}
                  <Button appearance="secondary" onClick={handleClose}>Close</Button>
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
        onConfirm={handleDelete}
        itemName={draft.name || 'this document'}
      />
      <UnsavedConfirm
        open={showUnsavedConfirm}
        onCancel={() => setShowUnsavedConfirm(false)}
        onDiscard={() => { setShowUnsavedConfirm(false); setIsDirty(false); onClose && onClose(); }}
      />
    </>
  );
};

export default DocumentSourceManagementModal;