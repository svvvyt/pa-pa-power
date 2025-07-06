import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { PlaylistService } from '../services/PlaylistService';
import { validate, playlistCreateSchema, playlistUpdateSchema } from '../utils/validation';

const router = Router();

// Create playlist
router.post('/', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = validate(playlistCreateSchema, req.body);
    const playlist = await PlaylistService.createPlaylist(validatedData);
    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
});

// Get all playlists
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const playlists = await PlaylistService.getAllPlaylists();
    res.json(playlists);
  } catch (error) {
    next(error);
  }
});

// Get playlist by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const playlist = await PlaylistService.getPlaylistById(req.params.id);
    res.json(playlist);
  } catch (error) {
    next(error);
  }
});

// Update playlist
router.put('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = validate(playlistUpdateSchema, req.body);
    const playlist = await PlaylistService.updatePlaylist(req.params.id, validatedData);
    res.json(playlist);
  } catch (error) {
    next(error);
  }
});

// Delete playlist
router.delete('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await PlaylistService.deletePlaylist(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Add song to playlist
router.post('/:id/songs/:songId', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const playlist = await PlaylistService.addSongToPlaylist(req.params.id, req.params.songId);
    res.json(playlist);
  } catch (error) {
    next(error);
  }
});

// Remove song from playlist
router.delete('/:id/songs/:songId', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const playlist = await PlaylistService.removeSongFromPlaylist(req.params.id, req.params.songId);
    res.json(playlist);
  } catch (error) {
    next(error);
  }
});

export default router; 