import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  IconButton,
  Collapse,
  Divider,
} from '@mui/material';
import {
  QueueMusic,
  ExpandMore,
  ExpandLess,
  Clear,
} from '@mui/icons-material';
import { useAudioPlayerContext } from '../../contexts/AudioPlayerContext';
import SongListItem from './SongListItem';
import StyledButton from './StyledButton';

interface QueueDisplayProps {
  maxHeight?: number;
  showClearButton?: boolean;
}

const QueueDisplay: React.FC<QueueDisplayProps> = ({
  maxHeight = 400,
  showClearButton = true,
}) => {
  const { queue, currentSong, setQueue } = useAudioPlayerContext();
  const [expanded, setExpanded] = React.useState(true);

  const handleClearQueue = () => {
    setQueue([]);
  };

  const handleSongClick = (song: any) => {
    // Optional: Add song view modal or other actions
    console.log('Song clicked:', song);
  };

  const handleRightActions = (song: any) => {
    // Optional: Add song-specific actions (remove from queue, etc.)
    return (
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          // Remove song from queue logic here
          console.log('Remove from queue:', song);
        }}
        sx={{
          color: '#8e8e93',
          '&:hover': { color: '#ff453a' },
        }}
      >
        <Clear fontSize="small" />
      </IconButton>
    );
  };

  if (!queue || queue.length === 0) {
    return (
      <Paper
        sx={{
          p: 2,
          background: 'rgba(28,28,30,0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <QueueMusic sx={{ color: '#8e8e93' }} />
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
            Queue
          </Typography>
        </Box>
        <Typography sx={{ color: '#8e8e93', fontStyle: 'italic' }}>
          No songs in queue
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        background: 'rgba(28,28,30,0.8)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <QueueMusic sx={{ color: '#0a84ff' }} />
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
            Queue ({queue.length})
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {showClearButton && (
            <StyledButton
              variant="secondary"
              size="small"
              onClick={handleClearQueue}
              sx={{ minWidth: 'auto', px: 1.5 }}
            >
              Clear
            </StyledButton>
          )}
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{ color: '#8e8e93' }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>

      {/* Queue List */}
      <Collapse in={expanded}>
        <Box sx={{ maxHeight, overflow: 'auto' }}>
          <List sx={{ p: 0 }}>
            {queue.map((song, index) => (
              <React.Fragment key={`${song.id}-${index}`}>
                <SongListItem
                  song={song}
                  onClick={handleSongClick}
                  rightActions={handleRightActions(song)}
                />
                {index < queue.length - 1 && (
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default QueueDisplay; 