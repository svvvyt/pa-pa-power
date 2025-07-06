export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  filePath: string;
  albumCover?: string;
  releaseDate?: string;
  albumDescription?: string;
  lyrics?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  songIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  coverImage?: string;
  releaseDate?: string;
  description?: string;
  songIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  favoriteSongIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AudioMetadata {
  title?: string;
  artist?: string;
  album?: string;
  duration?: number;
  year?: number;
  genre?: string;
  track?: number;
  disk?: number;
} 