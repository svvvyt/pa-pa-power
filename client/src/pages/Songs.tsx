import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  InputAdornment,
  Chip,
  MenuItem,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  MoreVert,
  Search,
  CloudUpload,
  MusicNote,
  Delete,
  Edit,
} from '@mui/icons-material';
import { useGetSongsQuery, useDeleteSongMutation } from '../store/api/audioApi';
import { useAudioPlayerContext } from '../contexts/AudioPlayerContext';
import { useUI } from '../hooks/useUI';
import { useNotification } from '../contexts/NotificationContext';
import UploadModal from '../components/Upload/UploadModal';
import SongEditModal from '../components/Song/SongEditModal';
import { getAlbumCoverUrl, formatDuration } from '../utils/songUtils';
import type { Song } from '../types';
import SongViewModal from '../components/Song/SongViewModal';
import StyledTextField from '../components/common/StyledTextField';
import StyledButton from '../components/common/StyledButton';
import StyledAlert from '../components/common/StyledAlert';
import StyledMenu from '../components/common/StyledMenu';
import { COLORS, BORDER_RADIUS, SHADOWS, BACKDROP_FILTERS } from '../utils/themeConstants';
import UniversalCard from '../components/common/UniversalCard';
import SongCard from '../components/common/SongCard';

const Songs: React.FC = () => {
  const { data: songs = [], isLoading, error } = useGetSongsQuery();
  const [deleteSong] = useDeleteSongMutation();
  const { currentSong, isPlaying, play, pause, setQueue } = useAudioPlayerContext();
  const { openUploadModal, uploadModalOpen, closeUploadModal } = useUI();
  const { showNotification } = useNotification();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewSong, setViewSong] = useState<Song | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, song: Song) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedSong(song);
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSong(null);
    setMenuOpen(false);
  };

  const handleEdit = () => {
    setEditModalOpen(true);
    handleMenuClose();
  };

  const handlePlayPause = (song: Song) => {
    if (currentSong?.id === song.id && isPlaying) {
      pause();
    } else {
      setQueue(filteredSongs);
      play(song);
    }
  };

  const handleDelete = async () => {
    if (!selectedSong) return;

    try {
      await deleteSong(selectedSong.id).unwrap();
      showNotification('Song deleted successfully', 'success');
      handleMenuClose();
    } catch (err) {
      showNotification('Failed to delete song', 'error');
    }
  };



  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         song.album.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || song.album === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const genres = ['all', ...Array.from(new Set(songs.map(song => song.album)))];

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>
            Songs
          </Typography>
          <Typography variant="body1" sx={{ color: '#8e8e93' }}>
            {songs.length} songs in your library
          </Typography>
        </Box>
        <StyledButton
          variant="primary"
          startIcon={<CloudUpload />}
          onClick={openUploadModal}
        >
          Upload Song
        </StyledButton>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <StyledTextField
          placeholder="Search songs..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#8e8e93' }} />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
          variant="dark"
        />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {genres.map((genre) => (
            <Chip
              key={genre}
              label={genre === 'all' ? 'All Genres' : genre}
              onClick={() => setSelectedGenre(genre)}
              sx={{
                bgcolor: selectedGenre === genre ? '#0a84ff' : 'rgba(44,44,46,0.8)',
                color: selectedGenre === genre ? '#ffffff' : '#8e8e93',
                border: '1px solid rgba(255,255,255,0.1)',
                '&:hover': {
                  bgcolor: selectedGenre === genre ? '#0070d1' : 'rgba(44,44,46,1)',
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Songs Grid */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography sx={{ color: '#8e8e93' }}>Loading songs...</Typography>
        </Box>
      ) : filteredSongs.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <MusicNote sx={{ fontSize: 64, color: '#8e8e93', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
            No songs found
          </Typography>
          <Typography sx={{ color: '#8e8e93' }}>
            {searchTerm || selectedGenre !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Upload your first song to get started'
            }
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3 }}>
          {filteredSongs.map((song) => {
            const isCurrentSong = currentSong?.id === song.id;
            const isCurrentlyPlaying = isCurrentSong && isPlaying;

            return (
              <SongCard
                key={song.id}
                song={song}
                onPlayPause={handlePlayPause}
                onCardClick={() => {
                  setViewSong(song);
                  setViewModalOpen(true);
                }}
                onMenuClick={handleMenuOpen}
                isCurrentSong={isCurrentSong}
                isPlaying={isPlaying}
              />
            );
          })}
        </Box>
      )}

      {/* Song Menu */}
      <StyledMenu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        keepMounted
        disablePortal={false}
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

      {/* Upload Modal */}
      <UploadModal open={uploadModalOpen} onClose={closeUploadModal} />

      {/* Edit Modal */}
      <SongEditModal 
        open={editModalOpen} 
        onClose={() => setEditModalOpen(false)}
        song={selectedSong || undefined}
      />

      {/* Song View Modal */}
      <SongViewModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        song={viewSong}
      />
    </Box>
  );
};

export default Songs; 