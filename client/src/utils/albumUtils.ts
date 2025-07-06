export function getAlbumCoverUrl(coverPath?: string) {
  if (!coverPath) return '/default-album-cover.jpg';
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  return coverPath.startsWith('http') ? coverPath : `${baseUrl}${coverPath}`;
} 