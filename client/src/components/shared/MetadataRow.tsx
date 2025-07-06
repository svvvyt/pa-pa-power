import React from 'react';
import { Box, Typography } from '@mui/material';

interface MetadataRowProps {
  label: string;
  value: React.ReactNode;
}

const MetadataRow: React.FC<MetadataRowProps> = ({ label, value }) => (
  <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline', mb: 0.5 }}>
    <Typography variant="body2" sx={{ color: '#8e8e93', minWidth: 90, fontWeight: 600 }}>
      {label}:
    </Typography>
    <Typography variant="body2" sx={{ color: '#fff', fontWeight: 400, wordBreak: 'break-word' }}>
      {value}
    </Typography>
  </Box>
);

export default MetadataRow; 