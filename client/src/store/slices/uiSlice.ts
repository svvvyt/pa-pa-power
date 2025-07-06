import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  uploadModalOpen: boolean;
  playlistModalOpen: boolean;
  searchFilters: {
    query: string;
    artist: string;
    album: string;
    sortBy: 'title' | 'artist' | 'album' | 'duration' | 'createdAt';
    sortOrder: 'asc' | 'desc';
  };
  theme: 'light' | 'dark';
}

const initialState: UIState = {
  sidebarOpen: false,
  uploadModalOpen: false,
  playlistModalOpen: false,
  searchFilters: {
    query: '',
    artist: '',
    album: '',
    sortBy: 'title',
    sortOrder: 'asc',
  },
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setUploadModalOpen: (state, action: PayloadAction<boolean>) => {
      state.uploadModalOpen = action.payload;
    },
    setPlaylistModalOpen: (state, action: PayloadAction<boolean>) => {
      state.playlistModalOpen = action.payload;
    },
    setSearchFilters: (state, action: PayloadAction<Partial<UIState['searchFilters']>>) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },
    clearSearchFilters: (state) => {
      state.searchFilters = {
        query: '',
        artist: '',
        album: '',
        sortBy: 'title',
        sortOrder: 'asc',
      };
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const {
  setSidebarOpen,
  setUploadModalOpen,
  setPlaylistModalOpen,
  setSearchFilters,
  clearSearchFilters,
  setTheme,
  toggleTheme,
} = uiSlice.actions;

export default uiSlice.reducer; 