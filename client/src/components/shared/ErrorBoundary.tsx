import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  AlertTitle,
  Divider,
  Collapse,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  BugReport as BugReportIcon,
} from '@mui/icons-material';
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Log error to external service in production
    if (import.meta.env.PROD) {
      // TODO: Send to error reporting service
      console.error('Production error:', { error, errorInfo });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  handleGoHome = () => {
    // Try to use React Router navigation, fallback to window.location
    try {
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    } catch (error) {
      window.location.href = '/';
    }
    this.handleRetry();
  };

  handleToggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            background: 'linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 100%)',
          }}
        >
          <Paper
            elevation={24}
            sx={{
              maxWidth: 600,
              width: '100%',
              p: 4,
              borderRadius: 3,
              background: 'rgba(28, 28, 30, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <ErrorIcon sx={{ fontSize: 64, color: '#ff453a', mb: 2 }} />
              <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>
                Oops! Something went wrong
              </Typography>
              <Typography variant="body1" sx={{ color: '#8e8e93', mb: 3 }}>
                We encountered an unexpected error. Don't worry, your data is safe.
              </Typography>
            </Box>

            <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(255, 69, 58, 0.1)' }}>
              <AlertTitle>Error Details</AlertTitle>
              {this.state.error?.message || 'An unknown error occurred'}
            </Alert>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleRetry}
                sx={{
                  bgcolor: '#0a84ff',
                  '&:hover': { bgcolor: '#0070d1' },
                }}
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                startIcon={<HomeIcon />}
                onClick={this.handleGoHome}
                sx={{
                  borderColor: '#0a84ff',
                  color: '#0a84ff',
                  '&:hover': { bgcolor: 'rgba(10, 132, 255, 0.1)' },
                }}
              >
                Go Home
              </Button>
              <Button
                variant="text"
                startIcon={<BugReportIcon />}
                onClick={this.handleToggleDetails}
                sx={{ color: '#8e8e93' }}
              >
                {this.state.showDetails ? 'Hide' : 'Show'} Details
              </Button>
            </Box>

            <Collapse in={this.state.showDetails}>
              <Divider sx={{ my: 2, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
              <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.2)', p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ color: '#8e8e93', mb: 1 }}>
                  Error Stack:
                </Typography>
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{
                    color: '#ff453a',
                    fontSize: '0.75rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: 'monospace',
                    bgcolor: 'rgba(255, 69, 58, 0.1)',
                    p: 1,
                    borderRadius: 1,
                    maxHeight: 200,
                    overflow: 'auto',
                  }}
                >
                  {this.state.error?.stack}
                </Typography>
                {this.state.errorInfo && (
                  <>
                    <Typography variant="subtitle2" sx={{ color: '#8e8e93', mb: 1, mt: 2 }}>
                      Component Stack:
                    </Typography>
                    <Typography
                      variant="body2"
                      component="pre"
                      sx={{
                        color: '#8e8e93',
                        fontSize: '0.75rem',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        fontFamily: 'monospace',
                        bgcolor: 'rgba(142, 142, 147, 0.1)',
                        p: 1,
                        borderRadius: 1,
                        maxHeight: 200,
                        overflow: 'auto',
                      }}
                    >
                      {this.state.errorInfo.componentStack}
                    </Typography>
                  </>
                )}
              </Box>
            </Collapse>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Simple wrapper component
const ErrorBoundary: React.FC<Props> = ({ children, fallback }) => {
  return <ErrorBoundaryClass fallback={fallback}>{children}</ErrorBoundaryClass>;
};

export default ErrorBoundary; 