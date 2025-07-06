import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface UniversalModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

const UniversalModal: React.FC<UniversalModalProps> = ({
  open,
  onClose,
  title,
  actions,
  children,
  maxWidth = 'sm',
  fullWidth = true,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: 'rgba(28,28,30,0.98)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.4)',
        },
      }}
    >
      {title && (
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', fontWeight: 700 }}>
          {title}
          <IconButton onClick={onClose} sx={{ color: '#8e8e93', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <Close />
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent sx={{ pt: 2 }}>{children}</DialogContent>
      {(actions || actions === undefined) && (
        <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'center' }}>
          {actions ? (
            actions
          ) : (
            <Button onClick={onClose} sx={{ color: '#8e8e93', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
              Close
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default UniversalModal; 