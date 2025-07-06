import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Song } from '../../types';

interface AudioPlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
}

// Load state from localStorage
const loadStateFromStorage = (): Partial<AudioPlayerState> => {
  try {
    const serializedState = localStorage.getItem('audioPlayerState');
    if (serializedState === null) {
      return {};
    }
    const parsedState = JSON.parse(serializedState);
    return {
      currentSong: parsedState.currentSong || null,
      queue: parsedState.queue || [],
      currentIndex: parsedState.currentIndex || -1,
      volume: parsedState.volume || 1,
      isMuted: parsedState.isMuted || false,
      // Don't restore isPlaying, currentTime, and duration on page refresh
      isPlaying: false,
      currentTime: 0,
      duration: 0,
    };
  } catch (err) {
    console.warn('Failed to load audio player state from localStorage:', err);
    return {};
  }
};

// Save state to localStorage
const saveStateToStorage = (state: AudioPlayerState) => {
  try {
    const stateToSave = {
      currentSong: state.currentSong,
      queue: state.queue,
      currentIndex: state.currentIndex,
      volume: state.volume,
      isMuted: state.isMuted,
      // Don't save isPlaying, currentTime, and duration
    };
    localStorage.setItem('audioPlayerState', JSON.stringify(stateToSave));
  } catch (err) {
    console.warn('Failed to save audio player state to localStorage:', err);
  }
};

const initialState: AudioPlayerState = {
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  volume: 1,
  isMuted: false,
  currentTime: 0,
  duration: 0,
  ...loadStateFromStorage(), // Load persisted state
};

const audioPlayerSlice = createSlice({
  name: 'audioPlayer',
  initialState,
  reducers: {
    setCurrentSong: (state, action: PayloadAction<Song | null>) => {
      state.currentSong = action.payload;
      saveStateToStorage(state);
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
      saveStateToStorage(state);
    },
    setQueue: (state, action: PayloadAction<Song[]>) => {
      state.queue = action.payload;
      if (action.payload.length > 0 && state.currentIndex === -1) {
        state.currentIndex = 0;
        state.currentSong = action.payload[0];
      }
      saveStateToStorage(state);
    },
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
      if (state.queue[action.payload]) {
        state.currentSong = state.queue[action.payload];
      }
      saveStateToStorage(state);
    },
    addToQueue: (state, action: PayloadAction<Song>) => {
      state.queue.push(action.payload);
      saveStateToStorage(state);
    },
    removeFromQueue: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.queue.splice(index, 1);
      
      if (index < state.currentIndex) {
        state.currentIndex--;
      } else if (index === state.currentIndex) {
        if (state.queue.length === 0) {
          state.currentSong = null;
          state.isPlaying = false;
          state.currentIndex = -1;
        } else {
          const newIndex = index >= state.queue.length ? state.queue.length - 1 : index;
          state.currentIndex = newIndex;
          state.currentSong = state.queue[newIndex];
        }
      }
      saveStateToStorage(state);
    },
    nextSong: (state) => {
      if (state.queue.length === 0) return;
      const nextIndex = (state.currentIndex + 1) % state.queue.length;
      state.currentIndex = nextIndex;
      state.currentSong = state.queue[nextIndex];
      saveStateToStorage(state);
    },
    previousSong: (state) => {
      if (state.queue.length === 0) return;
      const prevIndex = state.currentIndex === 0 ? state.queue.length - 1 : state.currentIndex - 1;
      state.currentIndex = prevIndex;
      state.currentSong = state.queue[prevIndex];
      saveStateToStorage(state);
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
      state.isMuted = action.payload === 0;
      saveStateToStorage(state);
    },
    setIsMuted: (state, action: PayloadAction<boolean>) => {
      state.isMuted = action.payload;
      saveStateToStorage(state);
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
      // Don't save currentTime to localStorage
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
      // Don't save duration to localStorage
    },
    play: (state, action: PayloadAction<Song>) => {
      const song = action.payload;
      state.currentSong = song;
      state.isPlaying = true;
      
      const songIndex = state.queue.findIndex(s => s.id === song.id);
      if (songIndex === -1) {
        state.queue.push(song);
        state.currentIndex = state.queue.length - 1;
      } else {
        state.currentIndex = songIndex;
      }
      saveStateToStorage(state);
    },
    pause: (state) => {
      state.isPlaying = false;
      saveStateToStorage(state);
    },
    resume: (state) => {
      if (state.currentSong) {
        state.isPlaying = true;
        saveStateToStorage(state);
      }
    },
  },
});

export const {
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
} = audioPlayerSlice.actions;

export default audioPlayerSlice.reducer; 