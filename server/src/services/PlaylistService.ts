import { v4 as uuidv4 } from 'uuid';
import { Playlist } from '../types';
import { db } from '../configs/database';
import { NotFoundError, ValidationError, InternalServerError, AppError } from '../types/errors';

export class PlaylistService {
  static async createPlaylist(playlistData: { name: string; description?: string; coverImage?: string; songIds?: string[] }): Promise<Playlist> {
    try {
      const playlist: Playlist = {
        id: uuidv4(),
        name: playlistData.name,
        description: playlistData.description,
        coverImage: playlistData.coverImage,
        songIds: playlistData.songIds || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await db.createPlaylist(playlist);
      return playlist;
    } catch (error) {
      throw new InternalServerError('Failed to create playlist');
    }
  }

  static async getAllPlaylists(): Promise<Playlist[]> {
    try {
      return await db.getAllPlaylists();
    } catch (error) {
      throw new InternalServerError('Failed to fetch playlists');
    }
  }

  static async getPlaylistById(id: string): Promise<Playlist> {
    try {
      const playlist = await db.getPlaylistById(id);
      if (!playlist) {
        throw new NotFoundError('Playlist');
      }
      return playlist;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError('Failed to fetch playlist');
    }
  }

  static async updatePlaylist(id: string, updateData: Partial<Playlist>): Promise<Playlist> {
    try {
      const playlist = await db.getPlaylistById(id);
      if (!playlist) {
        throw new NotFoundError('Playlist');
      }

      // Update allowed fields
      const allowedFields = ['name', 'description', 'coverImage', 'songIds'];
      for (const field of allowedFields) {
        if (updateData[field as keyof Playlist] !== undefined) {
          (playlist as any)[field] = updateData[field as keyof Playlist];
        }
      }
      
      playlist.updatedAt = new Date().toISOString();
      await db.updatePlaylist(playlist);
      return playlist;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError('Failed to update playlist');
    }
  }

  static async deletePlaylist(id: string): Promise<void> {
    try {
      const playlist = await db.getPlaylistById(id);
      if (!playlist) {
        throw new NotFoundError('Playlist');
      }

      await db.deletePlaylist(id);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError('Failed to delete playlist');
    }
  }

  static async addSongToPlaylist(playlistId: string, songId: string): Promise<Playlist> {
    try {
      const playlist = await db.getPlaylistById(playlistId);
      if (!playlist) {
        throw new NotFoundError('Playlist');
      }

      if (!playlist.songIds.includes(songId)) {
        playlist.songIds.push(songId);
        playlist.updatedAt = new Date().toISOString();
        await db.updatePlaylist(playlist);
      }

      return playlist;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError('Failed to add song to playlist');
    }
  }

  static async removeSongFromPlaylist(playlistId: string, songId: string): Promise<Playlist> {
    try {
      const playlist = await db.getPlaylistById(playlistId);
      if (!playlist) {
        throw new NotFoundError('Playlist');
      }

      playlist.songIds = playlist.songIds.filter(id => id !== songId);
      playlist.updatedAt = new Date().toISOString();
      await db.updatePlaylist(playlist);

      return playlist;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new InternalServerError('Failed to remove song from playlist');
    }
  }
} 