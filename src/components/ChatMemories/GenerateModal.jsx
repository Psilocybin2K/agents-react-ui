import React, { useEffect, useMemo, useState } from 'react';
import { Button, Checkbox, Dialog, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, Input, Dropdown, Option, Textarea, Text } from '@fluentui/react-components';

const KIND_OPTIONS = [
  { key: 'fact', label: 'Fact' },
  { key: 'preference', label: 'Preference' },
  { key: 'task', label: 'Task' },
  { key: 'other', label: 'Other' },
];

const GenerateModal = ({ isOpen, onClose, onSave, candidates, isLoading }) => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const initial = (candidates || []).map((c, idx) => ({
        id: idx,
        selected: true,
        title: c.title || '',
        content: c.content || '',
        kind: c.kind || 'other',
        importance: typeof c.importance === 'number' ? c.importance : 0.5,
        sourceMessageIds: c.sourceMessageIds || [],
        origin: c.origin || 'auto',
      }));
      setRows(initial);
    } else {
      setRows([]);
    }
  }, [isOpen, candidates]);

  const allSelected = useMemo(() => rows.length > 0 && rows.every(r => r.selected), [rows]);
  const anySelected = useMemo(() => rows.some(r => r.selected && r.title.trim() && r.content.trim()), [rows]);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose && onClose()}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Generate Memories</DialogTitle>
          <DialogContent>
            <Text size={200} style={{ display: 'block', marginBottom: 8 }}>Review and edit suggested memories before saving.</Text>
            {isLoading && <Text>Generating…</Text>}
            {!isLoading && rows.map((r, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Checkbox checked={r.selected} onChange={(e, d) => setRows(prev => prev.map(row => row.id === r.id ? { ...row, selected: d.checked } : row))} />
                  <Input value={r.title} onChange={(e, d) => setRows(prev => prev.map(row => row.id === r.id ? { ...row, title: d.value } : row))} placeholder="Title" style={{ flex: 1 }} />
                  <Dropdown selectedOptions={[r.kind]} onOptionSelect={(e, d) => setRows(prev => prev.map(row => row.id === r.id ? { ...row, kind: d.optionValue } : row))} style={{ width: 160 }}>
                    {KIND_OPTIONS.map(opt => (
                      <Option key={opt.key} value={opt.key}>{opt.label}</Option>
                    ))}
                  </Dropdown>
                  <Input type="number" min={0} max={1} step={0.05} value={String(r.importance)} onChange={(e, d) => setRows(prev => prev.map(row => row.id === r.id ? { ...row, importance: Number(d.value) } : row))} style={{ width: 100 }} />
                </div>
                <Textarea value={r.content} onChange={(e, d) => setRows(prev => prev.map(row => row.id === r.id ? { ...row, content: d.value } : row))} rows={3} placeholder="Content" />
              </div>
            ))}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => onClose && onClose()}>Discard</Button>
            <Button appearance="primary" disabled={!anySelected} onClick={() => {
              const selected = rows.filter(r => r.selected && r.title.trim() && r.content.trim()).map(r => ({
                title: r.title.trim(),
                content: r.content.trim(),
                kind: r.kind,
                importance: r.importance,
                sourceMessageIds: r.sourceMessageIds,
                origin: 'manual',
              }));
              onSave && onSave(selected);
            }}>Save Selected</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default GenerateModal;


