import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import { Close, MusicNote, Add, Remove } from '@mui/icons-material';
import { useCreateAlbumMutation, useUpdateAlbumMutation } from '@/store/api/albumApi';
import { useGetSongsQuery } from '@/store/api/audioApi';
import { useNotification } from '@/contexts';
import type { Album, Song } from '@/types';
import { UniversalModal, SongListItem, StyledTextField, StyledButton, StyledAlert } from '@/components';

interface AlbumModalProps {
  open: boolean;
  onClose: () => void;
  album?: Album;
  onSuccess?: () => void;
}

const AlbumModal: React.FC<AlbumModalProps> = ({ open, onClose, album, onSuccess }) => {
  const [createAlbum] = useCreateAlbumMutation();
  const [updateAlbum] = useUpdateAlbumMutation();
  const { data: songs = [] } = useGetSongsQuery();
  const { showNotification } = useNotification();
  
  const [name, setName] = useState('');
  const [artist, setArtist] = useState('');
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!album;

  useEffect(() => {
    if (album) {
      setName(album.name);
      setArtist(album.artist);
      setDescription(album.description || '');
      setReleaseDate(album.releaseDate || '');
      setSelectedSongIds(album.songIds);
    } else {
      setName('');
      setArtist('');
      setDescription('');
      setReleaseDate('');
      setSelectedSongIds([]);
    }
    setError(null);
  }, [album, open]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Album name is required');
      return;
    }

    if (!artist.trim()) {
      setError('Artist name is required');
      return;
    }

    try {
      if (isEditing && album) {
        await updateAlbum({
          id: album.id,
          updates: {
            name: name.trim(),
            artist: artist.trim(),
            description: description.trim(),
            releaseDate: releaseDate.trim(),
            songIds: selectedSongIds,
          },
        }).unwrap();
        showNotification('Album updated successfully!', 'success');
      } else {
        await createAlbum({
          name: name.trim(),
          artist: artist.trim(),
          description: description.trim(),
          releaseDate: releaseDate.trim(),
          songIds: selectedSongIds,
        }).unwrap();
        showNotification('Album created successfully!', 'success');
      }
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError('Failed to save album. Please try again.');
      showNotification('Failed to save album', 'error');
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

  const selectedSongs = songs.filter(song => selectedSongIds.includes(song.id));

  return (
    <UniversalModal open={open} onClose={handleClose} title={album ? 'Edit Album' : 'Create Album'}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <StyledTextField
          label="Album Name"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          fullWidth
          required
          variant="dark"
        />
        <StyledTextField
          label="Artist"
          value={artist}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArtist(e.target.value)}
          fullWidth
          required
          variant="dark"
        />
        <StyledTextField
          label="Release Date"
          value={releaseDate}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReleaseDate(e.target.value)}
          fullWidth
          placeholder="YYYY-MM-DD"
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
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Available Songs */}
        <Box>
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600, mb: 2 }}>
            Available Songs ({songs.length})
          </Typography>
          <Box sx={{ 
            maxHeight: 300, 
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}>
            {songs.map((song) => (
              <SongListItem
                key={song.id}
                song={song}
                onClick={() => toggleSong(song.id)}
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
          {album ? 'Update' : 'Create'}
        </StyledButton>
      </Box>
    </UniversalModal>
  );
};

export default AlbumModal; 