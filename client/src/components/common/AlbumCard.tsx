import React from 'react';
import { Typography, Box, Chip } from '@mui/material';
import { Album as AlbumIcon } from '@mui/icons-material';
import { getAlbumCoverUrl } from '../../utils/albumUtils';
import { formatDuration } from '../../utils/songUtils';
import type { Album, Song } from '../../types';
import { useAudioPlayerContext } from '../../contexts/AudioPlayerContext';
import UniversalCard from './UniversalCard';

interface AlbumCardProps {
  album: Album;
  songs?: Song[];
  onClick?: () => void;
  onOptions?: (event: React.MouseEvent<HTMLElement>, album: Album) => void;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album, songs = [], onClick, onOptions }) => {
  const { play, setQueue, currentSong, isPlaying, pause } = useAudioPlayerContext();
  const albumSongs = songs.filter(song => album.songIds.includes(song.id));
  const totalDuration = albumSongs.reduce((sum, song) => sum + song.duration, 0);

  const handlePlayPause = () => {
    if (albumSongs.length === 0) return;
    
    // Check if the first song of this album is currently playing
    const isCurrentAlbumPlaying = Boolean(currentSong && albumSongs.some(song => song.id === currentSong.id) && isPlaying);
    
    if (isCurrentAlbumPlaying) {
      pause();
    } else {
      setQueue(albumSongs);
      play(albumSongs[0]);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onOptions) {
      onOptions(event, album);
    }
  };

  const isCurrentAlbumPlaying = Boolean(currentSong && albumSongs.some(song => song.id === currentSong.id) && isPlaying);

  return (
    <UniversalCard
      type="album"
      title={album.name}
      subtitle={album.artist}
      coverUrl={getAlbumCoverUrl(album.coverImage)}
      songCount={album.songIds.length}
      isPlaying={isCurrentAlbumPlaying}
      onPlayPause={handlePlayPause}
      onCardClick={onClick}
      onMenuClick={onOptions ? handleMenuClick : undefined}
      sx={{
        minWidth: 280,
        maxWidth: 320,
        height: '100%',
        borderRadius: 4,
        background: 'linear-gradient(135deg, rgba(255,149,0,0.12) 0%, rgba(28,28,30,0.95) 100%)',
        backdropFilter: 'blur(16px)',
        border: '2px solid #ff9500',
        boxShadow: '0 6px 32px 0 rgba(255,149,0,0.10)',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 16px 48px 0 rgba(255,149,0,0.20)',
          border: '2.5px solid #ffb340',
          '& .hover-overlay': {
            opacity: 1,
          },
        },
      }}
      coverOverlay={
        <Box sx={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          bgcolor: 'rgba(255,149,0,0.85)',
          borderRadius: '50%',
          p: 1,
          boxShadow: '0 4px 12px 0 rgba(255,149,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3,
        }}>
          <AlbumIcon sx={{ color: '#fff', fontSize: 28 }} />
        </Box>
      }
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Chip
          label={formatDuration(totalDuration)}
          size="small"
          sx={{
            bgcolor: 'rgba(255,149,0,0.15)',
            color: '#ff9500',
            border: '1px solid rgba(255,149,0,0.3)',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />
        {album.releaseDate && (
          <Chip
            label={album.releaseDate}
            size="small"
            sx={{
              bgcolor: 'rgba(44,44,46,0.8)',
              color: '#8e8e93',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '0.75rem',
            }}
          />
        )}
      </Box>
      
      {album.description && (
        <Typography
          variant="caption"
          sx={{
            color: '#8e8e93',
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: '0.75rem',
            lineHeight: 1.4,
          }}
        >
          {album.description}
        </Typography>
      )}
    </UniversalCard>
  );
};

export default AlbumCard; 