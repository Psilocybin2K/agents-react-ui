import React from 'react';
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle } from '@fluentui/react-components';

export default function DiscardConfirm({ open, title = 'Discard unsaved changes?', description = 'Your changes will be lost.', onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <Dialog open onOpenChange={(_, data) => { if (!data.open && onCancel) onCancel(); }}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>{description}</DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => onCancel && onCancel()}>Keep editing</Button>
            <Button appearance="primary" onClick={() => onConfirm && onConfirm()}>Discard</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}


