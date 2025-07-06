import Joi from 'joi';
import { ValidationError } from '../types/errors';

export const validate = (schema: Joi.Schema, data: any) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map((detail: Joi.ValidationErrorItem) => detail.message).join(', ');
    throw new ValidationError(errorMessage);
  }
  
  return value;
};

// Auth validation schemas
export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Song validation schemas
export const songUpdateSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  artist: Joi.string().min(1).max(255).optional(),
  album: Joi.string().min(1).max(255).optional(),
  lyrics: Joi.string().optional(),
  albumDescription: Joi.string().optional()
});

// Playlist validation schemas
export const playlistCreateSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().optional(),
  coverImage: Joi.string().optional(),
  songIds: Joi.array().items(Joi.string()).default([])
});

export const playlistUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional(),
  description: Joi.string().optional(),
  coverImage: Joi.string().optional(),
  songIds: Joi.array().items(Joi.string()).optional()
});

// Album validation schemas
export const albumCreateSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  artist: Joi.string().min(1).max(255).required(),
  coverImage: Joi.string().optional(),
  releaseDate: Joi.string().optional(),
  description: Joi.string().optional(),
  songIds: Joi.array().items(Joi.string()).default([])
});

export const albumUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional(),
  artist: Joi.string().min(1).max(255).optional(),
  coverImage: Joi.string().optional(),
  releaseDate: Joi.string().optional(),
  description: Joi.string().optional(),
  songIds: Joi.array().items(Joi.string()).optional()
});

// User validation schemas
export const userFavoritesSchema = Joi.object({
  favoriteSongIds: Joi.array().items(Joi.string()).required()
}); 