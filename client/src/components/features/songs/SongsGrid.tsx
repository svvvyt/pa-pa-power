import React, { memo } from 'react';
import { Box, Typography } from '@mui/material';
import { MusicNote } from '@mui/icons-material';
import SongCard from './SongCard';
import { SongCardSkeleton } from '@/components';
import type { Song } from '@/types';

interface SongsGridProps {
  songs: Song[];
  loading: boolean;
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: (song: Song) => void;
  onCardClick: (song: Song) => void;
  onMenuClick: (e: React.MouseEvent<HTMLButtonElement>, song: Song) => void;
}

const SongsGrid: React.FC<SongsGridProps> = memo(({
  songs,
  loading,
  currentSong,
  isPlaying,
  onPlayPause,
  onCardClick,
  onMenuClick,
}) => {
  if (loading) {
    return <SongCardSkeleton count={12} />;
  }

  if (songs.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <MusicNote sx={{ fontSize: 64, color: '#8e8e93', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
          No songs found
        </Typography>
        <Typography sx={{ color: '#8e8e93' }}>
          Upload your first song to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(auto-fill, minmax(280px, 1fr))' }, 
      gap: { xs: 2, sm: 3 } 
    }}>
      {songs.map((song) => {
        const isCurrentSong = currentSong?.id === song.id;
        const isCurrentlyPlaying = isCurrentSong && isPlaying;

        return (
          <SongCard
            key={song.id}
            song={song}
            onPlayPause={onPlayPause}
            onCardClick={onCardClick}
            onMenuClick={onMenuClick}
            isCurrentSong={isCurrentSong}
            isPlaying={isCurrentlyPlaying}
          />
        );
      })}
    </Box>
  );
});

SongsGrid.displayName = 'SongsGrid';

export default SongsGrid; 