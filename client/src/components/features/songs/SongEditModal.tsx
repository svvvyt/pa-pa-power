import React, { useState, useEffect } from 'react';
import {
  Box,
} from '@mui/material';
import { useUpdateSong } from '@/hooks';
import { useNotification } from '@/contexts';
import type { Song } from '@/types';
import { UniversalModal, StyledTextField, StyledButton, StyledAlert } from '@/components';

interface SongEditModalProps {
  open: boolean;
  onClose: () => void;
  song?: Song;
  onSuccess?: () => void;
}

const SongEditModal: React.FC<SongEditModalProps> = ({ open, onClose, song, onSuccess }) => {
  const { mutate: updateSong, loading } = useUpdateSong();
  const { showNotification } = useNotification();
  
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (song) {
      setTitle(song.title);
      setArtist(song.artist);
      setAlbum(song.album);
      setLyrics(song.lyrics || '');
    } else {
      setTitle('');
      setArtist('');
      setAlbum('');
      setLyrics('');
    }
    setError(null);
  }, [song, open]);

  const handleSubmit = async () => {
    if (!song) return;

    if (!title.trim()) {
      setError('Song title is required');
      return;
    }

    try {
      const result = await updateSong({
        id: song.id,
        updates: {
          title: title.trim(),
          artist: artist.trim(),
          album: album.trim(),
          lyrics: lyrics.trim(),
        },
      });
      
      if (result) {
      showNotification('Song updated successfully!', 'success');
        onSuccess?.();
      onClose();
      } else {
        setError('Failed to update song. Please try again.');
        showNotification('Failed to update song', 'error');
      }
    } catch (err) {
      setError('Failed to update song. Please try again.');
      showNotification('Failed to update song', 'error');
    }
  };

  const handleClose = () => {
    onClose();
    setError(null);
  };

  if (!song) return null;

  return (
    <UniversalModal open={open} onClose={handleClose} title="Edit Song">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <StyledTextField
          label="Song Title"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          variant="dark"
        />
        <StyledTextField
          label="Artist"
          value={artist}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArtist(e.target.value)}
          fullWidth
          variant="dark"
        />
        <StyledTextField
          label="Album"
          value={album}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAlbum(e.target.value)}
          fullWidth
          variant="dark"
        />
        <StyledTextField
          label="Lyrics"
          value={lyrics}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLyrics(e.target.value)}
          fullWidth
          multiline
          minRows={8}
          variant="dark"
        />
        {error && (
          <StyledAlert severity="error">
            {error}
          </StyledAlert>
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <StyledButton
          onClick={handleClose}
          variant="outline"
        >
          Cancel
        </StyledButton>
        <StyledButton
          onClick={handleSubmit}
          variant="primary"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update'}
        </StyledButton>
      </Box>
    </UniversalModal>
  );
};

export default SongEditModal; 