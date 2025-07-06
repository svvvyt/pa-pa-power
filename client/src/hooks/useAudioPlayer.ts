import { useAppSelector, useAppDispatch } from '../store/hooks';
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
} from '../store/slices/audioPlayerSlice';
import type { Song } from '../types';
import { useRef } from 'react';

export const useAudioPlayer = () => {
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

  // Shared audio element ref
  const audioRef = useRef<HTMLAudioElement>(null);

  const playSong = (song: Song) => {
    dispatch(play(song));
  };

  const pausePlayer = () => {
    dispatch(pause());
  };

  const resumePlayer = () => {
    dispatch(resume());
  };

  const playNext = () => {
    dispatch(nextSong());
  };

  const playPrevious = () => {
    dispatch(previousSong());
  };

  const setPlayerQueue = (songs: Song[]) => {
    dispatch(setQueue(songs));
  };

  const addSongToQueue = (song: Song) => {
    dispatch(addToQueue(song));
  };

  const removeSongFromQueue = (index: number) => {
    dispatch(removeFromQueue(index));
  };

  const updateVolume = (newVolume: number) => {
    dispatch(setVolume(newVolume));
  };

  const toggleMute = () => {
    dispatch(setIsMuted(!isMuted));
  };

  const setMuted = (muted: boolean) => {
    dispatch(setIsMuted(muted));
  };

  const updateCurrentTime = (time: number) => {
    dispatch(setCurrentTime(time));
  };

  const updateDuration = (newDuration: number) => {
    dispatch(setDuration(newDuration));
  };

  return {
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
  };
}; 