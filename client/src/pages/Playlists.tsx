import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Grid,
  MenuItem,
} from '@mui/material';
import {
  PlayArrow,
  MoreVert,
  Add,
  MusicNote,
  Delete,
  Edit,
  PlaylistPlay,
} from '@mui/icons-material';
import { useGetPlaylistsQuery, useDeletePlaylistMutation } from '../store/api/playlistApi';
import { useGetSongsQuery } from '../store/api/audioApi';
import { useUI } from '../hooks/useUI';
import { useNotification } from '../contexts/NotificationContext';
import PlaylistModal from '../components/Playlist/PlaylistModal';
import PlaylistViewModal from '../components/Playlist/PlaylistViewModal';
import type { Playlist } from '../types';
import { getPlaylistCoverUrl } from '../utils/playlistUtils';
import PlaylistCard from '../components/common/PlaylistCard';
import StyledButton from '../components/common/StyledButton';
import StyledAlert from '../components/common/StyledAlert';
import StyledMenu from '../components/common/StyledMenu';

const Playlists: React.FC = () => {
  const { data: playlists = [], isLoading, error } = useGetPlaylistsQuery();
  const { data: songs = [] } = useGetSongsQuery();
  const [deletePlaylist] = useDeletePlaylistMutation();
  const { openPlaylistModal, playlistModalOpen, closePlaylistModal } = useUI();
  const { showNotification } = useNotification();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewPlaylist, setViewPlaylist] = useState<Playlist | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editPlaylist, setEditPlaylist] = useState<Playlist | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, playlist: Playlist) => {
    setAnchorEl(event.currentTarget);
    setSelectedPlaylist(playlist);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPlaylist(null);
  };

  const handleDelete = async () => {
    if (!selectedPlaylist) return;

    try {
      await deletePlaylist(selectedPlaylist.id).unwrap();
      showNotification('Playlist deleted successfully', 'success');
      handleMenuClose();
    } catch (err) {
      showNotification('Failed to delete playlist', 'error');
    }
  };

  const handleEdit = () => {
    if (selectedPlaylist) {
      setEditPlaylist(selectedPlaylist);
      setEditModalOpen(true);
      handleMenuClose();
    }
  };

  const getPlaylistSongs = (playlist: Playlist) => {
    return songs.filter(song => playlist.songIds.includes(song.id));
  };

  const getTotalDuration = (playlist: Playlist) => {
    const playlistSongs = getPlaylistSongs(playlist);
    return playlistSongs.reduce((total, song) => total + song.duration, 0);
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <StyledAlert severity="error">
          Failed to load playlists. Please try again.
        </StyledAlert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>
            Playlists
          </Typography>
          <Typography variant="body1" sx={{ color: '#8e8e93' }}>
            {playlists.length} playlists in your library
          </Typography>
        </Box>
        <StyledButton
          variant="primary"
          startIcon={<Add />}
          onClick={openPlaylistModal}
        >
          Create Playlist
        </StyledButton>
      </Box>

      {/* Playlists Grid */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography sx={{ color: '#8e8e93' }}>Loading playlists...</Typography>
        </Box>
      ) : playlists.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <MusicNote sx={{ fontSize: 64, color: '#8e8e93', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
            No playlists yet
          </Typography>
          <Typography sx={{ color: '#8e8e93', mb: 3 }}>
            Create your first playlist to organize your music
          </Typography>
          <StyledButton
            variant="primary"
            startIcon={<Add />}
            onClick={openPlaylistModal}
          >
            Create Playlist
          </StyledButton>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {playlists.map((playlist) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={playlist.id}>
              <PlaylistCard
                playlist={playlist}
                songs={songs}
                onClick={() => {
                  setViewPlaylist(playlist);
                  setViewModalOpen(true);
                }}
                onOptions={handleMenuOpen}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Playlist Menu */}
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit} sx={{ color: '#ffffff' }}>
          <Edit sx={{ mr: 1, fontSize: 20 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: '#ff453a' }}>
          <Delete sx={{ mr: 1, fontSize: 20 }} />
          Delete
        </MenuItem>
      </StyledMenu>

      {/* Playlist Modal */}
      <PlaylistModal 
        open={playlistModalOpen} 
        onClose={closePlaylistModal}
      />

      {/* Edit Playlist Modal */}
      <PlaylistModal 
        open={editModalOpen} 
        onClose={() => {
          setEditModalOpen(false);
          setEditPlaylist(null);
        }}
        playlist={editPlaylist || undefined}
      />

      {/* Playlist View Modal */}
      <PlaylistViewModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        playlist={viewPlaylist}
        songs={songs}
      />
    </Box>
  );
};

export default Playlists; 