import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../configs/database';
import { authenticateToken } from '../middlewares/auth';
import { Playlist } from '../types';

const router = Router();

// Create playlist
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, description, songIds } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Playlist name is required' });
    }

    const playlist: Playlist = {
      id: uuidv4(),
      name,
      description,
      songIds: songIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.createPlaylist(playlist);
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});

// Get all playlists
router.get('/', async (req: Request, res: Response) => {
  try {
    const playlists = await db.getAllPlaylists();
    // For each playlist, set coverImage to the albumCover of the first song (if any)
    const playlistsWithCovers = await Promise.all(
      playlists.map(async (playlist) => {
        if (playlist.songIds && playlist.songIds.length > 0) {
          const firstSong = await db.getSongById(playlist.songIds[0]);
          return {
            ...playlist,
            coverImage: firstSong?.albumCover || null,
          };
        }
        return playlist;
      })
    );
    res.json(playlistsWithCovers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

// Update playlist
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, description, songIds } = req.body;
    const existingPlaylists = await db.getAllPlaylists();
    const playlist = existingPlaylists.find((p: Playlist) => p.id === req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    const updatedPlaylist: Playlist = {
      ...playlist,
      name: name || playlist.name,
      description: description !== undefined ? description : playlist.description,
      songIds: songIds || playlist.songIds,
      updatedAt: new Date().toISOString()
    };

    await db.updatePlaylist(updatedPlaylist);
    res.json(updatedPlaylist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update playlist' });
  }
});

// Delete playlist
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const existingPlaylists = await db.getAllPlaylists();
    const playlist = existingPlaylists.find((p: Playlist) => p.id === req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    await db.deletePlaylist(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete playlist' });
  }
});

export default router; 