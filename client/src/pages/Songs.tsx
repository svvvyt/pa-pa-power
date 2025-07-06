import React, { useState, useCallback } from 'react';
import { Box, MenuItem } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useSongs, useDeleteSong, useSongsFilter, useUI } from '@/hooks';
import { useAudioPlayerContext, useNotification } from '@/contexts';
import { UploadModal, SongEditModal, SongViewModal, SongsHeader, SongsSearch, SongsGrid, StyledAlert, StyledMenu } from '@/components';
import type { Song } from '@/types';

const Songs: React.FC = () => {
  // Data fetching
  const { data: songs = [], loading, error, refresh } = useSongs();
  const { mutate: deleteSong, loading: deleting } = useDeleteSong();

  // Audio player context
  const { currentSong, isPlaying, play, pause, setQueue } = useAudioPlayerContext();

  // UI state
  const { openUploadModal, uploadModalOpen, closeUploadModal } = useUI();
  const { showNotification } = useNotification();

  // Local state
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Filtering and search
  const {
    filters,
    filteredSongs,
    filterOptions,
    hasActiveFilters,
    setSearchTerm,
    setSelectedGenre,
    setSelectedArtist,
    resetFilters,
  } = useSongsFilter(songs || []);

  // Event handlers
  const handlePlayPause = useCallback((song: Song) => {
    if (currentSong?.id === song.id && isPlaying) {
      pause();
    } else {
      setQueue(filteredSongs);
      play(song);
    }
  }, [currentSong?.id, isPlaying, pause, setQueue, filteredSongs, play]);

  const handleCardClick = useCallback((song: Song) => {
    setSelectedSong(song);
    setViewModalOpen(true);
  }, []);

  const handleMenuClick = useCallback((e: React.MouseEvent<HTMLButtonElement>, song: Song) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setAnchorEl(e.currentTarget);
    setSelectedSong(song);
    setMenuOpen(true);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedSong(null);
    setMenuOpen(false);
  }, []);

  const handleEdit = useCallback(() => {
    setEditModalOpen(true);
    // Don't clear selectedSong here, just close the menu
    setAnchorEl(null);
    setMenuOpen(false);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!selectedSong) return;

    try {
      await deleteSong(selectedSong.id);
      showNotification('Song deleted successfully', 'success');
      handleMenuClose();
      refresh(); // Refresh the songs list
    } catch (err) {
      showNotification('Failed to delete song', 'error');
    }
  }, [selectedSong, deleteSong, showNotification, handleMenuClose, refresh]);

  // Error handling
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <StyledAlert severity="error">
          Failed to load songs. Please try again.
        </StyledAlert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <SongsHeader
        songCount={songs?.length || 0}
        onUploadClick={openUploadModal}
      />

      {/* Search and Filters */}
      <SongsSearch
        filters={filters}
        filterOptions={filterOptions}
        onSearchChange={setSearchTerm}
        onGenreChange={setSelectedGenre}
        onArtistChange={setSelectedArtist}
        onResetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
            />

      {/* Songs Grid */}
      <SongsGrid
        songs={filteredSongs}
        loading={loading}
        currentSong={currentSong}
        isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
        onCardClick={handleCardClick}
        onMenuClick={handleMenuClick}
      />

      {/* Modals */}
      <UploadModal 
        open={uploadModalOpen} 
        onClose={closeUploadModal}
        onSuccess={() => {
          console.log('UploadModal onSuccess called, refreshing songs');
          refresh();
        }}
      />

      {selectedSong && editModalOpen && (
        <SongEditModal 
          open={editModalOpen} 
          onClose={() => {
            setEditModalOpen(false);
            setSelectedSong(null);
                }}
          song={selectedSong}
          onSuccess={() => {
            setEditModalOpen(false);
            setSelectedSong(null);
            refresh();
          }}
        />
      )}

      {selectedSong && viewModalOpen && (
        <SongViewModal
          open={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedSong(null);
          }}
          song={selectedSong}
        />
      )}

      {/* Context Menu */}
      <StyledMenu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem 
          onClick={handleEdit}
          sx={{ 
            color: '#ffffff',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)',
            }
          }}
        >
          <Edit sx={{ mr: 1, fontSize: 20 }} />
          Edit
        </MenuItem>
        <MenuItem 
          onClick={handleDelete}
          disabled={deleting}
          sx={{ 
            color: '#ff453a',
            '&:hover': {
              bgcolor: 'rgba(255,69,58,0.1)',
            },
            '&.Mui-disabled': {
              color: 'rgba(255,69,58,0.5)',
            }
          }}
        >
          <Delete sx={{ mr: 1, fontSize: 20 }} />
          Delete
        </MenuItem>
      </StyledMenu>
    </Box>
  );
};

export default Songs; 