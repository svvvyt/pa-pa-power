import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { validate } from '../utils/validation';

export const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = validate(schema, req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      next(error);
    }
  };
}; 