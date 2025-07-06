import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Slider,
  Avatar,
  Paper,
  Chip,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  VolumeUp,
  VolumeOff,
  QueueMusic,
} from '@mui/icons-material';
import { useAudioPlayerContext } from '@/contexts';
import type { Song } from '@/types';
import { getAlbumCoverUrl } from '@/utils';
import { NowPlayingModal, QueueModal } from '@/components';

const AudioPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    volume,
    isMuted,
    currentTime,
    duration,
    play,
    pause,
    next,
    previous,
    setCurrentTime,
    setDuration,
    setVolume,
    setIsMuted,
    audioRef,
    repeat,
    setRepeat,
    queue,
  } = useAudioPlayerContext();

  const [showVolume, setShowVolume] = useState(false);
  const volumeTimeoutRef = useRef<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [queueModalOpen, setQueueModalOpen] = useState(false);

  // Sync audio element with Redux state
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${currentSong.filePath}`;
      audioRef.current.load();
    }
  }, [currentSong]);

  // Auto-play new song if already playing
  useEffect(() => {
    if (currentSong && isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [currentSong, isPlaying, audioRef]);

  // Control play/pause based on Redux state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Sync volume with Redux state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        next();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [setCurrentTime, setDuration, next, repeat, audioRef]);

  const handleTimeChange = (_: Event, value: number | number[]) => {
    const newTime = value as number;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (_: Event, value: number | number[]) => {
    const newVolume = value as number;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handlePlayPause = () => {
    if (currentSong) {
      if (isPlaying) {
        pause();
      } else {
        play(currentSong);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleVolumeMouseEnter = () => {
    if (volumeTimeoutRef.current) {
      window.clearTimeout(volumeTimeoutRef.current);
    }
    setShowVolume(true);
  };

  const handleVolumeMouseLeave = () => {
    volumeTimeoutRef.current = window.setTimeout(() => {
      setShowVolume(false);
    }, 1000); // 1 second delay
  };

  if (!currentSong) {
    return null;
  }

  return (
    <>
      <audio ref={audioRef} />
      <Paper
        elevation={0}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          borderRadius: '20px 20px 0 0',
          background: 'rgba(28,28,30,0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderBottom: 'none',
          boxShadow: '0 -4px 24px 0 rgba(0,0,0,0.4)',
          p: 3,
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1, sm: 2, md: 3 },
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          {/* Song Info */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 2 }, 
            minWidth: 0, 
            flex: 1,
            width: { xs: '100%', sm: 'auto' }
          }}>
            <Avatar
              src={getAlbumCoverUrl(currentSong.albumCover)}
              sx={{
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
                borderRadius: 3,
                bgcolor: '#2c2c2e',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Typography variant="h6" sx={{ color: '#0a84ff', fontWeight: 700 }}>
                {currentSong.title.charAt(0).toUpperCase()}
              </Typography>
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: '#ffffff',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  '&:hover': { color: '#0a84ff' },
                }}
                onClick={() => setModalOpen(true)}
              >
                {currentSong.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#8e8e93',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {currentSong.artist}
              </Typography>
            </Box>
          </Box>

          {/* Queue Preview */}
          {queue.length > 0 && (
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
            }}
            onClick={() => setQueueModalOpen(true)}
            >
              <Chip
                icon={<QueueMusic />}
                label={`${queue.length} in queue`}
                sx={{
                  bgcolor: 'rgba(10,132,255,0.15)',
                  color: '#0a84ff',
                  border: '1px solid rgba(10,132,255,0.3)',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  '&:hover': {
                    bgcolor: 'rgba(10,132,255,0.25)',
                  },
                }}
              />
            </Box>
          )}

          {/* Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={previous}
              sx={{
                color: '#ffffff',
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: 999,
                width: 40,
                height: 40,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
              }}
            >
              <SkipPrevious />
            </IconButton>
            <IconButton
              onClick={handlePlayPause}
              sx={{
                color: '#ffffff',
                bgcolor: '#0a84ff',
                borderRadius: 999,
                width: 48,
                height: 48,
                boxShadow: '0 2px 8px 0 rgba(10,132,255,0.3)',
                '&:hover': { bgcolor: '#0070d1' },
              }}
            >
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton
              onClick={next}
              sx={{
                color: '#ffffff',
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: 999,
                width: 40,
                height: 40,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
              }}
            >
              <SkipNext />
            </IconButton>
            <IconButton
              onClick={() => setRepeat(!repeat)}
              sx={{ color: repeat ? '#0a84ff' : '#8e8e93' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 1l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 11v-1a4 4 0 014-4h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 23l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 13v1a4 4 0 01-4 4H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </IconButton>
          </Box>

          {/* Progress */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, maxWidth: 400 }}>
            <Typography variant="caption" sx={{ color: '#8e8e93', minWidth: 40 }}>
              {formatTime(currentTime)}
            </Typography>
            <Slider
              value={currentTime}
              max={duration}
              onChange={handleTimeChange}
              sx={{
                color: '#0a84ff',
                '& .MuiSlider-track': {
                  bgcolor: '#0a84ff',
                },
                '& .MuiSlider-rail': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                },
                '& .MuiSlider-thumb': {
                  bgcolor: '#0a84ff',
                  boxShadow: '0 2px 8px 0 rgba(10,132,255,0.3)',
                },
              }}
            />
            <Typography variant="caption" sx={{ color: '#8e8e93', minWidth: 40 }}>
              {formatTime(duration)}
            </Typography>
          </Box>

          {/* Volume */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              position: 'relative',
            }}
            onMouseEnter={handleVolumeMouseEnter}
            onMouseLeave={handleVolumeMouseLeave}
          >
            <IconButton
              onClick={toggleMute}
              sx={{
                color: '#ffffff',
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: 999,
                width: 40,
                height: 40,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
              }}
            >
              {isMuted ? <VolumeOff /> : <VolumeUp />}
            </IconButton>
            {showVolume && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '100%',
                  right: 0,
                  mb: 1,
                  p: 2,
                  borderRadius: 3,
                  background: 'rgba(28,28,30,0.95)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 4px 24px 0 rgba(0,0,0,0.4)',
                }}
              >
                <Slider
                  orientation="vertical"
                  value={isMuted ? 0 : volume}
                  max={1}
                  step={0.01}
                  onChange={handleVolumeChange}
                  sx={{
                    height: 100,
                    color: '#0a84ff',
                    '& .MuiSlider-track': {
                      bgcolor: '#0a84ff',
                    },
                    '& .MuiSlider-rail': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                    },
                    '& .MuiSlider-thumb': {
                      bgcolor: '#0a84ff',
                      boxShadow: '0 2px 8px 0 rgba(10,132,255,0.3)',
                    },
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
      <NowPlayingModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <QueueModal open={queueModalOpen} onClose={() => setQueueModalOpen(false)} />
    </>
  );
};

export default AudioPlayer; 