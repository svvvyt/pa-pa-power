import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { AlbumService } from '../services/AlbumService';
import { validate, albumCreateSchema, albumUpdateSchema } from '../utils/validation';

const router = Router();

// Create album
router.post('/', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = validate(albumCreateSchema, req.body);
    const album = await AlbumService.createAlbum(validatedData);
    res.status(201).json(album);
  } catch (error) {
    next(error);
  }
});

// Get all albums
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const albums = await AlbumService.getAllAlbums();
    res.json(albums);
  } catch (error) {
    next(error);
  }
});

// Get album by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const album = await AlbumService.getAlbumById(req.params.id);
    res.json(album);
  } catch (error) {
    next(error);
  }
});

// Update album
router.put('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = validate(albumUpdateSchema, req.body);
    const album = await AlbumService.updateAlbum(req.params.id, validatedData);
    res.json(album);
  } catch (error) {
    next(error);
  }
});

// Delete album
router.delete('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await AlbumService.deleteAlbum(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Add song to album
router.post('/:id/songs/:songId', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const album = await AlbumService.addSongToAlbum(req.params.id, req.params.songId);
    res.json(album);
  } catch (error) {
    next(error);
  }
});

// Remove song from album
router.delete('/:id/songs/:songId', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const album = await AlbumService.removeSongFromAlbum(req.params.id, req.params.songId);
    res.json(album);
  } catch (error) {
    next(error);
  }
});

export default router; 