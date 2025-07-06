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
import { getPlaylistCoverUrl } from '@/utils';
import { getAlbumCoverUrl, formatDuration } from '@/utils';
import type { Playlist, Song } from '@/types';
import { useAudioPlayerContext } from '@/contexts';
import { UniversalModal, SongListItem, CoverAvatar, MetadataRow } from '@/components';

interface PlaylistViewModalProps {
  open: boolean;
  onClose: () => void;
  playlist: Playlist | null;
  songs: Song[];
}

const PlaylistViewModal: React.FC<PlaylistViewModalProps> = ({ open, onClose, playlist, songs }) => {
  const { play, setQueue, currentSong, isPlaying, pause, resume } = useAudioPlayerContext();

  if (!playlist) return null;

  // Get songs in playlist order
  const playlistSongs = playlist.songIds
    .map(id => songs.find(song => song.id === id))
    .filter(Boolean) as Song[];

  const totalDuration = playlistSongs.reduce((sum, song) => sum + song.duration, 0);

  // Get the cover image from the first song in the playlist
  const firstSong = playlistSongs[0];
  const coverUrl = firstSong ? getAlbumCoverUrl(firstSong.albumCover) : getPlaylistCoverUrl(playlist.coverImage);

  const handleSongClick = (song: Song) => {
    setQueue(playlistSongs);
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
    <UniversalModal open={open} onClose={onClose} title="Playlist Details">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 3 }}>
        <CoverAvatar
          src={coverUrl}
          alt={playlist.name}
          size={120}
          variant="square"
        />
        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, textAlign: 'center', mb: 0.5 }}>
          {playlist.name}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#8e8e93', textAlign: 'center', mb: 0.5 }}>
          {playlist.description || 'No description'}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
          <MetadataRow label="Songs" value={playlist.songIds.length} />
          <MetadataRow label="Total Duration" value={formatDuration(totalDuration)} />
        </Box>
      </Box>
      <Divider sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.08)' }} />
      <List sx={{ maxHeight: 320, overflowY: 'auto', bgcolor: 'transparent' }}>
        {playlistSongs.length === 0 ? (
          <Typography sx={{ color: '#8e8e93', textAlign: 'center', mt: 2 }}>
            No songs in this playlist.
          </Typography>
        ) : (
          playlistSongs.map((song) => (
            <SongListItem
              key={song.id}
              song={song}
              onClick={handleSongClick}
            />
          ))
        )}
      </List>
    </UniversalModal>
  );
};

export default PlaylistViewModal; 