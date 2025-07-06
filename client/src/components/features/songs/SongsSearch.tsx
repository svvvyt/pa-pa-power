import React from 'react';
import { Box, Chip, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import { StyledTextField } from '@/components';
import type { FilterOptions } from '@/hooks';

interface SongsSearchProps {
  filters: FilterOptions;
  filterOptions: { genres: string[]; artists: string[] };
  onSearchChange: (searchTerm: string) => void;
  onGenreChange: (genre: string) => void;
  onArtistChange: (artist: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

const SongsSearch: React.FC<SongsSearchProps> = ({
  filters,
  filterOptions,
  onSearchChange,
  onGenreChange,
  onArtistChange,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      gap: { xs: 1, sm: 2 }, 
      mb: 4, 
      flexWrap: 'wrap', 
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: { xs: 'stretch', sm: 'center' }
    }}>
      <StyledTextField
        placeholder="Search songs..."
        value={filters.searchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#8e8e93' }} />
            </InputAdornment>
          ),
        }}
        sx={{ minWidth: { xs: '100%', sm: 300 } }}
        variant="dark"
      />
      
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {filterOptions.genres.map((genre) => (
          <Chip
            key={genre}
            label={genre === 'all' ? 'All Genres' : genre}
            onClick={() => onGenreChange(genre)}
            sx={{
              bgcolor: filters.selectedGenre === genre ? '#0a84ff' : 'rgba(44,44,46,0.8)',
              color: filters.selectedGenre === genre ? '#ffffff' : '#8e8e93',
              border: '1px solid rgba(255,255,255,0.1)',
              '&:hover': {
                bgcolor: filters.selectedGenre === genre ? '#0070d1' : 'rgba(44,44,46,1)',
              },
            }}
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {filterOptions.artists.map((artist) => (
          <Chip
            key={artist}
            label={artist === 'all' ? 'All Artists' : artist}
            onClick={() => onArtistChange(artist)}
            sx={{
              bgcolor: filters.selectedArtist === artist ? '#0a84ff' : 'rgba(44,44,46,0.8)',
              color: filters.selectedArtist === artist ? '#ffffff' : '#8e8e93',
              border: '1px solid rgba(255,255,255,0.1)',
              '&:hover': {
                bgcolor: filters.selectedArtist === artist ? '#0070d1' : 'rgba(44,44,46,1)',
              },
            }}
          />
        ))}
      </Box>

      {hasActiveFilters && (
        <Chip
          label="Clear Filters"
          onClick={onResetFilters}
          sx={{
            bgcolor: 'rgba(255,107,107,0.2)',
            color: '#ff6b6b',
            border: '1px solid rgba(255,107,107,0.3)',
            '&:hover': {
              bgcolor: 'rgba(255,107,107,0.3)',
            },
          }}
        />
      )}
    </Box>
  );
};

export default SongsSearch; 