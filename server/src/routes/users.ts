import { Router, Request, Response } from 'express';
import { db } from '../configs/database';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// Update user favorites
router.put('/favorites', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { favoriteSongIds } = req.body;
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    await db.updateUserFavorites(req.user.userId, favoriteSongIds);
    res.json({ message: 'Favorites updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update favorites' });
  }
});

export default router; 