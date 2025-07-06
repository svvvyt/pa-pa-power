import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../configs/database';
import { upload } from '../configs/multer';
import { authenticateToken } from '../middlewares/auth';
import { AudioService } from '../services/audioService';
import { Song } from '../types';

const router = Router();

// Upload song
router.post('/upload', authenticateToken, upload.single('audio'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const filePath = req.file.path;
    const metadata = await AudioService.extractMetadata(filePath);
    
    // Extract album cover if available
    let albumCoverPath: string | undefined;
    const coverData = await AudioService.extractAlbumCover(filePath);
    if (coverData) {
      const coverFileName = `${uuidv4()}.jpg`;
      albumCoverPath = await AudioService.saveAlbumCover(coverData, coverFileName);
    }

    const song: Song = {
      id: uuidv4(),
      title: metadata.title || req.file.originalname,
      artist: metadata.artist || 'Unknown Artist',
      album: metadata.album || 'Unknown Album',
      duration: metadata.duration || 0,
      filePath: `/uploads/audio/${req.file.filename}`,
      albumCover: albumCoverPath,
      releaseDate: metadata.year?.toString(),
      albumDescription: '',
      lyrics: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.createSong(song);
    res.status(201).json(song);
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

// Get all songs
router.get('/', async (req: Request, res: Response) => {
  try {
    const songs = await db.getAllSongs();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
});

// Get song by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const song = await db.getSongById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    res.json(song);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch song' });
  }
});

// Update song
router.patch('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const song = await db.getSongById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    // Only allow updating certain fields
    const allowedFields = ['title', 'artist', 'album', 'lyrics', 'albumDescription'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        (song as any)[field] = req.body[field];
      }
    }
    song.updatedAt = new Date().toISOString();
    await db.updateSong(song);
    res.json(song);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update song' });
  }
});

// Delete song
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const song = await db.getSongById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    // Delete the actual file
    const filePath = path.join(__dirname, '../../', song.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete album cover if exists
    if (song.albumCover) {
      const coverPath = path.join(__dirname, '../../', song.albumCover);
      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath);
      }
    }

    await db.deleteSong(req.params.id);
    res.json({ message: 'Song deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete song' });
  }
});

export default router; 