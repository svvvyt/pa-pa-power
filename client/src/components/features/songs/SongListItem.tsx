import React from 'react';
import { ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction, Avatar, Typography, Box, IconButton } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';
import { getAlbumCoverUrl, formatDuration } from '@/utils';
import type { Song } from '@/types';
import { useAudioPlayerContext } from '@/contexts';

interface SongListItemProps {
  song: Song;
  onClick?: (song: Song) => void;
  rightActions?: React.ReactNode;
}

const SongListItem: React.FC<SongListItemProps> = ({ song, onClick, rightActions }) => {
  const { play, pause, resume, setQueue, currentSong, isPlaying, queue } = useAudioPlayerContext();
  const isCurrent = currentSong?.id === song.id;

  const handlePlayClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (isCurrent && isPlaying) {
      pause();
    } else {
      setQueue([song, ...queue.filter(s => s.id !== song.id)]);
      play(song);
    }
  };

  return (
    <ListItem
      onClick={onClick ? () => onClick(song) : undefined}
      sx={{
        borderRadius: 2,
        mb: 1,
        bgcolor: isCurrent ? 'rgba(10,132,255,0.12)' : 'transparent',
        transition: 'background 0.2s',
        '&:hover': { bgcolor: 'rgba(10,132,255,0.18)' },
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <ListItemAvatar sx={{ position: 'relative' }}>
        <Avatar
          src={getAlbumCoverUrl(song.albumCover)}
          variant="square"
          sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: '#18181a', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <Typography variant="h6" sx={{ color: '#0a84ff', fontWeight: 700 }}>
            {song.title.charAt(0).toUpperCase()}
          </Typography>
        </Avatar>
        {/* Hover overlay play button */}
        <Box className="song-overlay" sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10,132,255,0.10)',
          borderRadius: 2,
          opacity: 0,
          transition: 'opacity 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          pointerEvents: 'none',
          '&:hover': { opacity: 1, pointerEvents: 'auto' },
          '.MuiListItem-root:hover &': { opacity: 1, pointerEvents: 'auto' },
        }}>
          <IconButton
            size="large"
            onClick={handlePlayClick}
            sx={{
              bgcolor: 'rgba(10,132,255,0.9)',
              color: '#fff',
              boxShadow: '0 4px 16px 0 rgba(10,132,255,0.4)',
              '&:hover': {
                bgcolor: '#0a84ff',
                transform: 'scale(1.1)',
              },
            }}
          >
            {isCurrent && isPlaying ? <Pause sx={{ fontSize: 24 }} /> : <PlayArrow sx={{ fontSize: 24 }} />}
          </IconButton>
        </Box>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {song.title}
          </Typography>
        }
        secondary={
          <Typography sx={{ color: '#8e8e93', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {song.artist}
          </Typography>
        }
        sx={{ pr: 2 }}
      />
      <ListItemSecondaryAction>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ color: '#8e8e93', fontSize: 14, minWidth: 48, textAlign: 'right' }}>
            {formatDuration(song.duration)}
          </Typography>
          {rightActions}
        </Box>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default SongListItem; 