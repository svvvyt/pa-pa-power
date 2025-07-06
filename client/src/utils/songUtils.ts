import type { Song } from '../types';

export const getAlbumCoverUrl = (albumCover?: string): string => {
  if (!albumCover) {
    return '/default-album-cover.jpg';
  }
  
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  return `${baseUrl}${albumCover}`;
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const filterAndSortSongs = (songs: Song[], filters: any) => {
  let filtered = songs.filter(song => {
    const matchesQuery = !filters.query || 
      song.title.toLowerCase().includes(filters.query.toLowerCase()) ||
      song.artist.toLowerCase().includes(filters.query.toLowerCase()) ||
      song.album.toLowerCase().includes(filters.query.toLowerCase());
    
    const matchesArtist = !filters.artist || song.artist === filters.artist;
    const matchesAlbum = !filters.album || song.album === filters.album;
    
    return matchesQuery && matchesArtist && matchesAlbum;
  });

  // Sort
  filtered.sort((a, b) => {
    const aValue = a[filters.sortBy as keyof Song];
    const bValue = b[filters.sortBy as keyof Song];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return filters.sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  return filtered;
};

export const extractUniqueArtists = (songs: Song[]): string[] => {
  const artists = new Set(songs.map(song => song.artist));
  return Array.from(artists).sort();
};

export const extractUniqueAlbums = (songs: Song[]): string[] => {
  const albums = new Set(songs.map(song => song.album));
  return Array.from(albums).sort();
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}; 