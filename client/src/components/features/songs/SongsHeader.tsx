import React from 'react';
import { Box, Typography } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { StyledButton } from '@/components';

interface SongsHeaderProps {
  songCount: number;
  onUploadClick: () => void;
}

const SongsHeader: React.FC<SongsHeaderProps> = ({ songCount, onUploadClick }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
      <Box>
        <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>
          Songs
        </Typography>
        <Typography variant="body1" sx={{ color: '#8e8e93' }}>
          {songCount} song(s) in your library
        </Typography>
      </Box>
      <StyledButton
        variant="primary"
        startIcon={<CloudUpload />}
        onClick={onUploadClick}
      >
        Upload Song
      </StyledButton>
    </Box>
  );
};

export default SongsHeader; 