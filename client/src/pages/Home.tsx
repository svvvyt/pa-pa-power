import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  MusicNote,
  PlaylistPlay,
  Album,
  CloudUpload,
  QueueMusic,
  Favorite,
  AccessTime,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useGetSongsQuery } from '../store/api/audioApi';
import { useGetPlaylistsQuery } from '../store/api/playlistApi';
import StatsCard from '../components/Dashboard/StatsCard';
import { formatDuration, getAlbumCoverUrl } from '../utils/songUtils';
import type { Song } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const { data: songs = [], isLoading: songsLoading } = useGetSongsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: playlists = [], isLoading: playlistsLoading } = useGetPlaylistsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const totalSongs = songs.length;
  const totalPlaylists = playlists.length;
  const totalDuration = songs.reduce((total, song) => total + song.duration, 0);
  const recentSongs = [...songs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const features = [
    {
      icon: <MusicNote sx={{ fontSize: 40, color: '#0a84ff' }} />,
      title: 'Upload & Play',
      description: 'Upload your favorite music files and enjoy high-quality playback',
    },
    {
      icon: <PlaylistPlay sx={{ fontSize: 40, color: '#0a84ff' }} />,
      title: 'Create Playlists',
      description: 'Organize your music into custom playlists for any mood',
    },
    {
      icon: <Album sx={{ fontSize: 40, color: '#0a84ff' }} />,
      title: 'Album Management',
      description: 'Keep your music organized with album and artist information',
    },
    {
      icon: <CloudUpload sx={{ fontSize: 40, color: '#0a84ff' }} />,
      title: 'Smart Metadata',
      description: 'Automatic extraction of song metadata and album covers',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, rgba(28,28,30,0.9) 0%, rgba(44,44,46,0.8) 100%)',
          color: '#ffffff',
          py: 8,
          px: 4,
          textAlign: 'center',
          borderRadius: 5,
          mb: 6,
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.4)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 800, letterSpacing: -2, fontSize: 48, color: '#ffffff' }}>
          Welcome to Pa-Pa-Power
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, opacity: 0.9, fontWeight: 500, color: '#8e8e93' }}>
          Your personal audio player with powerful features
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          {isAuthenticated ? (
            <>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/songs')}
                sx={{
                  bgcolor: '#0a84ff',
                  color: '#ffffff',
                  borderRadius: 999,
                  px: 4,
                  fontWeight: 600,
                  fontSize: 18,
                  boxShadow: '0 2px 8px 0 rgba(10,132,255,0.3)',
                  '&:hover': { bgcolor: '#0070d1' },
                }}
              >
                Browse Songs
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/playlists')}
                sx={{
                  borderColor: '#0a84ff',
                  color: '#0a84ff',
                  borderRadius: 999,
                  px: 4,
                  fontWeight: 600,
                  fontSize: 18,
                  bgcolor: 'rgba(10,132,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(10,132,255,0.2)' },
                }}
              >
                My Playlists
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  bgcolor: '#0a84ff',
                  color: '#ffffff',
                  borderRadius: 999,
                  px: 4,
                  fontWeight: 600,
                  fontSize: 18,
                  boxShadow: '0 2px 8px 0 rgba(10,132,255,0.3)',
                  '&:hover': { bgcolor: '#0070d1' },
                }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  borderColor: '#0a84ff',
                  color: '#0a84ff',
                  borderRadius: 999,
                  px: 4,
                  fontWeight: 600,
                  fontSize: 18,
                  bgcolor: 'rgba(10,132,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(10,132,255,0.2)' },
                }}
              >
                Sign In
              </Button>
            </>
          )}
        </Box>
      </Paper>

      {/* Dashboard Section for Authenticated Users */}
      {isAuthenticated && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, textAlign: 'center', fontWeight: 700, letterSpacing: -1, color: '#ffffff' }}>
            Your Music Dashboard
          </Typography>
          
          {songsLoading || playlistsLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 4, mb: 4 }}>
              <StatsCard
                title="Total Songs"
                value={totalSongs}
                icon={<MusicNote />}
                color="primary"
              />
              <StatsCard
                title="Playlists"
                value={totalPlaylists}
                icon={<QueueMusic />}
                color="secondary"
              />
              <StatsCard
                title="Total Duration"
                value={formatDuration(totalDuration)}
                icon={<AccessTime />}
                color="success"
              />
              <StatsCard
                title="Recent Uploads"
                value={recentSongs.length}
                subtitle="Last 5 songs"
                icon={<Favorite />}
                color="info"
              />
            </Box>
          )}

          {recentSongs.length > 0 && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, background: 'rgba(28,28,30,0.8)', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.4)', mb: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 700, mb: 2, color: '#ffffff' }}>
                Recently Added Songs
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 2 }}>
                {recentSongs.map((song) => (
                  <Card key={song.id} sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 3, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.4)', background: 'rgba(44,44,46,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 50, height: 50, borderRadius: 2, mr: 2, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.3)' }}
                      image={getAlbumCoverUrl(song.albumCover)}
                      alt={song.title}
                    />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="body2" noWrap sx={{ fontWeight: 500, color: '#ffffff' }}>
                        {song.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#8e8e93' }} noWrap>
                        {song.artist}
                      </Typography>
                    </Box>
                  </Card>
                ))}
              </Box>
            </Paper>
          )}
        </Box>
      )}

      {/* Features Section */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, textAlign: 'center', fontWeight: 700, letterSpacing: -1, color: '#ffffff' }}>
        Features
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 4, mb: 6 }}>
        {features.map((feature, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              p: 4,
              borderRadius: 4,
              background: 'rgba(28,28,30,0.8)',
              boxShadow: '0 4px 24px 0 rgba(0,0,0,0.4)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.5)',
              },
            }}
          >
            <Box sx={{ mb: 2 }}>
              {feature.icon}
            </Box>
            <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, color: '#ffffff' }}>
              {feature.title}
            </Typography>
            <Typography variant="body2" sx={{ color: '#8e8e93', lineHeight: 1.6 }}>
              {feature.description}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Call to Action */}
      {!isAuthenticated && (
        <Paper
          elevation={0}
          sx={{
            bgcolor: 'rgba(255,255,255,0.85)',
            p: 4,
            textAlign: 'center',
            borderRadius: 4,
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
          }}
        >
          <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 700 }}>
            Ready to start your music journey?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Join thousands of users who are already enjoying their music with Pa-Pa-Power
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ mr: 2, borderRadius: 999, px: 4, fontWeight: 600, fontSize: 18 }}
          >
            Create Account
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/login')}
            sx={{ borderRadius: 999, px: 4, fontWeight: 600, fontSize: 18, borderColor: '#007aff', color: '#007aff', bgcolor: 'rgba(0,122,255,0.04)', '&:hover': { bgcolor: 'rgba(0,122,255,0.12)' } }}
          >
            Sign In
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default Home; 