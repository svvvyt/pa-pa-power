import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import { MusicNote } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(28,28,30,0.7)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 2px 16px 0 rgba(0,0,0,0.3)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        color: '#ffffff',
        py: 1,
      }}
    >
      <Toolbar sx={{
        minHeight: 64,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
      }}>
        <Box
          display="flex"
          alignItems="center"
          sx={{
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onClick={() => navigate('/')}
        >
          <MusicNote sx={{ mr: 1, color: '#0a84ff', fontSize: 32 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              letterSpacing: -1,
              fontFamily: `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif`,
              color: '#ffffff',
              fontSize: 24,
            }}
          >
            Pa-Pa-Power
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isAuthenticated ? (
            <>
              <Button
                variant="text"
                sx={{ borderRadius: 999, px: 2, fontWeight: 500, color: '#ffffff', '&:hover': { bgcolor: 'rgba(10,132,255,0.2)' } }}
                onClick={() => navigate('/songs')}
              >
                Songs
              </Button>
              <Button
                variant="text"
                sx={{ borderRadius: 999, px: 2, fontWeight: 500, color: '#ffffff', '&:hover': { bgcolor: 'rgba(10,132,255,0.2)' } }}
                onClick={() => navigate('/playlists')}
              >
                Playlists
              </Button>
              <Button
                variant="text"
                sx={{ borderRadius: 999, px: 2, fontWeight: 500, color: '#ffffff', '&:hover': { bgcolor: 'rgba(10,132,255,0.2)' } }}
                onClick={() => navigate('/albums')}
              >
                Albums
              </Button>
              <IconButton
                size="small"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                sx={{ ml: 1, bgcolor: 'rgba(10,132,255,0.2)', borderRadius: 999 }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#2c2c2e', color: '#0a84ff', fontWeight: 700 }}>
                  {user?.username.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
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
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                sx={{ borderRadius: 999, px: 3, fontWeight: 500, color: '#0a84ff', borderColor: '#0a84ff', bgcolor: 'rgba(10,132,255,0.1)', '&:hover': { bgcolor: 'rgba(10,132,255,0.2)' } }}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                variant="contained"
                sx={{ borderRadius: 999, px: 3, fontWeight: 500, bgcolor: '#0a84ff', color: '#ffffff', boxShadow: '0 2px 8px 0 rgba(10,132,255,0.3)', '&:hover': { bgcolor: '#0070d1' } }}
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 