import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Slider,
  Avatar,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
  Popover,
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
  const [volumeAnchorEl, setVolumeAnchorEl] = useState<null | HTMLElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const handleVolumeButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setVolumeAnchorEl(event.currentTarget);
  };
  const handleVolumePopoverClose = () => {
    setVolumeAnchorEl(null);
  };
  const volumePopoverOpen = Boolean(volumeAnchorEl);

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
          borderRadius: { xs: '12px 12px 0 0', sm: '16px 16px 0 0' },
          background: 'rgba(28,28,30,0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderBottom: 'none',
          boxShadow: '0 -4px 24px 0 rgba(0,0,0,0.4)',
          p: { xs: 1.5, sm: 2 },
          px: { xs: 1.5, sm: 4 },
          width: '100vw',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: isMobile ? 0.5 : 1.5,
            width: '100%',
            minWidth: 0,
          }}
        >
          {isMobile ? (
            <>
              {/* Row 1: Info + Queue */}
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', minWidth: 0, mb: 0.5 }}>
                <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 700,
                      color: '#fff',
                      fontSize: '1rem',
                      lineHeight: 1.1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%',
                    }}
                  >
                    {currentSong.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#8e8e93',
                      fontSize: '0.8rem',
                      lineHeight: 1.1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%',
                    }}
                  >
                    {currentSong.artist}
                  </Typography>
                </Box>
                {queue.length > 0 && (
                  <Box sx={{ ml: 1, minWidth: 0, flexShrink: 1 }} onClick={() => setQueueModalOpen(true)}>
                    <Chip
                      icon={<QueueMusic />}
                      label={<span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', maxWidth: 80 }}>{`${queue.length} in queue`}</span>}
                      sx={{
                        bgcolor: 'rgba(10,132,255,0.15)',
                        color: '#0a84ff',
                        border: '1px solid rgba(10,132,255,0.3)',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        '&:hover': { bgcolor: 'rgba(10,132,255,0.25)' },
                        minWidth: 0,
                        maxWidth: 100,
                      }}
                    />
                  </Box>
                )}
              </Box>
              {/* Row 2: Controls + Progress */}
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1, mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.25 }}>
                  <IconButton
                    onClick={previous}
                    sx={{
                      color: '#ffffff',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      borderRadius: 999,
                      width: 28,
                      height: 28,
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
                      width: 32,
                      height: 32,
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
                      width: 28,
                      height: 28,
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                    }}
                  >
                    <SkipNext />
                  </IconButton>
                </Box>
                <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
                  <Typography variant="caption" sx={{ color: '#8e8e93', minWidth: 32, fontSize: '0.7rem' }}>
                    {formatTime(currentTime)}
                  </Typography>
                  <Slider
                    value={currentTime}
                    max={duration}
                    onChange={handleTimeChange}
                    sx={{
                      color: '#0a84ff',
                      flex: 1,
                      mx: 0.5,
                      height: 4,
                      '& .MuiSlider-thumb': {
                        bgcolor: '#0a84ff',
                        boxShadow: '0 2px 8px 0 rgba(10,132,255,0.3)',
                        width: 10,
                        height: 10,
                      },
                      '& .MuiSlider-track': {
                        bgcolor: '#0a84ff',
                        height: 4,
                      },
                      '& .MuiSlider-rail': {
                        bgcolor: 'rgba(255,255,255,0.2)',
                        height: 4,
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#8e8e93', minWidth: 32, fontSize: '0.7rem' }}>
                    {formatTime(duration)}
                  </Typography>
                </Box>
              </Box>
            </>
          ) : (
            <>
              {/* Song Info: Album cover and details */}
              <Avatar
                src={getAlbumCoverUrl(currentSong.albumCover)}
                sx={{
                  width: { xs: 44, sm: 64 },
                  height: { xs: 44, sm: 64 },
                  borderRadius: 2.5,
                  bgcolor: '#2c2c2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  mr: 1.5,
                }}
              >
                <Typography variant="body1" sx={{ color: '#0a84ff', fontWeight: 700, fontSize: '1rem' }}>
                  {currentSong.title.charAt(0).toUpperCase()}
                </Typography>
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1, flexShrink: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 700,
                    color: '#ffffff',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    fontSize: { xs: '0.9rem', sm: '1.1rem' },
                    lineHeight: 1.2,
                    '&:hover': { color: '#0a84ff' },
                    minWidth: 0,
                  }}
                  onClick={() => setModalOpen(true)}
                >
                  {currentSong.title}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#8e8e93',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: { xs: '0.75rem', sm: '0.95rem' },
                    lineHeight: 1.1,
                  }}
                >
                  {currentSong.artist}
                </Typography>
              </Box>
              {/* Queue Preview */}
              {queue.length > 0 && (
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 },
                  minWidth: 0,
                  flexShrink: 1,
                  mr: 1.5,
                }}
                onClick={() => setQueueModalOpen(true)}
                >
                  <Chip
                    icon={<QueueMusic sx={{ fontSize: 24, mr: 0.5 }} />}
                    label={<span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', maxWidth: isMobile ? 100 : 'none', fontSize: '1rem' }}>{`${queue.length} in queue`}</span>}
                    sx={{
                      bgcolor: 'rgba(10,132,255,0.15)',
                      color: '#0a84ff',
                      border: '1px solid rgba(10,132,255,0.3)',
                      fontWeight: 700,
                      fontSize: '1rem',
                      px: 2,
                      py: 1,
                      height: 40,
                      '&:hover': { bgcolor: 'rgba(10,132,255,0.25)' },
                      minWidth: 0,
                      maxWidth: isMobile ? 120 : 'none',
                    }}
                  />
                </Box>
              )}
              {/* Controls */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
                  <SkipPrevious sx={{ fontSize: 32 }} />
                </IconButton>
                <IconButton
                  onClick={handlePlayPause}
                  sx={{
                    color: '#ffffff',
                    bgcolor: '#0a84ff',
                    borderRadius: 999,
                    width: 52,
                    height: 52,
                    boxShadow: '0 2px 8px 0 rgba(10,132,255,0.3)',
                    '&:hover': { bgcolor: '#0070d1' },
                  }}
                >
                  {isPlaying ? <Pause sx={{ fontSize: 36 }} /> : <PlayArrow sx={{ fontSize: 36 }} />}
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
                  <SkipNext sx={{ fontSize: 32 }} />
                </IconButton>
                <IconButton
                  onClick={() => setRepeat(!repeat)}
                  sx={{ color: repeat ? '#0a84ff' : '#8e8e93', width: 36, height: 36 }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 1l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 11v-1a4 4 0 014-4h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 23l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 13v1a4 4 0 01-4 4H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </IconButton>
              </Box>
              {/* Progress */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, maxWidth: 400 }}>
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
                  gap: 0.5,
                  position: 'relative',
                }}
              >
                <IconButton
                  onClick={handleVolumeButtonClick}
                  sx={{
                    color: '#ffffff',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 999,
                    width: 36,
                    height: 36,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                  }}
                >
                  {isMuted ? <VolumeOff /> : <VolumeUp />}
                </IconButton>
                <Popover
                  open={volumePopoverOpen}
                  anchorEl={volumeAnchorEl}
                  onClose={handleVolumePopoverClose}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  PaperProps={{
                    sx: {
                      p: 2,
                      borderRadius: 3,
                      background: 'rgba(28,28,30,0.95)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 4px 24px 0 rgba(0,0,0,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                    },
                  }}
                >
                  <Slider
                    orientation="vertical"
                    value={isMuted ? 0 : volume}
                    max={1}
                    step={0.01}
                    onChange={handleVolumeChange}
                    sx={{
                      color: '#0a84ff',
                      height: 80,
                    }}
                  />
                </Popover>
              </Box>
            </>
          )}
        </Box>
      </Paper>
      <NowPlayingModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <QueueModal open={queueModalOpen} onClose={() => setQueueModalOpen(false)} />
    </>
  );
};

export default AudioPlayer; 