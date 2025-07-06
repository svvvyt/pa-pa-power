import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  setSidebarOpen,
  setUploadModalOpen,
  setPlaylistModalOpen,
  setSearchFilters,
  clearSearchFilters,
  setTheme,
  toggleTheme,
} from '../store/slices/uiSlice';

export const useUI = () => {
  const dispatch = useAppDispatch();
  const {
    sidebarOpen,
    uploadModalOpen,
    playlistModalOpen,
    searchFilters,
    theme,
  } = useAppSelector(state => state.ui);

  const openSidebar = () => dispatch(setSidebarOpen(true));
  const closeSidebar = () => dispatch(setSidebarOpen(false));
  const toggleSidebar = () => dispatch(setSidebarOpen(!sidebarOpen));

  const openUploadModal = () => dispatch(setUploadModalOpen(true));
  const closeUploadModal = () => dispatch(setUploadModalOpen(false));

  const openPlaylistModal = () => dispatch(setPlaylistModalOpen(true));
  const closePlaylistModal = () => dispatch(setPlaylistModalOpen(false));

  const updateSearchFilters = (filters: Partial<typeof searchFilters>) => {
    dispatch(setSearchFilters(filters));
  };

  const clearFilters = () => {
    dispatch(clearSearchFilters());
  };

  const changeTheme = (newTheme: 'light' | 'dark') => {
    dispatch(setTheme(newTheme));
  };

  const switchTheme = () => {
    dispatch(toggleTheme());
  };

  return {
    // State
    sidebarOpen,
    uploadModalOpen,
    playlistModalOpen,
    searchFilters,
    theme,
    
    // Actions
    openSidebar,
    closeSidebar,
    toggleSidebar,
    openUploadModal,
    closeUploadModal,
    openPlaylistModal,
    closePlaylistModal,
    updateSearchFilters,
    clearFilters,
    changeTheme,
    switchTheme,
  };
}; 