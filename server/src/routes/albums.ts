import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../configs/database';
import { authenticateToken } from '../middlewares/auth';
import { Album } from '../types';

const router = Router();

// Create album
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, artist, description, songIds } = req.body;

    if (!name || !artist) {
      return res.status(400).json({ error: 'Album name and artist are required' });
    }

    const album: Album = {
      id: uuidv4(),
      name,
      artist,
      description,
      songIds: songIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.createAlbum(album);
    res.status(201).json(album);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create album' });
  }
});

// Get all albums
router.get('/', async (req: Request, res: Response) => {
  try {
    const albums = await db.getAllAlbums();
    // For each album, set coverImage to the albumCover of the first song (if any)
    const albumsWithCovers = await Promise.all(
      albums.map(async (album) => {
        if (album.songIds && album.songIds.length > 0) {
          const firstSong = await db.getSongById(album.songIds[0]);
          return {
            ...album,
            coverImage: firstSong?.albumCover || album.coverImage || null,
          };
        }
        return album;
      })
    );
    res.json(albumsWithCovers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
});

// Get album by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const album = await db.getAlbumById(req.params.id);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    res.json(album);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch album' });
  }
});

// Update album
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, artist, description, songIds, releaseDate, coverImage } = req.body;
    const existingAlbums = await db.getAllAlbums();
    const album = existingAlbums.find((a: Album) => a.id === req.params.id);
    
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    const updatedAlbum: Album = {
      ...album,
      name: name || album.name,
      artist: artist || album.artist,
      description: description !== undefined ? description : album.description,
      songIds: songIds || album.songIds,
      releaseDate: releaseDate !== undefined ? releaseDate : album.releaseDate,
      coverImage: coverImage !== undefined ? coverImage : album.coverImage,
      updatedAt: new Date().toISOString()
    };

    await db.updateAlbum(updatedAlbum);
    res.json(updatedAlbum);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update album' });
  }
});

// Delete album
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const existingAlbums = await db.getAllAlbums();
    const album = existingAlbums.find((a: Album) => a.id === req.params.id);
    
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    await db.deleteAlbum(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete album' });
  }
});

export default router; 