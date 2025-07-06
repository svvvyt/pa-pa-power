import React from 'react';
import { Typography, Box } from '@mui/material';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import { getAlbumCoverUrl } from '@/utils';
import type { Song } from '@/types';
import { UniversalCard } from '@/components';

interface SongCardProps {
  song: Song;
  onPlayPause: (song: Song) => void;
  onCardClick: (song: Song) => void;
  onMenuClick: (e: React.MouseEvent<HTMLButtonElement>, song: Song) => void;
  isCurrentSong: boolean;
  isPlaying: boolean;
}

const SongCard: React.FC<SongCardProps> = ({
  song,
  onPlayPause,
  onCardClick,
  onMenuClick,
  isCurrentSong,
  isPlaying,
}) => {
  return (
    <UniversalCard
      type="song"
      title={song.title}
      subtitle={song.artist}
      coverUrl={getAlbumCoverUrl(song.albumCover)}
      duration={song.duration}
      isPlaying={isCurrentSong && isPlaying}
      onPlayPause={() => onPlayPause(song)}
      onCardClick={() => onCardClick(song)}
      onMenuClick={e => onMenuClick(e, song)}
      sx={{
        height: '100%',
        borderRadius: 3,
        background: isCurrentSong
          ? 'linear-gradient(135deg, rgba(10,132,255,0.12) 0%, rgba(28,28,30,0.9) 100%)'
          : 'rgba(28,28,30,0.8)',
        backdropFilter: 'blur(12px)',
        border: isCurrentSong
          ? '2px solid #0a84ff'
          : '1px solid rgba(255,255,255,0.1)',
        boxShadow: isCurrentSong
          ? '0 0 16px 4px rgba(10,132,255,0.5), 0 4px 24px 0 rgba(0,0,0,0.4)'
          : '0 4px 24px 0 rgba(0,0,0,0.4)',
        transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
        position: 'relative',
        overflow: 'hidden',
        transform: isCurrentSong ? 'scale(1.04)' : 'none',
        animation: isCurrentSong ? 'songCardPulse 1.5s infinite alternate' : 'none',
        '&:hover': {
          transform: isCurrentSong ? 'scale(1.07)' : 'translateY(-4px)',
          boxShadow: isCurrentSong
            ? '0 0 24px 8px rgba(10,132,255,0.7), 0 8px 32px 0 rgba(0,0,0,0.5)'
            : '0 8px 32px 0 rgba(0,0,0,0.5)',
          border: isCurrentSong
            ? '2px solid #0a84ff'
            : '1px solid rgba(10,132,255,0.3)',
        },
        '@keyframes songCardPulse': {
          from: { boxShadow: '0 0 16px 4px rgba(10,132,255,0.5), 0 4px 24px 0 rgba(0,0,0,0.4)' },
          to: { boxShadow: '0 0 32px 12px rgba(10,132,255,0.7), 0 8px 32px 0 rgba(0,0,0,0.5)' },
        },
      }}
      coverOverlay={
        <Box sx={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          bgcolor: 'rgba(10,132,255,0.85)',
          borderRadius: '50%',
          p: 1,
          boxShadow: '0 4px 12px 0 rgba(10,132,255,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3,
        }}>
          <GraphicEqIcon sx={{ color: '#fff', fontSize: 28 }} />
        </Box>
      }
    >
      <Typography variant="caption" sx={{ color: '#8e8e93', display: 'block', mb: 1 }}>
        {song.album}
      </Typography>
    </UniversalCard>
  );
};

export default SongCard; 