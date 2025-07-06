import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService, ApiError, NetworkError } from '../services/api';
import type { Song, Playlist, Album, LoginCredentials, RegisterCredentials } from '../types';

// Generic hook for data fetching
export function useApiData<T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof NetworkError) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchFunction]);

  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { data, loading, error, refresh };
}

// Songs hooks
export function useSongs() {
  return useApiData(() => apiService.getSongs(), []);
}

export function useGetSongs() {
  return useApiData(() => apiService.getSongs(), []);
}

export function useSong(id: string) {
  return useApiData(() => apiService.getSong(id), [id]);
}

// Playlists hooks
export function usePlaylists() {
  return useApiData(() => apiService.getPlaylists(), []);
}

export function useGetPlaylists() {
  return useApiData(() => apiService.getPlaylists(), []);
}

export function usePlaylist(id: string) {
  return useApiData(() => apiService.getPlaylist(id), [id]);
}

// Albums hooks
export function useAlbums() {
  return useApiData(() => apiService.getAlbums(), []);
}

export function useGetAlbums() {
  return useApiData(() => apiService.getAlbums(), []);
}

export function useAlbum(id: string) {
  return useApiData(() => apiService.getAlbum(id), [id]);
}

// Mutation hooks
export function useApiMutation<T, P>(
  mutationFunction: (params: P) => Promise<T>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (params: P): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFunction(params);
      return result;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof NetworkError) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [mutationFunction]);

  return { mutate, loading, error };
}

// Auth mutations
export function useLogin() {
  return useApiMutation((credentials: LoginCredentials) => 
    apiService.login(credentials)
  );
}

export function useRegister() {
  return useApiMutation((credentials: RegisterCredentials) => 
    apiService.register(credentials)
  );
}

// Song mutations
export function useUploadSong() {
  return useApiMutation((file: File) => apiService.uploadSong(file));
}

export function useUpdateSong() {
  return useApiMutation(({ id, updates }: { id: string; updates: Partial<Song> }) => 
    apiService.updateSong(id, updates)
  );
}

export function useDeleteSong() {
  return useApiMutation((id: string) => apiService.deleteSong(id));
}

// Playlist mutations
export function useCreatePlaylist() {
  return useApiMutation((playlist: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiService.createPlaylist(playlist)
  );
}

export function useUpdatePlaylist() {
  return useApiMutation(({ id, updates }: { id: string; updates: Partial<Playlist> }) => 
    apiService.updatePlaylist(id, updates)
  );
}

export function useDeletePlaylist() {
  return useApiMutation((id: string) => apiService.deletePlaylist(id));
}

// Album mutations
export function useCreateAlbum() {
  return useApiMutation((album: Omit<Album, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiService.createAlbum(album)
  );
}

export function useUpdateAlbum() {
  return useApiMutation(({ id, updates }: { id: string; updates: Partial<Album> }) => 
    apiService.updateAlbum(id, updates)
  );
}

export function useDeleteAlbum() {
  return useApiMutation((id: string) => apiService.deleteAlbum(id));
} 