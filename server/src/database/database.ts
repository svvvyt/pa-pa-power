import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { Song, Playlist, Album, User } from '../types';

class Database {
  private db: sqlite3.Database;

  constructor() {
    const dbPath = path.join(__dirname, '../../data/audio_player.db');
    const dbDir = path.dirname(dbPath);
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    this.db = new sqlite3.Database(dbPath);
    this.init();
  }

  private init(): void {
    this.db.serialize(() => {
      // Create songs table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS songs (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          artist TEXT NOT NULL,
          album TEXT NOT NULL,
          duration INTEGER NOT NULL,
          filePath TEXT NOT NULL,
          albumCover TEXT,
          releaseDate TEXT,
          albumDescription TEXT,
          lyrics TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        )
      `);

      // Create playlists table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS playlists (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          coverImage TEXT,
          songIds TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        )
      `);

      // Create albums table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS albums (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          artist TEXT NOT NULL,
          coverImage TEXT,
          releaseDate TEXT,
          description TEXT,
          songIds TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        )
      `);

      // Create users table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          favoriteSongIds TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        )
      `);
    });
  }

  // Song methods
  async createSong(song: Song): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO songs (id, title, artist, album, duration, filePath, albumCover, releaseDate, albumDescription, lyrics, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [song.id, song.title, song.artist, song.album, song.duration, song.filePath, song.albumCover, song.releaseDate, song.albumDescription, song.lyrics, song.createdAt, song.updatedAt],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async getAllSongs(): Promise<Song[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM songs ORDER BY createdAt DESC', (err, rows: any[]) => {
        if (err) reject(err);
        else resolve(rows as Song[]);
      });
    });
  }

  async getSongById(id: string): Promise<Song | null> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM songs WHERE id = ?', [id], (err, row: any) => {
        if (err) reject(err);
        else resolve(row as Song || null);
      });
    });
  }

  async updateSong(song: Song): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE songs SET title = ?, artist = ?, album = ?, duration = ?, filePath = ?, albumCover = ?, releaseDate = ?, albumDescription = ?, lyrics = ?, updatedAt = ?
         WHERE id = ?`,
        [song.title, song.artist, song.album, song.duration, song.filePath, song.albumCover, song.releaseDate, song.albumDescription, song.lyrics, song.updatedAt, song.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async deleteSong(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM songs WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Playlist methods
  async createPlaylist(playlist: Playlist): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO playlists (id, name, description, coverImage, songIds, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [playlist.id, playlist.name, playlist.description, playlist.coverImage, JSON.stringify(playlist.songIds), playlist.createdAt, playlist.updatedAt],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async getAllPlaylists(): Promise<Playlist[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM playlists ORDER BY createdAt DESC', (err, rows: any[]) => {
        if (err) reject(err);
        else {
          const playlists = rows.map((row: any) => ({
            ...row,
            songIds: JSON.parse(row.songIds)
          }));
          resolve(playlists as Playlist[]);
        }
      });
    });
  }

  async getPlaylistById(id: string): Promise<Playlist | null> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM playlists WHERE id = ?', [id], (err, row: any) => {
        if (err) reject(err);
        else {
          if (row) {
            const playlist = {
              ...row,
              songIds: JSON.parse(row.songIds)
            };
            resolve(playlist as Playlist);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  async updatePlaylist(playlist: Playlist): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE playlists SET name = ?, description = ?, coverImage = ?, songIds = ?, updatedAt = ?
         WHERE id = ?`,
        [playlist.name, playlist.description, playlist.coverImage, JSON.stringify(playlist.songIds), playlist.updatedAt, playlist.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async deletePlaylist(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM playlists WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Album methods
  async createAlbum(album: Album): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO albums (id, name, artist, coverImage, releaseDate, description, songIds, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [album.id, album.name, album.artist, album.coverImage, album.releaseDate, album.description, JSON.stringify(album.songIds), album.createdAt, album.updatedAt],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async getAllAlbums(): Promise<Album[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM albums ORDER BY createdAt DESC', (err, rows: any[]) => {
        if (err) reject(err);
        else {
          const albums = rows.map((row: any) => ({
            ...row,
            songIds: JSON.parse(row.songIds)
          }));
          resolve(albums as Album[]);
        }
      });
    });
  }

  async getAlbumById(id: string): Promise<Album | null> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM albums WHERE id = ?', [id], (err, row: any) => {
        if (err) reject(err);
        else {
          if (row) {
            const album = {
              ...row,
              songIds: JSON.parse(row.songIds)
            };
            resolve(album as Album);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  async updateAlbum(album: Album): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE albums SET name = ?, artist = ?, coverImage = ?, releaseDate = ?, description = ?, songIds = ?, updatedAt = ?
         WHERE id = ?`,
        [album.name, album.artist, album.coverImage, album.releaseDate, album.description, JSON.stringify(album.songIds), album.updatedAt, album.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async deleteAlbum(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM albums WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // User methods
  async createUser(user: User): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO users (id, username, email, password, favoriteSongIds, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user.id, user.username, user.email, user.password, JSON.stringify(user.favoriteSongIds), user.createdAt, user.updatedAt],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM users WHERE email = ?', [email], (err, row: any) => {
        if (err) reject(err);
        else {
          if (row) {
            const user = {
              ...row,
              favoriteSongIds: JSON.parse(row.favoriteSongIds)
            };
            resolve(user as User);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  async updateUserFavorites(userId: string, favoriteSongIds: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE users SET favoriteSongIds = ?, updatedAt = ? WHERE id = ?',
        [JSON.stringify(favoriteSongIds), new Date().toISOString(), userId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
}

export default new Database(); 