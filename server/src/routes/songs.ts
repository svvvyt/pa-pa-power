import { Router, Request, Response, NextFunction } from 'express';
import { upload } from '../configs/multer';
import { authenticateToken } from '../middlewares/auth';
import { SongService } from '../services/SongService';
import { validate, songUpdateSchema } from '../utils/validation';

const router = Router();

// Upload song
router.post('/upload', authenticateToken, upload.single('audio'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }
    const song = await SongService.uploadSong(req.file);
    res.status(201).json(song);
  } catch (error) {
    next(error);
  }
});

// Get all songs
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const songs = await SongService.getAllSongs();
    res.json(songs);
  } catch (error) {
    next(error);
  }
});

// Get song by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const song = await SongService.getSongById(req.params.id);
    res.json(song);
  } catch (error) {
    next(error);
  }
});

// Update song
router.patch('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = validate(songUpdateSchema, req.body);
    const song = await SongService.updateSong(req.params.id, validatedData);
    res.json(song);
  } catch (error) {
    next(error);
  }
});

// Delete song
router.delete('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await SongService.deleteSong(req.params.id);
    res.json({ message: 'Song deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router; 