import React from 'react';
import { Dialog, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, Button, Text } from '@fluentui/react-components';

const ConfirmDialog = ({
  open,
  title = 'Confirm',
  content = 'Are you sure?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  return (
    <Dialog open onOpenChange={() => { /* controlled */ }}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <Text>{content}</Text>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => onCancel && onCancel()}>{cancelLabel}</Button>
            <Button appearance="primary" onClick={() => onConfirm && onConfirm()}>{confirmLabel}</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default ConfirmDialog;


