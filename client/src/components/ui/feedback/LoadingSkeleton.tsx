import React from 'react';
import { Box, Skeleton, Card, CardContent, Grid } from '@mui/material';

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'grid' | 'table' | 'custom';
  count?: number;
  height?: number | string;
  width?: number | string;
  variant?: 'rectangular' | 'circular' | 'text';
  animation?: 'pulse' | 'wave' | false;
  spacing?: number;
  columns?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'card',
  count = 1,
  height,
  width,
  variant = 'rectangular',
  animation = 'wave',
  spacing = 2,
  columns = 3,
}) => {
  const renderCardSkeleton = () => (
    <Card
      sx={{
        bgcolor: 'rgba(28, 28, 30, 0.8)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <Skeleton
        variant="rectangular"
        animation={animation}
        sx={{
          height: height || 200,
          bgcolor: 'rgba(255, 255, 255, 0.08)',
        }}
      />
      <CardContent sx={{ p: 2 }}>
        <Skeleton
          variant="text"
          animation={animation}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.08)',
            mb: 1,
            height: 24,
          }}
        />
        <Skeleton
          variant="text"
          animation={animation}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.08)',
            mb: 1,
            height: 16,
            width: '60%',
          }}
        />
        <Skeleton
          variant="text"
          animation={animation}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.08)',
            height: 16,
            width: '40%',
          }}
        />
      </CardContent>
    </Card>
  );

  const renderListSkeleton = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
      <Skeleton
        variant="circular"
        animation={animation}
        sx={{
          width: 56,
          height: 56,
          bgcolor: 'rgba(255, 255, 255, 0.08)',
        }}
      />
      <Box sx={{ flex: 1 }}>
        <Skeleton
          variant="text"
          animation={animation}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.08)',
            mb: 1,
            height: 20,
          }}
        />
        <Skeleton
          variant="text"
          animation={animation}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.08)',
            height: 16,
            width: '60%',
          }}
        />
      </Box>
      <Skeleton
        variant="rectangular"
        animation={animation}
        sx={{
          width: 60,
          height: 20,
          bgcolor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 1,
        }}
      />
    </Box>
  );

  const renderGridSkeleton = () => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${280}px, 1fr))`,
        gap: spacing,
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Box key={index}>
          {renderCardSkeleton()}
        </Box>
      ))}
    </Box>
  );

  const renderTableSkeleton = () => (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', gap: 2, p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton
            key={index}
            variant="text"
            animation={animation}
            sx={{
              flex: 1,
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              height: 24,
            }}
          />
        ))}
      </Box>
      {/* Rows */}
      {Array.from({ length: count }).map((_, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{
            display: 'flex',
            gap: 2,
            p: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="text"
              animation={animation}
              sx={{
                flex: 1,
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                height: 20,
              }}
            />
          ))}
        </Box>
      ))}
    </Box>
  );

  const renderCustomSkeleton = () => (
    <Skeleton
      variant={variant}
      animation={animation}
      sx={{
        height: height || 20,
        width: width || '100%',
        bgcolor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: variant === 'circular' ? '50%' : 1,
      }}
    />
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing }}>
            {Array.from({ length: count }).map((_, index) => (
              <Box key={index}>{renderCardSkeleton()}</Box>
            ))}
          </Box>
        );
      case 'list':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {Array.from({ length: count }).map((_, index) => (
              <Box key={index}>{renderListSkeleton()}</Box>
            ))}
          </Box>
        );
      case 'grid':
        return renderGridSkeleton();
      case 'table':
        return renderTableSkeleton();
      case 'custom':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing }}>
            {Array.from({ length: count }).map((_, index) => (
              <Box key={index}>{renderCustomSkeleton()}</Box>
            ))}
          </Box>
        );
      default:
        return renderCustomSkeleton();
    }
  };

  return renderSkeleton();
};

// Specialized skeleton components for common use cases
export const SongCardSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <LoadingSkeleton type="grid" count={count} />
);

export const PlaylistCardSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <LoadingSkeleton type="grid" count={count} />
);

export const AlbumCardSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <LoadingSkeleton type="grid" count={count} />
);

export const SongListSkeleton: React.FC<{ count?: number }> = ({ count = 10 }) => (
  <LoadingSkeleton type="list" count={count} />
);

export const TableSkeleton: React.FC<{ count?: number; columns?: number }> = ({ 
  count = 5, 
  columns = 4 
}) => (
  <LoadingSkeleton type="table" count={count} columns={columns} />
);

export const TextSkeleton: React.FC<{ 
  lines?: number; 
  height?: number | string;
  width?: number | string;
}> = ({ lines = 3, height = 20, width = '100%' }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        variant="text"
        animation="wave"
        sx={{
          height,
          width: index === lines - 1 ? `${Math.floor(Math.random() * 40 + 60)}%` : width,
          bgcolor: 'rgba(255, 255, 255, 0.08)',
        }}
      />
    ))}
  </Box>
);

export default LoadingSkeleton; 