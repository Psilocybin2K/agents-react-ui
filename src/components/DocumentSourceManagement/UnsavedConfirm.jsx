import React from 'react';
import { Dialog, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, Button, Text } from '@fluentui/react-components';

export default function UnsavedConfirm({ open, onCancel, onDiscard }) {
  if (!open) return null;
  return (
    <Dialog open onOpenChange={() => { /* controlled */ }}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Discard unsaved changes?</DialogTitle>
          <DialogContent>
            <Text>You have unsaved changes. If you close now, your edits will be lost.</Text>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => onCancel && onCancel()}>Stay</Button>
            <Button appearance="primary" onClick={() => onDiscard && onDiscard()}>Discard</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}


