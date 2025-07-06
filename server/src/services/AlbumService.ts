import { v4 as uuidv4 } from 'uuid';
import { Album } from '../types';
import { db } from '../configs/database';
import { NotFoundError, ValidationError, InternalServerError, AppError } from '../types/errors';

export class AlbumService {
  static async createAlbum(albumData: { name: string; artist: string; coverImage?: string; releaseDate?: string; description?: string; songIds?: string[] }): Promise<Album> {
    try {
      const album: Album = {
        id: uuidv4(),
        name: albumData.name,
        artist: albumData.artist,
        coverImage: albumData.coverImage,
        releaseDate: albumData.releaseDate,
        description: albumData.description,
        songIds: albumData.songIds || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await db.createAlbum(album);
      return album;
    } catch (error) {
      throw new InternalServerError('Failed to create album');
    }
  }

  static async getAllAlbums(): Promise<Album[]> {
    try {
      return await db.getAllAlbums();
    } catch (error) {
      throw new InternalServerError('Failed to fetch albums');
    }
  }

  static async getAlbumById(id: string): Promise<Album> {
    try {
      const album = await db.getAlbumById(id);
      if (!album) {
        throw new NotFoundError('Album');
      }
      return album;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError('Failed to fetch album');
    }
  }

  static async updateAlbum(id: string, updateData: Partial<Album>): Promise<Album> {
    try {
      const album = await db.getAlbumById(id);
      if (!album) {
        throw new NotFoundError('Album');
      }

      // Update allowed fields
      const allowedFields = ['name', 'artist', 'coverImage', 'releaseDate', 'description', 'songIds'];
      for (const field of allowedFields) {
        if (updateData[field as keyof Album] !== undefined) {
          (album as any)[field] = updateData[field as keyof Album];
        }
      }
      
      album.updatedAt = new Date().toISOString();
      await db.updateAlbum(album);
      return album;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError('Failed to update album');
    }
  }

  static async deleteAlbum(id: string): Promise<void> {
    try {
      const album = await db.getAlbumById(id);
      if (!album) {
        throw new NotFoundError('Album');
      }

      await db.deleteAlbum(id);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError('Failed to delete album');
    }
  }

  static async addSongToAlbum(albumId: string, songId: string): Promise<Album> {
    try {
      const album = await db.getAlbumById(albumId);
      if (!album) {
        throw new NotFoundError('Album');
      }

      if (!album.songIds.includes(songId)) {
        album.songIds.push(songId);
        album.updatedAt = new Date().toISOString();
        await db.updateAlbum(album);
      }

      return album;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError('Failed to add song to album');
    }
  }

  static async removeSongFromAlbum(albumId: string, songId: string): Promise<Album> {
    try {
      const album = await db.getAlbumById(albumId);
      if (!album) {
        throw new NotFoundError('Album');
      }

      album.songIds = album.songIds.filter(id => id !== songId);
      album.updatedAt = new Date().toISOString();
      await db.updateAlbum(album);

      return album;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError('Failed to remove song from album');
    }
  }
} 