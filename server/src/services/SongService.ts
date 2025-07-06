import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { Song } from '../types';
import { AudioService } from './audioService';
import { db } from '../configs/database';
import { NotFoundError, ValidationError, InternalServerError, AppError } from '../types/errors';

export class SongService {
  static async uploadSong(file: Express.Multer.File): Promise<Song> {
    try {
      if (!file) {
        throw new ValidationError('No audio file provided');
      }

      if (!AudioService.isValidAudioFile(file.originalname)) {
        throw new ValidationError('Invalid audio file format');
      }

      const filePath = file.path;
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
        title: metadata.title || file.originalname,
        artist: metadata.artist || 'Unknown Artist',
        album: metadata.album || 'Unknown Album',
        duration: metadata.duration || 0,
        filePath: `/uploads/audio/${file.filename}`,
        albumCover: albumCoverPath,
        releaseDate: metadata.year?.toString(),
        albumDescription: '',
        lyrics: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await db.createSong(song);
      return song;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError('Failed to upload song');
    }
  }

  static async getAllSongs(): Promise<Song[]> {
    try {
      return await db.getAllSongs();
    } catch (error) {
      throw new InternalServerError('Failed to fetch songs');
    }
  }

  static async getSongById(id: string): Promise<Song> {
    try {
      const song = await db.getSongById(id);
      if (!song) {
        throw new NotFoundError('Song');
      }
      return song;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError('Failed to fetch song');
    }
  }

  static async updateSong(id: string, updateData: Partial<Song>): Promise<Song> {
    try {
      const song = await db.getSongById(id);
      if (!song) {
        throw new NotFoundError('Song');
      }

      // Only allow updating certain fields
      const allowedFields = ['title', 'artist', 'album', 'lyrics', 'albumDescription'];
      for (const field of allowedFields) {
        if (updateData[field as keyof Song] !== undefined) {
          (song as any)[field] = updateData[field as keyof Song];
        }
      }
      
      song.updatedAt = new Date().toISOString();
      await db.updateSong(song);
      return song;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError('Failed to update song');
    }
  }

  static async deleteSong(id: string): Promise<void> {
    try {
      const song = await db.getSongById(id);
      if (!song) {
        throw new NotFoundError('Song');
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

      await db.deleteSong(id);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError('Failed to delete song');
    }
  }
} 