import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import {
  Search,
  Clear,
  FilterList,
} from '@mui/icons-material';

interface SearchFilters {
  query: string;
  artist: string;
  album: string;
  sortBy: 'title' | 'artist' | 'album' | 'duration' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

interface SearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  artists: string[];
  albums: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  filters,
  onFiltersChange,
  artists,
  albums,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, query: event.target.value });
  };

  const handleArtistChange = (event: SelectChangeEvent) => {
    onFiltersChange({ ...filters, artist: event.target.value });
  };

  const handleAlbumChange = (event: SelectChangeEvent) => {
    onFiltersChange({ ...filters, album: event.target.value });
  };

  const handleSortByChange = (event: SelectChangeEvent) => {
    onFiltersChange({ ...filters, sortBy: event.target.value as SearchFilters['sortBy'] });
  };

  const handleSortOrderChange = (event: SelectChangeEvent) => {
    onFiltersChange({ ...filters, sortOrder: event.target.value as 'asc' | 'desc' });
  };

  const clearFilters = () => {
    onFiltersChange({
      query: '',
      artist: '',
      album: '',
      sortBy: 'title',
      sortOrder: 'asc',
    });
  };

  const hasActiveFilters = filters.query || filters.artist || filters.album || filters.sortBy !== 'title' || filters.sortOrder !== 'asc';

  return (
    <Box sx={{ mb: 3 }}>
      {/* Search Bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: showFilters ? 2 : 0 }}>
        <TextField
          fullWidth
          placeholder="Search songs, artists, or albums..."
          value={filters.query}
          onChange={handleQueryChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: filters.query && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => onFiltersChange({ ...filters, query: '' })}
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <IconButton
          onClick={() => setShowFilters(!showFilters)}
          color={showFilters ? 'primary' : 'default'}
        >
          <FilterList />
        </IconButton>
      </Box>

      {/* Filters */}
      {showFilters && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Artist</InputLabel>
            <Select
              value={filters.artist}
              label="Artist"
              onChange={handleArtistChange}
              size="small"
            >
              <MenuItem value="">All Artists</MenuItem>
              {artists.map((artist) => (
                <MenuItem key={artist} value={artist}>
                  {artist}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Album</InputLabel>
            <Select
              value={filters.album}
              label="Album"
              onChange={handleAlbumChange}
              size="small"
            >
              <MenuItem value="">All Albums</MenuItem>
              {albums.map((album) => (
                <MenuItem key={album} value={album}>
                  {album}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy}
              label="Sort By"
              onChange={handleSortByChange}
              size="small"
            >
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="artist">Artist</MenuItem>
              <MenuItem value="album">Album</MenuItem>
              <MenuItem value="duration">Duration</MenuItem>
              <MenuItem value="createdAt">Date Added</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel>Order</InputLabel>
            <Select
              value={filters.sortOrder}
              label="Order"
              onChange={handleSortOrderChange}
              size="small"
            >
              <MenuItem value="asc">A-Z</MenuItem>
              <MenuItem value="desc">Z-A</MenuItem>
            </Select>
          </FormControl>

          {hasActiveFilters && (
            <Chip
              label="Clear Filters"
              onClick={clearFilters}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default SearchBar; 