import React from 'react';
import {
  Box,
  Typography,
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
import { useAuth, useGetSongs, useGetPlaylists } from '@/hooks';
import { StatsCard, StyledButton, StyledCard, CoverAvatar } from '@/components';
import { formatDuration, getAlbumCoverUrl } from '@/utils';
import type { Song } from '@/types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const { data: songs = [], loading: songsLoading } = useGetSongs();
  const { data: playlists = [], loading: playlistsLoading } = useGetPlaylists();

  const totalSongs = (songs || []).length;
  const totalPlaylists = (playlists || []).length;
  const totalDuration = (songs || []).reduce((total: number, song: any) => total + song.duration, 0);
  const recentSongs = [...(songs || [])]
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
      <StyledCard
        sx={{
          background: 'linear-gradient(135deg, rgba(28,28,30,0.9) 0%, rgba(44,44,46,0.8) 100%)',
          color: '#ffffff',
          py: 8,
          px: 4,
          textAlign: 'center',
          borderRadius: 5,
          mb: 6,
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom sx={{ 
          fontWeight: 800, 
          letterSpacing: -2, 
          fontSize: { xs: 32, sm: 40, md: 48 }, 
          color: '#ffffff',
          textAlign: { xs: 'center', sm: 'center' }
        }}>
          Welcome to Pa-Pa-Power
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom sx={{ 
          mb: 4, 
          opacity: 0.9, 
          fontWeight: 500, 
          color: '#8e8e93',
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
          textAlign: { xs: 'center', sm: 'center' }
        }}>
          Your personal audio player with powerful features
        </Typography>
        <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, justifyContent: 'center', flexWrap: 'wrap' }}>
          {isAuthenticated ? (
            <>
              <StyledButton
                variant="primary"
                size="large"
                onClick={() => navigate('/songs')}
                sx={{
                  px: 4,
                  fontSize: 18,
                }}
              >
                Browse Songs
              </StyledButton>
              <StyledButton
                variant="outline"
                size="large"
                onClick={() => navigate('/playlists')}
                sx={{
                  px: 4,
                  fontSize: 18,
                }}
              >
                My Playlists
              </StyledButton>
            </>
          ) : (
            <>
              <StyledButton
                variant="primary"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  px: 4,
                  fontSize: 18,
                }}
              >
                Get Started
              </StyledButton>
              <StyledButton
                variant="outline"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  px: 4,
                  fontSize: 18,
                }}
              >
                Sign In
              </StyledButton>
            </>
          )}
        </Box>
      </StyledCard>

      {/* Dashboard Section for Authenticated Users */}
      {isAuthenticated && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ 
            mb: 4, 
            textAlign: 'center', 
            fontWeight: 700, 
            letterSpacing: -1, 
            color: '#ffffff',
            fontSize: { xs: '1.75rem', sm: '2.125rem' }
          }}>
            Your Music Dashboard
          </Typography>
          
          {songsLoading || playlistsLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(auto-fit, minmax(220px, 1fr))' }, 
              gap: { xs: 2, sm: 3, md: 4 }, 
              mb: 4 
            }}>
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
            <StyledCard sx={{ p: 3, borderRadius: 4, background: 'rgba(28,28,30,0.8)', mb: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 700, mb: 2, color: '#ffffff' }}>
                Recently Added Songs
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(200px, 1fr))', md: 'repeat(auto-fill, minmax(220px, 1fr))' }, 
                gap: { xs: 1, sm: 2 } 
              }}>
                {recentSongs.map((song) => (
                  <StyledCard key={song.id} sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 3, background: 'rgba(44,44,46,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Box sx={{ mr: 2 }}>
                      <CoverAvatar
                        src={getAlbumCoverUrl(song.albumCover)}
                        alt={song.title}
                        size={50}
                      />
                    </Box>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="body2" noWrap sx={{ fontWeight: 500, color: '#ffffff' }}>
                        {song.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#8e8e93' }} noWrap>
                        {song.artist}
                      </Typography>
                    </Box>
                  </StyledCard>
                ))}
              </Box>
            </StyledCard>
          )}
        </Box>
      )}

      {/* Features Section */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ 
        mb: 4, 
        textAlign: 'center', 
        fontWeight: 700, 
        letterSpacing: -1, 
        color: '#ffffff',
        fontSize: { xs: '1.75rem', sm: '2.125rem' }
      }}>
        Features
      </Typography>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(auto-fit, minmax(250px, 1fr))' }, 
        gap: { xs: 3, sm: 4 }, 
        mb: 6 
      }}>
        {features.map((feature, index) => (
          <StyledCard
            key={index}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              p: 4,
              borderRadius: 4,
              background: 'rgba(28,28,30,0.8)',
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
          </StyledCard>
        ))}
      </Box>

      {/* Call to Action */}
      {!isAuthenticated && (
        <StyledCard
          sx={{
            bgcolor: 'rgba(255,255,255,0.85)',
            p: 4,
            textAlign: 'center',
            borderRadius: 4,
          }}
        >
          <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 700 }}>
            Ready to start your music journey?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Join thousands of users who are already enjoying their music with Pa-Pa-Power
          </Typography>
          <StyledButton
            variant="primary"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ mr: 2, px: 4, fontSize: 18 }}
          >
            Create Account
          </StyledButton>
          <StyledButton
            variant="outline"
            size="large"
            onClick={() => navigate('/login')}
            sx={{ px: 4, fontSize: 18 }}
          >
            Sign In
          </StyledButton>
        </StyledCard>
      )}
    </Box>
  );
};

export default Home; 