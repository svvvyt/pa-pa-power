import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Link,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '@/hooks';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { StyledTextField, StyledButton, StyledAlert } from '@/components';
import { COLORS, BORDER_RADIUS, SHADOWS, BACKDROP_FILTERS } from '@/utils';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await login({ email, password });
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        background: 'none',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          width: '100%',
          maxWidth: { xs: '100%', sm: 400 },
          borderRadius: BORDER_RADIUS.xlarge,
          background: COLORS.background.paper,
          boxShadow: SHADOWS.medium,
          backdropFilter: BACKDROP_FILTERS.medium,
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 700, letterSpacing: -1, color: COLORS.text.primary }}>
          Sign In
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 3, fontWeight: 500, color: COLORS.text.secondary }}>
          Welcome back to Pa-Pa-Power
        </Typography>

        {error && (
          <StyledAlert severity="error" sx={{ mb: 2 }}>
            {error}
          </StyledAlert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <StyledTextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            disabled={isLoading}
            variant="dark"
          />
          <StyledTextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            disabled={isLoading}
            variant="dark"
          />
          <StyledButton
            type="submit"
            fullWidth
            variant="primary"
            sx={{ mt: 2, mb: 2, fontSize: 18 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
          </StyledButton>
          <Box sx={{ textAlign: 'center' }}>
            <Link component={RouterLink} to="/register" variant="body2" sx={{ fontWeight: 500, color: COLORS.primary }}>
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login; 