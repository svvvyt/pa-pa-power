import React from 'react';
import { Alert } from '@mui/material';
import type { AlertProps as AlertPropsType } from '@mui/material';

interface StyledAlertProps extends AlertPropsType {
  children: React.ReactNode;
}

const StyledAlert: React.FC<StyledAlertProps> = ({ children, sx, ...props }) => {
  return (
    <Alert
      {...props}
      sx={{
        borderRadius: 3,
        ...sx,
      }}
    >
      {children}
    </Alert>
  );
};

export default StyledAlert; 