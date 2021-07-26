import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import Link from 'next/link';

type Props = {
  open: boolean;
  handleClose: any;
};

const AlertDialog = ({ open, handleClose }: Props) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {'Webからの注文は受け付けておりません'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Webから直接の注文は対応しておりません。
          <br />
          BLUE CORNのLINEからご注文ください。
          <br />
          <Link href="https://lin.ee/dQcOZub">LINEを開く</Link>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
