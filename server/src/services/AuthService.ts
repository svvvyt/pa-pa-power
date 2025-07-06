import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types';
import { db } from '../configs/database';
import { config } from '../configs/environment';
import { ValidationError, AuthenticationError, ConflictError, InternalServerError, AppError } from '../types/errors';

export class AuthService {
  static async registerUser(userData: { username: string; email: string; password: string }): Promise<{ token: string; user: Partial<User> }> {
    try {
      const { username, email, password } = userData;

      // Check if user already exists
      const existingUser = await db.getUserByEmail(email);
      if (existingUser) {
        throw new ConflictError('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user: User = {
        id: uuidv4(),
        username,
        email,
        password: hashedPassword,
        favoriteSongIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await db.createUser(user);
      
      const token = jwt.sign({ userId: user.id, email: user.email }, config.JWT_SECRET);
      return { 
        token, 
        user: { id: user.id, username, email } 
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError('Failed to register user');
    }
  }

  static async loginUser(credentials: { email: string; password: string }): Promise<{ token: string; user: Partial<User> }> {
    try {
      const { email, password } = credentials;

      const user = await db.getUserByEmail(email);
      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new AuthenticationError('Invalid credentials');
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, config.JWT_SECRET);
      return { 
        token, 
        user: { id: user.id, username: user.username, email: user.email } 
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError('Failed to login user');
    }
  }

  static async updateUserFavorites(userId: string, favoriteSongIds: string[]): Promise<void> {
    try {
      await db.updateUserFavorites(userId, favoriteSongIds);
    } catch (error) {
      throw new InternalServerError('Failed to update user favorites');
    }
  }
} 