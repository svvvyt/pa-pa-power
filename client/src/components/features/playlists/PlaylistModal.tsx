import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import { Close, MusicNote, Add, Remove } from '@mui/icons-material';
import { useCreatePlaylist, useUpdatePlaylist, useGetSongs } from '@/hooks';
import { useNotification } from '@/contexts';
import type { Playlist, Song } from '@/types';
import { UniversalModal, SongListItem, StyledTextField, StyledButton, StyledAlert } from '@/components';

interface PlaylistModalProps {
  open: boolean;
  onClose: () => void;
  playlist?: Playlist;
  onSuccess?: () => void;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({ open, onClose, playlist, onSuccess }) => {
  const { mutate: createPlaylist } = useCreatePlaylist();
  const { mutate: updatePlaylist } = useUpdatePlaylist();
  const { data: songs = [] } = useGetSongs();
  const { showNotification } = useNotification();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!playlist;

  useEffect(() => {
    if (playlist) {
      setName(playlist.name);
      setDescription(playlist.description || '');
      setSelectedSongIds(playlist.songIds);
    } else {
      setName('');
      setDescription('');
      setSelectedSongIds([]);
    }
    setError(null);
  }, [playlist, open]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Playlist name is required');
      return;
    }

    try {
      if (isEditing && playlist) {
        const result = await updatePlaylist({
          id: playlist.id,
          updates: {
            name: name.trim(),
            description: description.trim(),
            songIds: selectedSongIds,
          },
        });
        if (result) {
          showNotification('Playlist updated successfully!', 'success');
          onSuccess?.();
          onClose();
        } else {
          setError('Failed to update playlist. Please try again.');
          showNotification('Failed to update playlist', 'error');
        }
      } else {
        const result = await createPlaylist({
          name: name.trim(),
          description: description.trim(),
          songIds: selectedSongIds,
        });
        if (result) {
          showNotification('Playlist created successfully!', 'success');
          onSuccess?.();
          onClose();
        } else {
          setError('Failed to create playlist. Please try again.');
          showNotification('Failed to create playlist', 'error');
        }
      }
    } catch (err) {
      setError('Failed to save playlist. Please try again.');
      showNotification('Failed to save playlist', 'error');
    }
  };

  const handleClose = () => {
    onClose();
    setError(null);
  };

  const toggleSong = (songId: string) => {
    setSelectedSongIds(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

  const selectedSongs = (songs || []).filter((song: any) => selectedSongIds.includes(song.id));

  return (
    <UniversalModal open={open} onClose={handleClose} title={playlist ? 'Edit Playlist' : 'Create Playlist'}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <StyledTextField
          label="Playlist Name"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          fullWidth
          required
          variant="dark"
        />
        <StyledTextField
          label="Description"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
          fullWidth
          multiline
          minRows={2}
          variant="dark"
        />
        {/* Selected Songs */}
        {selectedSongs.length > 0 && (
          <Box>
            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600, mb: 2 }}>
              Selected Songs ({selectedSongs.length})
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {selectedSongs.map((song) => (
                <SongListItem
                  key={song.id}
                  song={song}
                  onClick={() => toggleSong(song.id)}
                  rightActions={<Remove sx={{ color: '#0a84ff' }} />}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Available Songs */}
        <Box>
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600, mb: 2 }}>
            Available Songs ({(songs || []).length})
          </Typography>
          <Box sx={{ 
            maxHeight: 300, 
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}>
            {(songs || []).map((song: any) => (
              <SongListItem
                key={song.id}
                song={song}
                onClick={() => toggleSong(song.id)}
                rightActions={selectedSongIds.includes(song.id) ? <Remove sx={{ color: '#0a84ff' }} /> : <Add sx={{ color: '#8e8e93' }} />}
              />
            ))}
          </Box>
        </Box>

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
        >
          {playlist ? 'Update' : 'Create'}
        </StyledButton>
      </Box>
    </UniversalModal>
  );
};

export default PlaylistModal; 