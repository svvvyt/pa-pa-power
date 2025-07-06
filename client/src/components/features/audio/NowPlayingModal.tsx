import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Slider,
  Button,
} from '@mui/material';
import { PlayArrow, Pause, SkipPrevious, SkipNext, VolumeUp, VolumeOff } from '@mui/icons-material';
import { useAudioPlayerContext } from '@/contexts';
import { getAlbumCoverUrl } from '@/utils';
import { CoverAvatar, MetadataRow, UniversalModal, LyricsDisplay } from '@/components';

interface NowPlayingModalProps {
  open: boolean;
  onClose: () => void;
}

const NowPlayingModal: React.FC<NowPlayingModalProps> = ({ open, onClose }) => {
  const { currentSong, isPlaying, play, pause, resume, next, previous, queue, currentIndex, audioRef, repeat, setRepeat } = useAudioPlayerContext();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolume] = useState(1);
  const volumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!audioRef?.current) return;

    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
    };
  }, [audioRef]);

  useEffect(() => {
    if (audioRef?.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, audioRef]);

  const handleSeek = (event: Event, newValue: number | number[]) => {
    if (audioRef?.current) {
      audioRef.current.currentTime = newValue as number;
      setCurrentTime(newValue as number);
    }
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const newVolume = newValue as number;
    setVolume(newVolume);
    
    // Show volume slider for 2 seconds
    setShowVolume(true);
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current);
    }
    volumeTimeoutRef.current = setTimeout(() => setShowVolume(false), 2000);
  };

  const toggleMute = () => {
    setVolume(volume > 0 ? 0 : 1);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentSong) return null;

  return (
    <UniversalModal open={open} onClose={onClose} title="Now Playing">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <CoverAvatar
          src={getAlbumCoverUrl(currentSong.albumCover)}
          alt={currentSong.title}
          size={120}
          variant="square"
        />
        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, textAlign: 'center', mb: 0.5 }}>
          {currentSong.title}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#8e8e93', textAlign: 'center', mb: 0.5 }}>
          {currentSong.artist} &mdash; {currentSong.album}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
          <MetadataRow label="Album" value={currentSong.album} />
          <MetadataRow label="Artist" value={currentSong.artist} />
        </Box>
        {/* Playback Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', justifyContent: 'center', mb: 2 }}>
          <IconButton 
            onClick={previous}
            disabled={currentIndex <= 0}
            sx={{ color: currentIndex <= 0 ? '#8e8e93' : '#0a84ff' }}
          >
            <SkipPrevious />
          </IconButton>
          <IconButton 
            onClick={() => isPlaying ? pause() : resume()}
            sx={{ 
              color: '#0a84ff',
              bgcolor: 'rgba(10,132,255,0.1)',
              '&:hover': { bgcolor: 'rgba(10,132,255,0.2)' }
            }}
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton 
            onClick={next}
            disabled={currentIndex >= queue.length - 1}
            sx={{ color: currentIndex >= queue.length - 1 ? '#8e8e93' : '#0a84ff' }}
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

        {/* Progress Bar */}
        <Box sx={{ width: '100%', mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" sx={{ color: '#8e8e93' }}>
              {formatTime(currentTime)}
            </Typography>
            <Typography variant="caption" sx={{ color: '#8e8e93' }}>
              {formatTime(duration)}
            </Typography>
          </Box>
          <Slider
            value={currentTime}
            max={duration}
            onChange={handleSeek}
            sx={{
              color: '#0a84ff',
              '& .MuiSlider-track': {
                bgcolor: '#0a84ff',
              },
              '& .MuiSlider-thumb': {
                bgcolor: '#0a84ff',
                '&:hover': {
                  boxShadow: '0 0 0 8px rgba(10,132,255,0.2)',
                },
              },
            }}
          />
        </Box>

        {/* Volume Control */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 2 }}>
          <IconButton onClick={toggleMute} sx={{ color: '#0a84ff' }}>
            {volume > 0 ? <VolumeUp /> : <VolumeOff />}
          </IconButton>
          <Box sx={{ maxWidth: 150, width: '100%' }}>
            <Slider
              value={volume}
              max={1}
              step={0.01}
              onChange={handleVolumeChange}
              size="small"
              sx={{
                color: '#0a84ff',
                height: 4,
                '& .MuiSlider-track': {
                  bgcolor: '#0a84ff',
                  height: 4,
                },
                '& .MuiSlider-rail': {
                  height: 4,
                },
                '& .MuiSlider-thumb': {
                  bgcolor: '#0a84ff',
                  width: 16,
                  height: 16,
                  '&:hover': {
                    boxShadow: '0 0 0 8px rgba(10,132,255,0.2)',
                  },
                },
              }}
            />
          </Box>
        </Box>

        {/* Lyrics */}
        {currentSong.lyrics && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LyricsDisplay lyrics={currentSong.lyrics} maxHeight={200} />
          </Box>
        )}
      </Box>
    </UniversalModal>
  );
};

export default NowPlayingModal; 