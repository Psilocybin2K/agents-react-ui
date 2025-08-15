import React, { useMemo, useState } from 'react';
import { Button, Dropdown, Option, Text, Textarea, Input, Label, Tooltip } from '@fluentui/react-components';
import useStyles from './styles';
import DeleteConfirm from './DeleteConfirm';

const KIND_OPTIONS = [
  { key: 'fact', label: 'Fact' },
  { key: 'preference', label: 'Preference' },
  { key: 'task', label: 'Task' },
  { key: 'other', label: 'Other' },
];

const TITLE_MAX = 100;
const CONTENT_MAX = 1000;

function validateDraft(draft) {
  const errors = {};
  const title = String(draft.title || '').trim();
  const content = String(draft.content || '').trim();
  if (!title) errors.title = 'Title is required';
  if (title.length > TITLE_MAX) errors.title = `Max ${TITLE_MAX} characters`;
  if (!content) errors.content = 'Content is required';
  if (content.length > CONTENT_MAX) errors.content = `Max ${CONTENT_MAX} characters`;
  return errors;
}

const MemoryList = ({ memories, onUpdate, onDelete }) => {
  const styles = useStyles();
  const [confirmId, setConfirmId] = useState(null);
  const [drafts, setDrafts] = useState({}); // id -> { title, content, kind, importance }
  const [errorsById, setErrorsById] = useState({});

  const view = useMemo(() => memories.map(m => ({
    ...m,
    ...(drafts[m.id] ? drafts[m.id] : {}),
  })), [memories, drafts]);

  const setDraftField = (id, field, value) => {
    setDrafts(prev => ({ ...prev, [id]: { ...(prev[id] || {}), [field]: value } }));
  };

  const commit = async (id) => {
    const m = view.find(x => x.id === id);
    if (!m) return;
    const errs = validateDraft(m);
    setErrorsById(prev => ({ ...prev, [id]: errs }));
    if (Object.keys(errs).length > 0) return; // don't update if invalid
    await onUpdate(id, { title: m.title.trim(), content: m.content.trim(), kind: m.kind, importance: Number(m.importance) });
    setDrafts(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <div className={styles.list}>
      {memories.length === 0 && (
        <Text size={200} style={{ color: 'var(--colorNeutralForeground3)' }}>No memories yet.</Text>
      )}
      {view.map(m => (
        <div key={m.id} className={styles.listItem}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <Input value={m.title}
                     onChange={(e, d) => setDraftField(m.id, 'title', d.value)}
                     onBlur={() => commit(m.id)}
                     aria-invalid={Boolean(errorsById[m.id]?.title)}
                     aria-describedby={errorsById[m.id]?.title ? `err-title-${m.id}` : undefined}
                     style={{ flex: 2 }} />
              <Dropdown selectedOptions={[m.kind]}
                        onOptionSelect={(e, d) => { setDraftField(m.id, 'kind', d.optionValue); commit(m.id); }}
                        style={{ width: 160 }}>
                {KIND_OPTIONS.map(opt => (
                  <Option key={opt.key} value={opt.key}>{opt.label}</Option>
                ))}
              </Dropdown>
            </div>
            <Textarea value={m.content}
                      onChange={(e, d) => setDraftField(m.id, 'content', d.value)}
                      onBlur={() => commit(m.id)}
                      aria-invalid={Boolean(errorsById[m.id]?.content)}
                      aria-describedby={errorsById[m.id]?.content ? `err-content-${m.id}` : undefined}
                      rows={3} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className={styles.listItemMeta}>
                <Label size="small">Importance</Label>
                <Input type="number" min={0} max={1} step={0.05} value={String(m.importance ?? 0)} onChange={(e, d) => setDraftField(m.id, 'importance', Number(d.value))} onBlur={() => commit(m.id)} style={{ width: 100 }} />
                <Text size={200}>• {new Date(m.updatedAt).toLocaleString()}</Text>
              </div>
              <div style={{ color: 'var(--colorNeutralForeground3)' }}>
                <Text size={200}>{String(m.title || '').length}/{TITLE_MAX} · {String(m.content || '').length}/{CONTENT_MAX}</Text>
              </div>
            </div>
            {errorsById[m.id]?.title && (
              <Text id={`err-title-${m.id}`} role="alert" aria-live="polite" size={200} style={{ color: 'var(--colorPaletteRedForeground1)' }}>{errorsById[m.id].title}</Text>
            )}
            {errorsById[m.id]?.content && (
              <Text id={`err-content-${m.id}`} role="alert" aria-live="polite" size={200} style={{ color: 'var(--colorPaletteRedForeground1)' }}>{errorsById[m.id].content}</Text>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Tooltip content="Delete" relationship="label">
              <Button appearance="secondary" onClick={() => setConfirmId(m.id)}>Delete</Button>
            </Tooltip>
          </div>
        </div>
      ))}
      <DeleteConfirm open={Boolean(confirmId)} onCancel={() => setConfirmId(null)} onConfirm={() => { const id = confirmId; setConfirmId(null); onDelete(id); }} />
    </div>
  );
};

export default MemoryList;


