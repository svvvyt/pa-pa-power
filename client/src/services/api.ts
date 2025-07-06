import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import type { 
  Song, 
  Playlist, 
  Album, 
  User, 
  AuthUser, 
  LoginCredentials, 
  RegisterCredentials,
  ApiResponse 
} from '../types';

// Custom error types
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
}

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for authentication
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response) {
          // Server responded with error status
          const { status, data } = error.response;
          const message = (data as any)?.error?.message || error.message;
          return Promise.reject(new ApiError(status, message, data));
        } else if (error.request) {
          // Network error
          return Promise.reject(new NetworkError('Network error occurred'));
        } else {
          // Other error
          return Promise.reject(new Error(error.message));
        }
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<{ token: string; user: AuthUser }> {
    const response = await this.api.post('/api/auth/login', credentials);
    return response.data;
  }

  async register(credentials: RegisterCredentials): Promise<{ token: string; user: AuthUser }> {
    const response = await this.api.post('/api/auth/register', credentials);
    return response.data;
  }

  // Songs endpoints
  async getSongs(): Promise<Song[]> {
    const response = await this.api.get('/api/songs');
    return response.data;
  }

  async getSong(id: string): Promise<Song> {
    const response = await this.api.get(`/api/songs/${id}`);
    return response.data;
  }

  async uploadSong(file: File): Promise<Song> {
    const formData = new FormData();
    formData.append('audio', file);
    
    const response = await this.api.post('/api/songs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateSong(id: string, updates: Partial<Song>): Promise<Song> {
    const response = await this.api.patch(`/api/songs/${id}`, updates);
    return response.data;
  }

  async deleteSong(id: string): Promise<{ message: string }> {
    const response = await this.api.delete(`/api/songs/${id}`);
    return response.data;
  }

  // Playlists endpoints
  async getPlaylists(): Promise<Playlist[]> {
    const response = await this.api.get('/api/playlists');
    return response.data;
  }

  async getPlaylist(id: string): Promise<Playlist> {
    const response = await this.api.get(`/api/playlists/${id}`);
    return response.data;
  }

  async createPlaylist(playlist: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>): Promise<Playlist> {
    const response = await this.api.post('/api/playlists', playlist);
    return response.data;
  }

  async updatePlaylist(id: string, updates: Partial<Playlist>): Promise<Playlist> {
    const response = await this.api.put(`/api/playlists/${id}`, updates);
    return response.data;
  }

  async deletePlaylist(id: string): Promise<void> {
    await this.api.delete(`/api/playlists/${id}`);
  }

  async addSongToPlaylist(playlistId: string, songId: string): Promise<Playlist> {
    const response = await this.api.post(`/api/playlists/${playlistId}/songs/${songId}`);
    return response.data;
  }

  async removeSongFromPlaylist(playlistId: string, songId: string): Promise<Playlist> {
    const response = await this.api.delete(`/api/playlists/${playlistId}/songs/${songId}`);
    return response.data;
  }

  // Albums endpoints
  async getAlbums(): Promise<Album[]> {
    const response = await this.api.get('/api/albums');
    return response.data;
  }

  async getAlbum(id: string): Promise<Album> {
    const response = await this.api.get(`/api/albums/${id}`);
    return response.data;
  }

  async createAlbum(album: Omit<Album, 'id' | 'createdAt' | 'updatedAt'>): Promise<Album> {
    const response = await this.api.post('/api/albums', album);
    return response.data;
  }

  async updateAlbum(id: string, updates: Partial<Album>): Promise<Album> {
    const response = await this.api.put(`/api/albums/${id}`, updates);
    return response.data;
  }

  async deleteAlbum(id: string): Promise<void> {
    await this.api.delete(`/api/albums/${id}`);
  }

  // User endpoints
  async updateUserFavorites(userId: string, favoriteSongIds: string[]): Promise<void> {
    await this.api.put('/api/users/favorites', { favoriteSongIds });
  }
}

export const apiService = new ApiService();
export default apiService; 