import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  PlayArrow,
  MoreVert,
  Add,
  MusicNote,
  Delete,
  Edit,
  Album as AlbumIcon,
} from '@mui/icons-material';
import { useGetAlbumsQuery, useDeleteAlbumMutation } from '../store/api/albumApi';
import { useGetSongsQuery } from '../store/api/audioApi';
import { useNotification } from '../contexts/NotificationContext';
import AlbumModal from '../components/Album/AlbumModal';
import AlbumViewModal from '../components/Album/AlbumViewModal';
import StyledMenu from '../components/common/StyledMenu';
import StyledButton from '../components/common/StyledButton';
import StyledAlert from '../components/common/StyledAlert';
import { COLORS, BORDER_RADIUS, SHADOWS, BACKDROP_FILTERS } from '../utils/themeConstants';
import type { Album } from '../types';
import { getAlbumCoverUrl } from '../utils/songUtils';
import AlbumCard from '../components/common/AlbumCard';

const Albums: React.FC = () => {
  const { data: albums = [], isLoading, error } = useGetAlbumsQuery();
  const { data: songs = [] } = useGetSongsQuery();
  const [deleteAlbum] = useDeleteAlbumMutation();
  const { showNotification } = useNotification();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewAlbum, setViewAlbum] = useState<Album | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAlbum, setEditAlbum] = useState<Album | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, album: Album) => {
    setAnchorEl(event.currentTarget);
    setSelectedAlbum(album);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAlbum(null);
  };

  const handleDelete = async () => {
    if (!selectedAlbum) return;

    try {
      await deleteAlbum(selectedAlbum.id).unwrap();
      showNotification('Album deleted successfully', 'success');
      handleMenuClose();
    } catch (err) {
      showNotification('Failed to delete album', 'error');
    }
  };

  const handleEdit = () => {
    if (selectedAlbum) {
      setEditAlbum(selectedAlbum);
      setEditModalOpen(true);
      handleMenuClose();
    }
  };

  const getAlbumSongs = (album: Album) => {
    return songs.filter(song => album.songIds.includes(song.id));
  };

  const getTotalDuration = (album: Album) => {
    const albumSongs = getAlbumSongs(album);
    return albumSongs.reduce((total, song) => total + song.duration, 0);
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
          Failed to load albums. Please try again.
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
            Albums
          </Typography>
          <Typography variant="body1" sx={{ color: '#8e8e93' }}>
            {albums.length} albums in your library
          </Typography>
        </Box>
        <StyledButton
          variant="primary"
          startIcon={<Add />}
          onClick={() => setCreateModalOpen(true)}
        >
          Create Album
        </StyledButton>
      </Box>

      {/* Albums Grid */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography sx={{ color: '#8e8e93' }}>Loading albums...</Typography>
        </Box>
      ) : albums.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <AlbumIcon sx={{ fontSize: 64, color: '#8e8e93', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
            No albums yet
          </Typography>
          <Typography sx={{ color: '#8e8e93', mb: 3 }}>
            Create your first album to organize your music
          </Typography>
          <StyledButton
            variant="primary"
            startIcon={<Add />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Album
          </StyledButton>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3 }}>
          {albums.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              songs={songs}
              onClick={() => {
                setViewAlbum(album);
                setViewModalOpen(true);
              }}
              onOptions={handleMenuOpen}
            />
          ))}
        </Box>
      )}

      {/* Album Menu */}
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

      {/* Create Album Modal */}
      <AlbumModal 
        open={createModalOpen} 
        onClose={() => setCreateModalOpen(false)}
      />

      {/* Edit Album Modal */}
      <AlbumModal 
        open={editModalOpen} 
        onClose={() => {
          setEditModalOpen(false);
          setEditAlbum(null);
        }}
        album={editAlbum || undefined}
      />

      {/* Album View Modal */}
      <AlbumViewModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        album={viewAlbum}
        songs={songs}
      />
    </Box>
  );
};

export default Albums; 