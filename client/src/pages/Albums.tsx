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
  Album as AlbumIcon,
} from '@mui/icons-material';
import { useAlbums, useDeleteAlbum, useGetSongs } from '@/hooks';
import { useNotification } from '@/contexts';
import { AlbumModal, AlbumViewModal, AlbumCard, StyledMenu, StyledButton, StyledAlert, AlbumCardSkeleton } from '@/components';
import type { Album } from '@/types';

const Albums: React.FC = () => {
  const { data: albums = [], loading: isLoading, error, refresh } = useAlbums();
  const { data: songs = [] } = useGetSongs();
  const { mutate: deleteAlbum } = useDeleteAlbum();
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
      const result = await deleteAlbum(selectedAlbum.id);
      if (result !== null) {
        showNotification('Album deleted successfully', 'success');
        handleMenuClose();
      } else {
        showNotification('Failed to delete album', 'error');
      }
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
              Albums
            </Typography>
            <Typography variant="body1" sx={{ color: '#8e8e93' }}>
              {(albums || []).length} album(s) in your library
            </Typography>
          </Box>
          <StyledButton
            variant="primary"
            startIcon={<Add />}
            onClick={() => setCreateModalOpen(true)}
            sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}
          >
            Create Album
          </StyledButton>
        </Box>

      {/* Albums Grid */}
      {isLoading ? (
        <AlbumCardSkeleton count={6} />
      ) : (albums || []).length === 0 ? (
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
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(auto-fill, minmax(280px, 1fr))' }, 
          gap: { xs: 2, sm: 3 } 
        }}>
          {(albums || []).map((album: any) => (
            <AlbumCard
              key={album.id}
              album={album}
              songs={songs || []}
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
        onSuccess={refresh}
      />

      {/* Edit Album Modal */}
      <AlbumModal 
        open={editModalOpen} 
        onClose={() => {
          setEditModalOpen(false);
          setEditAlbum(null);
        }}
        album={editAlbum || undefined}
        onSuccess={refresh}
      />

      {/* Album View Modal */}
      <AlbumViewModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        album={viewAlbum}
        songs={songs || []}
      />
    </Box>
  );
};

export default Albums; 