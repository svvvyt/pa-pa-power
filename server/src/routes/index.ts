import { Router } from 'express';
import authRoutes from './auth';
import songsRoutes from './songs';
import playlistsRoutes from './playlists';
import albumsRoutes from './albums';
import usersRoutes from './users';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Audio Player API is running' });
});

// API routes
router.use('/auth', authRoutes);
router.use('/songs', songsRoutes);
router.use('/playlists', playlistsRoutes);
router.use('/albums', albumsRoutes);
router.use('/users', usersRoutes);

export default router; 