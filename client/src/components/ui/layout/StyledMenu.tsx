import React from 'react';
import { Menu } from '@mui/material';
import type { MenuProps as MenuPropsType } from '@mui/material';

interface StyledMenuProps extends Omit<MenuPropsType, 'PaperProps'> {
  children: React.ReactNode;
}

const StyledMenu: React.FC<StyledMenuProps> = ({ children, ...props }) => {
  return (
    <Menu
      {...props}
      PaperProps={{
        sx: {
          borderRadius: 3,
          mt: 1,
          minWidth: 160,
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.4)',
          background: 'rgba(28,28,30,0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      }}
    >
      {children}
    </Menu>
  );
};

export default StyledMenu; 