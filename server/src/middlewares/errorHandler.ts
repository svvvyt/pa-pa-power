import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  
  res.status(500).json({ error: 'Internal server error' });
}; 