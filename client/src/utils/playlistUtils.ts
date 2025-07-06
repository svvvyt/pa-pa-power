export function getPlaylistCoverUrl(coverPath?: string) {
  if (!coverPath) return '/default-playlist-cover.jpg';
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  return coverPath.startsWith('http') ? coverPath : `${baseUrl}${coverPath}`;
} 