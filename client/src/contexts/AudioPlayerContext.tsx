import React, { createContext, useContext, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  setCurrentSong,
  setIsPlaying,
  setQueue,
  setCurrentIndex,
  addToQueue,
  removeFromQueue,
  nextSong,
  previousSong,
  setVolume,
  setIsMuted,
  setCurrentTime,
  setDuration,
  play,
  pause,
  resume,
} from '@/store/slices/audioPlayerSlice';
import type { Song } from '@/types';
import type { RefObject } from 'react';

interface AudioPlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  audioRef: RefObject<HTMLAudioElement | null>;
  play: (song: Song) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  setQueue: (songs: Song[]) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  setIsMuted: (muted: boolean) => void;
  setCurrentTime: (t: number) => void;
  setDuration: (d: number) => void;
  repeat: boolean;
  setRepeat: (repeat: boolean) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const {
    currentSong,
    isPlaying,
    queue,
    currentIndex,
    volume,
    isMuted,
    currentTime,
    duration,
  } = useAppSelector(state => state.audioPlayer);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [repeat, setRepeat] = React.useState(false);

  // Actions
  const playSong = (song: Song) => dispatch(play(song));
  const pausePlayer = () => dispatch(pause());
  const resumePlayer = () => dispatch(resume());
  const playNext = () => dispatch(nextSong());
  const playPrevious = () => dispatch(previousSong());
  const setPlayerQueue = (songs: Song[]) => dispatch(setQueue(songs));
  const addSongToQueue = (song: Song) => dispatch(addToQueue(song));
  const removeSongFromQueue = (index: number) => dispatch(removeFromQueue(index));
  const updateVolume = (newVolume: number) => dispatch(setVolume(newVolume));
  const toggleMute = () => dispatch(setIsMuted(!isMuted));
  const setMuted = (muted: boolean) => dispatch(setIsMuted(muted));
  const updateCurrentTime = (time: number) => dispatch(setCurrentTime(time));
  const updateDuration = (newDuration: number) => dispatch(setDuration(newDuration));

  return (
    <AudioPlayerContext.Provider value={{
      // State
      currentSong,
      isPlaying,
      queue,
      currentIndex,
      volume,
      isMuted,
      currentTime,
      duration,
      audioRef,
      // Actions
      play: playSong,
      pause: pausePlayer,
      resume: resumePlayer,
      next: playNext,
      previous: playPrevious,
      setQueue: setPlayerQueue,
      addToQueue: addSongToQueue,
      removeFromQueue: removeSongFromQueue,
      setVolume: updateVolume,
      toggleMute,
      setIsMuted: setMuted,
      setCurrentTime: updateCurrentTime,
      setDuration: updateDuration,
      repeat,
      setRepeat,
    }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayerContext = () => {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayerContext must be used within AudioPlayerProvider');
  return ctx;
}; 