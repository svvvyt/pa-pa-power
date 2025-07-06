import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { AuthService } from '../services/AuthService';
import { validate, userFavoritesSchema } from '../utils/validation';

const router = Router();

// Update user favorites
router.put('/favorites', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const validatedData = validate(userFavoritesSchema, req.body);
    await AuthService.updateUserFavorites(req.user.userId, validatedData.favoriteSongIds);
    res.json({ message: 'Favorites updated successfully' });
  } catch (error) {
    next(error);
  }
});

export default router; 