import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { validate, registerSchema, loginSchema } from '../utils/validation';

const router = Router();

// Register user
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = validate(registerSchema, req.body);
    const result = await AuthService.registerUser(validatedData);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// Login user
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = validate(loginSchema, req.body);
    const result = await AuthService.loginUser(validatedData);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router; 