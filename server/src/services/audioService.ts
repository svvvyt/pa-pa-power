import { parseFile } from 'music-metadata';
import { AudioMetadata } from '../types';
import path from 'path';
import fs from 'fs';

export class AudioService {
  static async extractMetadata(filePath: string): Promise<AudioMetadata> {
    try {
      const metadata = await parseFile(filePath);
      
      return {
        title: metadata.common.title || path.basename(filePath, path.extname(filePath)),
        artist: metadata.common.artist || 'Unknown Artist',
        album: metadata.common.album || 'Unknown Album',
        duration: metadata.format.duration ? Math.round(metadata.format.duration) : 0,
        year: metadata.common.year,
        genre: metadata.common.genre?.[0],
        track: metadata.common.track?.no || undefined,
        disk: metadata.common.disk?.no || undefined
      };
    } catch (error) {
      console.error('Error extracting metadata:', error);
      return {
        title: path.basename(filePath, path.extname(filePath)),
        artist: 'Unknown Artist',
        album: 'Unknown Album',
        duration: 0
      };
    }
  }

  static async saveAlbumCover(coverData: Buffer, fileName: string): Promise<string> {
    const uploadsDir = path.join(__dirname, '../../uploads/covers');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, coverData);
    
    return `/uploads/covers/${fileName}`;
  }

  static async extractAlbumCover(filePath: string): Promise<Buffer | null> {
    try {
      const metadata = await parseFile(filePath);
      return metadata.common.picture?.[0]?.data || null;
    } catch (error) {
      console.error('Error extracting album cover:', error);
      return null;
    }
  }

  static formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  static isValidAudioFile(fileName: string): boolean {
    const validExtensions = ['.mp3', '.wav', '.flac', '.m4a', '.aac', '.ogg'];
    const extension = path.extname(fileName).toLowerCase();
    return validExtensions.includes(extension);
  }
} 