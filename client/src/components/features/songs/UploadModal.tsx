import React, { useState, useCallback } from 'react';
import {
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
  Chip,
} from '@mui/material';
import { CloudUpload, Close, MusicNote, CheckCircle, Error } from '@mui/icons-material';
import { useUploadSong } from '@/hooks';
import { useNotification } from '@/contexts';
import { UniversalModal } from '@/components';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ open, onClose, onSuccess }) => {
  const { mutate: uploadSong, loading: isLoading } = useUploadSong();
  const { showNotification } = useNotification();
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/flac', 'audio/aac'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid audio file (MP3, WAV, FLAC, or AAC)');
      return;
    }

    if (file.size > maxSize) {
      setError('File size must be less than 50MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploadProgress(0);
      const result = await uploadSong(selectedFile);
      
      if (result) {
        showNotification('Song uploaded successfully!', 'success');
        setSelectedFile(null);
        setUploadProgress(0);
        setError(null);
        // Call the success callback to refresh the parent component
        console.log('Upload successful, calling onSuccess callback');
        onSuccess?.();
        onClose();
      } else {
        setError('Failed to upload song. Please try again.');
        showNotification('Failed to upload song', 'error');
      }
    } catch (err) {
      setError('Failed to upload song. Please try again.');
      showNotification('Failed to upload song', 'error');
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setSelectedFile(null);
      setUploadProgress(0);
      setError(null);
    }
  };

  return (
    <UniversalModal open={open} onClose={onClose} title="Upload Song">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', minHeight: 180 }}>
        <Button
          variant="contained"
          component="label"
          sx={{
            bgcolor: '#0a84ff',
            color: '#fff',
            borderRadius: 999,
            px: 3,
            py: 1.5,
            fontWeight: 500,
            boxShadow: '0 2px 8px 0 rgba(10,132,255,0.3)',
            '&:hover': { bgcolor: '#0070d1' },
          }}
        >
          Choose File
          <input type="file" accept="audio/*" hidden onChange={handleFileSelect} />
        </Button>
        {selectedFile && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CheckCircle sx={{ fontSize: 48, color: '#30d158' }} />
            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
              {selectedFile.name}
            </Typography>
            <Chip
              label={`${(selectedFile.size / 1024 / 1024).toFixed(1)} MB`}
              sx={{
                bgcolor: 'rgba(48,209,88,0.2)',
                color: '#30d158',
                border: '1px solid rgba(48,209,88,0.3)',
              }}
            />
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ borderRadius: 2, mt: 2 }}>{error}</Alert>
        )}
        {isLoading && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" sx={{ color: '#8e8e93', mb: 1 }}>
              Uploading...
            </Typography>
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.1)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#0a84ff',
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button onClick={onClose} sx={{ color: '#8e8e93', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!selectedFile || isLoading}
          sx={{
            bgcolor: '#0a84ff',
            color: '#fff',
            borderRadius: 999,
            px: 3,
            fontWeight: 500,
            boxShadow: '0 2px 8px 0 rgba(10,132,255,0.3)',
            '&:hover': { bgcolor: '#0070d1' },
          }}
        >
          Upload
        </Button>
      </Box>
    </UniversalModal>
  );
};

export default UploadModal; 