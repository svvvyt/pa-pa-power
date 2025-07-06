import React from 'react';
import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

interface StyledTextFieldProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'default' | 'dark';
}

const StyledTextField: React.FC<StyledTextFieldProps> = ({ 
  variant = 'default', 
  sx, 
  ...props 
}) => {
  const baseStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      background: variant === 'dark' ? 'rgba(44,44,46,0.8)' : 'transparent',
      '& fieldset': {
        borderColor: 'rgba(255,255,255,0.2)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255,255,255,0.3)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#0a84ff',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#8e8e93',
      '&.Mui-focused': {
        color: '#0a84ff',
      },
    },
    '& .MuiInputBase-input': {
      color: '#ffffff',
      '&::placeholder': {
        color: '#8e8e93',
        opacity: 1,
      },
    },
  };

  return (
    <TextField
      variant="outlined"
      sx={{ ...baseStyles, ...sx }}
      {...props}
    />
  );
};

export default StyledTextField; 