import { useState, useMemo, useCallback } from 'react';
import type { Song } from '../types';

export interface FilterOptions {
  searchTerm: string;
  selectedGenre: string;
  selectedArtist: string;
  sortBy: 'title' | 'artist' | 'album' | 'duration' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

export function useSongsFilter(songs: Song[]) {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    selectedGenre: 'all',
    selectedArtist: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Extract unique genres and artists for filter options
  const filterOptions = useMemo(() => {
    const genres = ['all', ...Array.from(new Set(songs.map(song => song.album)))];
    const artists = ['all', ...Array.from(new Set(songs.map(song => song.artist)))];
    
    return { genres, artists };
  }, [songs]);

  // Filter and sort songs
  const filteredSongs = useMemo(() => {
    let filtered = songs.filter(song => {
      const matchesSearch = 
        song.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        song.album.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesGenre = filters.selectedGenre === 'all' || song.album === filters.selectedGenre;
      const matchesArtist = filters.selectedArtist === 'all' || song.artist === filters.selectedArtist;
      
      return matchesSearch && matchesGenre && matchesArtist;
    });

    // Sort songs
    filtered.sort((a, b) => {
      let aValue: any = a[filters.sortBy];
      let bValue: any = b[filters.sortBy];

      // Handle string comparison
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [songs, filters]);

  // Update search term
  const setSearchTerm = useCallback((searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  }, []);

  // Update selected genre
  const setSelectedGenre = useCallback((selectedGenre: string) => {
    setFilters(prev => ({ ...prev, selectedGenre }));
  }, []);

  // Update selected artist
  const setSelectedArtist = useCallback((selectedArtist: string) => {
    setFilters(prev => ({ ...prev, selectedArtist }));
  }, []);

  // Update sort options
  const setSortBy = useCallback((sortBy: FilterOptions['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
  }, []);

  const setSortOrder = useCallback((sortOrder: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortOrder }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      selectedGenre: 'all',
      selectedArtist: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return filters.searchTerm !== '' || 
           filters.selectedGenre !== 'all' || 
           filters.selectedArtist !== 'all';
  }, [filters]);

  return {
    // State
    filters,
    filteredSongs,
    filterOptions,
    hasActiveFilters,
    
    // Actions
    setSearchTerm,
    setSelectedGenre,
    setSelectedArtist,
    setSortBy,
    setSortOrder,
    resetFilters,
  };
} 