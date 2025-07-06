import React from 'react';
import { Box, Typography } from '@mui/material';

interface LyricsDisplayProps {
  lyrics?: string;
  maxHeight?: number;
  showTitle?: boolean;
  title?: string;
}

const LyricsDisplay: React.FC<LyricsDisplayProps> = ({ 
  lyrics, 
  maxHeight = 200, 
  showTitle = true,
  title = "Lyrics"
}) => {
  if (!lyrics) {
    return (
      <Box sx={{ width: '100%' }}>
        {showTitle && (
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
            {title}
          </Typography>
        )}
        <Box
          sx={{
            maxHeight,
            overflowY: 'auto',
            background: 'rgba(44,44,46,0.7)',
            borderRadius: 2,
            p: 2,
            color: '#8e8e93',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            fontSize: 14,
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 60,
          }}
        >
          No lyrics available.
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {showTitle && (
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
      )}
      <Box
        sx={{
          maxHeight,
          overflowY: 'auto',
          background: 'rgba(44,44,46,0.7)',
          borderRadius: 2,
          p: 2,
          color: '#fff',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          fontSize: 14,
          border: '1px solid rgba(255,255,255,0.08)',
          lineHeight: 1.6,
          '&::-webkit-scrollbar': {
            width: 8,
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(44,44,46,0.3)',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 4,
            '&:hover': {
              background: 'rgba(255,255,255,0.3)',
            },
          },
        }}
      >
        {lyrics}
      </Box>
    </Box>
  );
};

export default LyricsDisplay; 