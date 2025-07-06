import React, { useState } from 'react';
import {
  Box,
  Typography,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  MusicNote,
} from '@mui/icons-material';
import { useGetPlaylists, useDeletePlaylist, useGetSongs, useUI } from '@/hooks';
import { useNotification } from '@/contexts';
import { PlaylistModal, PlaylistViewModal, PlaylistCard, StyledButton, StyledAlert, StyledMenu, PlaylistCardSkeleton } from '@/components';
import type { Playlist } from '@/types';

const Playlists: React.FC = () => {
  const { data: playlists = [], loading: isLoading, error, refresh } = useGetPlaylists();
  const { data: songs = [] } = useGetSongs();
  const { mutate: deletePlaylist } = useDeletePlaylist();
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
      const result = await deletePlaylist(selectedPlaylist.id);
      if (result !== null) {
        showNotification('Playlist deleted successfully', 'success');
        handleMenuClose();
      } else {
        showNotification('Failed to delete playlist', 'error');
      }
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
              <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          mb: 4,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Box>
            <Typography variant="h4" sx={{ 
              color: '#ffffff', 
              fontWeight: 700, 
              mb: 1,
              fontSize: { xs: '1.75rem', sm: '2.125rem' }
            }}>
              Playlists
            </Typography>
            <Typography variant="body1" sx={{ color: '#8e8e93' }}>
              {(playlists || []).length} playlist(s) in your library
            </Typography>
          </Box>
          <StyledButton
            variant="primary"
            startIcon={<Add />}
            onClick={openPlaylistModal}
            sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}
          >
            Create Playlist
          </StyledButton>
        </Box>

      {/* Playlists Grid */}
      {isLoading ? (
        <PlaylistCardSkeleton count={8} />
      ) : (playlists || []).length === 0 ? (
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
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(auto-fill, minmax(280px, 1fr))' }, 
          gap: { xs: 2, sm: 3 } 
        }}>
          {(playlists || []).map((playlist: any) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              songs={songs || []}
              onClick={() => {
                setViewPlaylist(playlist);
                setViewModalOpen(true);
              }}
              onOptions={handleMenuOpen}
            />
          ))}
        </Box>
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
        onSuccess={refresh}
      />

      {/* Edit Playlist Modal */}
      <PlaylistModal 
        open={editModalOpen} 
        onClose={() => {
          setEditModalOpen(false);
          setEditPlaylist(null);
        }}
        playlist={editPlaylist || undefined}
        onSuccess={refresh}
      />

      {/* Playlist View Modal */}
      <PlaylistViewModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        playlist={viewPlaylist}
        songs={songs || []}
      />
    </Box>
  );
};

export default Playlists; 