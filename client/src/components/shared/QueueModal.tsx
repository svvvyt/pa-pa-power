import React from 'react';
import {
  Box,
  Typography,
  List,
  Divider,
  IconButton,
} from '@mui/material';
import {
  QueueMusic,
  Clear,
} from '@mui/icons-material';
import { useAudioPlayerContext } from '@/contexts';
import { SongListItem, StyledButton, UniversalModal } from '@/components';

interface QueueModalProps {
  open: boolean;
  onClose: () => void;
}

const QueueModal: React.FC<QueueModalProps> = ({ open, onClose }) => {
  const { queue, currentSong, setQueue, removeFromQueue } = useAudioPlayerContext();

  const handleClearQueue = () => {
    setQueue([]);
  };

  const handleSongClick = (song: any) => {
    // Optional: Add song view modal or other actions
    console.log('Song clicked:', song);
  };

  const handleRemoveFromQueue = (index: number) => {
    removeFromQueue(index);
  };

  const handleRightActions = (song: any, index: number) => {
    return (
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          handleRemoveFromQueue(index);
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

  return (
    <UniversalModal
      open={open}
      onClose={onClose}
      title="Queue"
      maxWidth="md"
      fullWidth
    >
      <Box sx={{ p: 2 }}>
        {!queue || queue.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <QueueMusic sx={{ fontSize: 64, color: '#8e8e93', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
              No songs in queue
            </Typography>
            <Typography sx={{ color: '#8e8e93' }}>
              Add songs to your queue to see them here
            </Typography>
          </Box>
        ) : (
          <>
            {/* Header with queue info and clear button */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 2,
              pb: 2,
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <QueueMusic sx={{ color: '#0a84ff' }} />
                <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                  Queue ({queue.length} songs)
                </Typography>
              </Box>
              <StyledButton
                variant="secondary"
                startIcon={<Clear />}
                onClick={handleClearQueue}
              >
                Clear Queue
              </StyledButton>
            </Box>

            {/* Queue List */}
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              <List sx={{ p: 0 }}>
                {queue.map((song, index) => (
                  <React.Fragment key={`${song.id}-${index}`}>
                    <SongListItem
                      song={song}
                      onClick={handleSongClick}
                      rightActions={handleRightActions(song, index)}
                    />
                    {index < queue.length - 1 && (
                      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          </>
        )}
      </Box>
    </UniversalModal>
  );
};

export default QueueModal; 