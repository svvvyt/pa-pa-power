import React from 'react';
import {
  IconButton,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';
import { getAlbumCoverUrl } from '../../utils/albumUtils';
import { formatDuration } from '../../utils/songUtils';
import type { Album, Song } from '../../types';
import { useAudioPlayerContext } from '../../contexts/AudioPlayerContext';
import UniversalModal from '../common/UniversalModal';
import SongListItem from '../common/SongListItem';
import CoverAvatar from '../common/CoverAvatar';
import MetadataRow from '../common/MetadataRow';

interface AlbumViewModalProps {
  open: boolean;
  onClose: () => void;
  album: Album | null;
  songs: Song[];
}

const AlbumViewModal: React.FC<AlbumViewModalProps> = ({ open, onClose, album, songs }) => {
  const { play, setQueue, currentSong, isPlaying, pause, resume } = useAudioPlayerContext();

  if (!album) return null;

  // Get songs in album order
  const albumSongs = album.songIds
    .map(id => songs.find(song => song.id === id))
    .filter(Boolean) as Song[];

  const totalDuration = albumSongs.reduce((sum, song) => sum + song.duration, 0);

  const handleSongClick = (song: Song) => {
    setQueue(albumSongs);
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      play(song);
    }
  };

  return (
    <UniversalModal open={open} onClose={onClose} title="Album Details">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 3 }}>
        <CoverAvatar
          src={getAlbumCoverUrl(album.coverImage)}
          alt={album.name}
          size={120}
          variant="square"
        />
        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, textAlign: 'center', mb: 0.5 }}>
          {album.name}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#8e8e93', textAlign: 'center', mb: 0.5 }}>
          {album.artist}
        </Typography>
        <Typography variant="body2" sx={{ color: '#8e8e93', textAlign: 'center', mb: 0.5 }}>
          {album.description || 'No description'}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
          <MetadataRow label="Songs" value={album.songIds.length} />
          <MetadataRow label="Total Duration" value={formatDuration(totalDuration)} />
          {album.releaseDate && (
            <MetadataRow label="Release Date" value={album.releaseDate} />
          )}
        </Box>
      </Box>
      <Divider sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.08)' }} />
      <List sx={{ maxHeight: 320, overflowY: 'auto', bgcolor: 'transparent' }}>
        {albumSongs.length === 0 ? (
          <Typography sx={{ color: '#8e8e93', textAlign: 'center', mt: 2 }}>
            No songs in this album.
          </Typography>
        ) : (
          albumSongs.map((song) => (
            <SongListItem
              key={song.id}
              song={song}
              isCurrent={currentSong?.id === song.id}
              isPlaying={isPlaying}
              onPlayPause={handleSongClick}
              onClick={handleSongClick}
            />
          ))
        )}
      </List>
    </UniversalModal>
  );
};

export default AlbumViewModal; 