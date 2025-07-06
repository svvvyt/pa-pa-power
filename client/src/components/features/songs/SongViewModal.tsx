import React from 'react';
import {
  IconButton,
  Typography,
  Box,
  Button,
  Divider,
} from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';
import { getAlbumCoverUrl, formatDuration } from '@/utils';
import type { Song } from '@/types';
import { useAudioPlayerContext } from '@/contexts';
import { UniversalModal, CoverAvatar, MetadataRow, LyricsDisplay } from '@/components';

interface SongViewModalProps {
  open: boolean;
  onClose: () => void;
  song: Song | null;
}

const SongViewModal: React.FC<SongViewModalProps> = ({ open, onClose, song }) => {
  const { play, pause, resume, currentSong, isPlaying } = useAudioPlayerContext();

  if (!song) return null;

  const isCurrent = currentSong?.id === song.id;

  const handlePlayPause = () => {
    if (isCurrent) {
      if (isPlaying) pause();
      else resume();
    } else {
      play(song);
    }
  };

  return (
    <UniversalModal open={open} onClose={onClose} title="Song Details">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 3 }}>
        <CoverAvatar
          src={getAlbumCoverUrl(song.albumCover)}
          alt={song.title}
          size={120}
          variant="square"
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, textAlign: 'center' }}>
            {song.title}
          </Typography>
          <IconButton onClick={handlePlayPause} sx={{ color: '#0a84ff', ml: 1 }}>
            {isCurrent && isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
        </Box>
        <Typography variant="subtitle1" sx={{ color: '#8e8e93', textAlign: 'center', mb: 0.5 }}>
          {song.artist} &mdash; {song.album}
        </Typography>
        <Typography variant="body2" sx={{ color: '#8e8e93', textAlign: 'center' }}>
          Duration: {formatDuration(song.duration)}
          {song.releaseDate ? ` • Released: ${song.releaseDate}` : ''}
        </Typography>
      </Box>
      <Divider sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.08)' }} />
      <Box sx={{ mb: 2 }}>
        <LyricsDisplay lyrics={song.lyrics} maxHeight={180} />
      </Box>
      <Divider sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.08)' }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <MetadataRow label="Album" value={song.album} />
        <MetadataRow label="Artist" value={song.artist} />
        {song.releaseDate && <MetadataRow label="Release Date" value={song.releaseDate} />}
        {song.albumDescription && <MetadataRow label="Album Description" value={song.albumDescription} />}
      </Box>
    </UniversalModal>
  );
};

export default SongViewModal; 