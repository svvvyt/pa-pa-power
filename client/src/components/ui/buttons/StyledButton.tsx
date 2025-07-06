import React from 'react';
import { Button } from '@mui/material';
import type { ButtonProps as ButtonPropsType } from '@mui/material';

interface StyledButtonProps extends Omit<ButtonPropsType, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

const StyledButton: React.FC<StyledButtonProps> = ({ 
  variant = 'primary', 
  sx, 
  children, 
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bgcolor: '#0a84ff',
          color: '#ffffff',
          borderRadius: 999,
          px: 3,
          py: 1.5,
          fontWeight: 500,
          boxShadow: '0 2px 8px 0 rgba(10,132,255,0.3)',
          '&:hover': { bgcolor: '#0070d1' },
        };
      case 'secondary':
        return {
          bgcolor: 'rgba(44,44,46,0.8)',
          color: '#ffffff',
          borderRadius: 999,
          px: 3,
          py: 1.5,
          fontWeight: 500,
          border: '1px solid rgba(255,255,255,0.1)',
          '&:hover': { bgcolor: 'rgba(44,44,46,1)' },
        };
      case 'outline':
        return {
          color: '#0a84ff',
          borderColor: '#0a84ff',
          bgcolor: 'rgba(10,132,255,0.1)',
          borderRadius: 999,
          px: 3,
          py: 1.5,
          fontWeight: 500,
          '&:hover': { bgcolor: 'rgba(10,132,255,0.2)' },
        };
      default:
        return {};
    }
  };

  return (
    <Button
      variant={variant === 'outline' ? 'outlined' : 'contained'}
      sx={{ ...getVariantStyles(), ...sx }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default StyledButton; 