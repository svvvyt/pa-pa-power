import React from 'react';
import { Typography, Box, Chip } from '@mui/material';
import { PlaylistPlay } from '@mui/icons-material';
import { getPlaylistCoverUrl, getAlbumCoverUrl } from '@/utils';
import type { Playlist, Song } from '@/types';
import { useAudioPlayerContext } from '@/contexts';
import { UniversalCard } from '@/components';

interface PlaylistCardProps {
  playlist: Playlist;
  songs?: Song[];
  onClick?: (playlist: Playlist) => void;
  onOptions?: (e: React.MouseEvent<HTMLElement>, playlist: Playlist) => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, songs = [], onClick, onOptions }) => {
  const { play, pause, setQueue, currentSong, isPlaying } = useAudioPlayerContext();
  const playlistSongs = songs.filter(song => playlist.songIds.includes(song.id));
  const isCurrentPlaylistPlaying = Boolean(currentSong && playlistSongs.some(song => song.id === currentSong.id) && isPlaying);
  
  // Get the cover image from the first song in the playlist
  const firstSong = playlistSongs[0];
  const coverUrl = firstSong ? getAlbumCoverUrl(firstSong.albumCover) : getPlaylistCoverUrl(playlist.coverImage);

  const handlePlayPause = () => {
    if (playlistSongs.length === 0) return;
    if (isCurrentPlaylistPlaying) {
      pause();
    } else {
      setQueue(playlistSongs);
      play(playlistSongs[0]);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onOptions) {
      onOptions(event, playlist);
    }
  };

  return (
    <UniversalCard
      type="playlist"
      title={playlist.name}
      subtitle={playlist.description}
      coverUrl={coverUrl}
      songCount={playlist.songIds.length}
      isPlaying={isCurrentPlaylistPlaying}
      onPlayPause={handlePlayPause}
      onCardClick={onClick ? () => onClick(playlist) : undefined}
      onMenuClick={onOptions ? handleMenuClick : undefined}
      sx={{
        minWidth: 280,
        maxWidth: 320,
        height: '100%',
        borderRadius: 4,
        background: 'linear-gradient(135deg, rgba(10,132,255,0.12) 0%, rgba(28,28,30,0.95) 100%)',
        backdropFilter: 'blur(16px)',
        border: '2px solid #0a84ff',
        boxShadow: '0 6px 32px 0 rgba(10,132,255,0.10)',
        '&:hover': {
          transform: 'translateY(-6px) scale(1.03)',
          boxShadow: '0 12px 40px 0 rgba(10,132,255,0.18)',
          border: '2.5px solid #2997ff',
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
          bgcolor: 'rgba(10,132,255,0.85)',
          borderRadius: '50%',
          p: 1,
          boxShadow: '0 4px 12px 0 rgba(10,132,255,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3,
        }}>
          <PlaylistPlay sx={{ color: '#fff', fontSize: 28 }} />
        </Box>
      }
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Chip
          label={`${playlist.songIds.length} song${playlist.songIds.length !== 1 ? 's' : ''}`}
          size="small"
          sx={{
            bgcolor: 'rgba(10,132,255,0.15)',
            color: '#0a84ff',
            border: '1px solid rgba(10,132,255,0.3)',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />
        {/* Optionally, you could add a creator or other info here */}
      </Box>
      {playlist.description && (
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
          {playlist.description}
        </Typography>
      )}
    </UniversalCard>
  );
};

export default PlaylistCard; 