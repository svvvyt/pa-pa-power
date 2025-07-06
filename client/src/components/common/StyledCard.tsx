import React from 'react';
import { Card } from '@mui/material';
import type { CardProps as CardPropsType } from '@mui/material';

interface StyledCardProps extends Omit<CardPropsType, 'variant'> {
  variant?: 'default' | 'glass' | 'elevated';
  children: React.ReactNode;
}

const StyledCard: React.FC<StyledCardProps> = ({ 
  variant = 'default', 
  sx, 
  children, 
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'default':
        return {
          borderRadius: 3,
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.4)',
          background: 'rgba(28,28,30,0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
        };
      case 'glass':
        return {
          borderRadius: 3,
          background: 'rgba(44,44,46,0.8)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
        };
      case 'elevated':
        return {
          borderRadius: 3,
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.5)',
          background: 'rgba(28,28,30,0.9)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px 0 rgba(0,0,0,0.6)',
          },
        };
      default:
        return {};
    }
  };

  return (
    <Card
      elevation={0}
      sx={{ ...getVariantStyles(), ...sx }}
      {...props}
    >
      {children}
    </Card>
  );
};

export default StyledCard; 