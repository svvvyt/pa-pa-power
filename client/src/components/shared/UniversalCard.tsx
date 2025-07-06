import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, Chip } from '@mui/material';
import { PlayArrow, Pause, MoreVert } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { formatDuration } from '@/utils';

interface UniversalCardProps {
  type: 'song' | 'album' | 'playlist';
  title: string;
  subtitle?: string;
  coverUrl?: string;
  duration?: number;
  songCount?: number;
  isPlaying?: boolean;
  onPlayPause: () => void;
  onCardClick?: () => void;
  onMenuClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  sx?: any;
  coverOverlay?: React.ReactNode;
}

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    '& .hover-overlay': {
      opacity: 1,
    },
  },
}));

const CoverImage = styled('img')({
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  borderRadius: '8px 8px 0 0',
});

const DefaultCover = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '200px',
  backgroundColor: theme.palette.grey[300],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px 8px 0 0',
  color: theme.palette.grey[600],
}));

const HoverOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
  borderRadius: '8px 8px 0 0',
  pointerEvents: 'auto',
}));

const PlayButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  width: 56,
  height: 56,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'scale(1.1)',
  },
}));

const NowPlayingBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  bottom: 8,
  left: 8,
  backgroundColor: theme.palette.success.main,
  color: theme.palette.success.contrastText,
  fontSize: '0.75rem',
  height: 24,
}));

const MenuButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: theme.palette.common.white,
  width: 32,
  height: 32,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
}));

const UniversalCard: React.FC<UniversalCardProps> = ({
  type,
  title,
  subtitle,
  coverUrl,
  duration,
  songCount,
  isPlaying = false,
  onPlayPause,
  onCardClick,
  onMenuClick,
  children,
  sx,
  coverOverlay,
}) => {
  const handleCardClick = (event: React.MouseEvent) => {
    // Don't trigger card click if clicking on play button or menu
    if (
      (event.target as HTMLElement).closest('.play-button') ||
      (event.target as HTMLElement).closest('.menu-button')
    ) {
      return;
    }
    onCardClick?.();
  };

  const handlePlayPause = (event: React.MouseEvent) => {
    event.stopPropagation();
    onPlayPause();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onMenuClick?.(event);
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'album':
        return '🎵';
      case 'playlist':
        return '📋';
      case 'song':
        return '🎶';
      default:
        return '🎵';
    }
  };

  const getMetadataText = () => {
    if (type === 'playlist' && songCount !== undefined) {
      return `${songCount} song${songCount !== 1 ? 's' : ''}`;
    }
    return subtitle;
  };

  return (
    <StyledCard onClick={handleCardClick} sx={sx}>
      <Box sx={{ position: 'relative' }}>
        {coverUrl ? (
          <CoverImage src={coverUrl} alt={title} />
        ) : (
          <DefaultCover>
            <Typography variant="h3">{getTypeIcon()}</Typography>
          </DefaultCover>
        )}
        {/* Custom overlay (icon, etc.) */}
        {coverOverlay}
        <HoverOverlay className="hover-overlay">
          <PlayButton
            className="play-button"
            onClick={handlePlayPause}
            size="large"
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </PlayButton>
        </HoverOverlay>
        {isPlaying && (
          <NowPlayingBadge label="Now Playing" size="small" />
        )}
        {onMenuClick && (
          <MenuButton
            className="menu-button"
            onClick={handleMenuClick}
            size="small"
          >
            <MoreVert />
          </MenuButton>
        )}
      </Box>
      <CardContent sx={{ p: 2 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </Typography>
        {getMetadataText() && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {getMetadataText()}
          </Typography>
        )}
        {type === 'song' && duration && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              mt: 0.5,
            }}
          >
            {formatDuration(duration)}
          </Typography>
        )}
        {type === 'album' && songCount !== undefined && !children && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              mt: 0.5,
            }}
          >
            {songCount} track{songCount !== 1 ? 's' : ''}
          </Typography>
        )}
        {children}
      </CardContent>
    </StyledCard>
  );
};

export default UniversalCard; 