import React from 'react';
import { Dialog, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, Button, Text } from '@fluentui/react-components';

export default function DeleteConfirm({ open, onCancel, onConfirm, itemName = 'this document' }) {
  if (!open) return null;
  return (
    <Dialog open onOpenChange={() => { /* controlled */ }}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Delete</DialogTitle>
          <DialogContent>
            <Text>Are you sure you want to delete {itemName}? This action cannot be undone.</Text>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => onCancel && onCancel()}>Cancel</Button>
            <Button appearance="primary" onClick={() => onConfirm && onConfirm()}>Delete</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}


