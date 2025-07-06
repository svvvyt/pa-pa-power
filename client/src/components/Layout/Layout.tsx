import React from 'react';
import type { ReactNode } from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme, GlobalStyles } from '@mui/material';
import Header from './Header';
import AudioPlayer from '../AudioPlayer/AudioPlayer';


const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0a84ff', // macOS blue for dark mode
    },
    secondary: {
      main: '#1c1c1e', // Dark gray
    },
    background: {
      default: '#000000',
      paper: 'rgba(28,28,30,0.8)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#8e8e93',
    },
    divider: 'rgba(255,255,255,0.1)',
  },
  typography: {
    fontFamily: `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif`,
    h1: { fontWeight: 700, letterSpacing: -1 },
    h2: { fontWeight: 600, letterSpacing: -0.5 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 500 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    button: { fontWeight: 500, letterSpacing: 0.5 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: 'none',
          fontWeight: 500,
          paddingLeft: 20,
          paddingRight: 20,
          boxShadow: 'none',
          transition: 'background 0.2s, box-shadow 0.2s',
        },
        contained: {
          boxShadow: '0 2px 8px 0 rgba(10,132,255,0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: 'rgba(28,28,30,0.8)',
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.4)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.4)',
          background: 'rgba(28,28,30,0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: 'rgba(44,44,46,0.8)',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: 32,
          paddingBottom: 32,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'rgba(44,44,46,0.8)',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          background: 'rgba(28,28,30,0.9)',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      },
    },
  },
});

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{
        body: {
          background: 'linear-gradient(135deg, #000000 0%, #1c1c1e 50%, #2c2c2e 100%)',
          color: '#ffffff',
        },
        '#root': {
          minHeight: '100vh',
        },
      }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box sx={{ position: 'sticky', top: 0, zIndex: 1200 }}>
          <Header />
        </Box>
        <Container component="main" sx={{ flexGrow: 1, py: 3, pb: 10 }}>
          {children}
        </Container>
        <AudioPlayer />
      </Box>
    </ThemeProvider>
  );
};

export default Layout; 