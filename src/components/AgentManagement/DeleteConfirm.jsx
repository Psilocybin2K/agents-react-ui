import React from 'react';
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle } from '@fluentui/react-components';

export default function DeleteConfirm({ open, title = 'Delete agent?', description = 'This action cannot be undone.', onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <Dialog open onOpenChange={(_, data) => { if (!data.open && onCancel) onCancel(); }}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>{description}</DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => onCancel && onCancel()}>Cancel</Button>
            <Button appearance="primary" onClick={() => onConfirm && onConfirm()}>Delete</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}


