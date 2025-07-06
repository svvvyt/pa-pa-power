import React from 'react';
import { Avatar, Typography } from '@mui/material';

interface CoverAvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  variant?: 'square' | 'circular';
  children?: React.ReactNode;
}

const CoverAvatar: React.FC<CoverAvatarProps> = ({ src, alt, size = 48, variant = 'square', children }) => {
  return (
    <Avatar
      src={src}
      alt={alt}
      variant={variant}
      sx={{
        width: size,
        height: size,
        borderRadius: variant === 'square' ? 3 : '50%',
        bgcolor: '#18181a',
        border: '1px solid rgba(255,255,255,0.08)',
        fontSize: size * 0.5,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children || (
        <Typography variant="h6" sx={{ color: '#0a84ff', fontWeight: 700 }}>
          {alt?.charAt(0).toUpperCase()}
        </Typography>
      )}
    </Avatar>
  );
};

export default CoverAvatar; 