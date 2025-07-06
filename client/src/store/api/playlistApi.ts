import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Playlist, Song } from '../../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const playlistApi = createApi({
  reducerPath: 'playlistApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Playlist'],
  endpoints: (builder) => ({
    // Get all playlists
    getPlaylists: builder.query<Playlist[], void>({
      query: () => '/api/playlists',
      providesTags: ['Playlist'],
    }),

    // Get playlist by ID
    getPlaylist: builder.query<Playlist, string>({
      query: (id) => `/api/playlists/${id}`,
      providesTags: (result, error, id) => [{ type: 'Playlist', id }],
    }),

    // Create playlist
    createPlaylist: builder.mutation<Playlist, Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>>({
      query: (playlist) => ({
        url: '/api/playlists',
        method: 'POST',
        body: playlist,
      }),
      invalidatesTags: ['Playlist'],
    }),

    // Update playlist
    updatePlaylist: builder.mutation<Playlist, { id: string; updates: Partial<Playlist> }>({
      query: ({ id, updates }) => ({
        url: `/api/playlists/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Playlist', id }],
    }),

    // Delete playlist
    deletePlaylist: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/playlists/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Playlist'],
    }),

    // Add song to playlist
    addSongToPlaylist: builder.mutation<Playlist, { playlistId: string; songId: string }>({
      query: ({ playlistId, songId }) => ({
        url: `/api/playlists/${playlistId}/songs`,
        method: 'POST',
        body: { songId },
      }),
      invalidatesTags: (result, error, { playlistId }) => [{ type: 'Playlist', id: playlistId }],
    }),

    // Remove song from playlist
    removeSongFromPlaylist: builder.mutation<Playlist, { playlistId: string; songId: string }>({
      query: ({ playlistId, songId }) => ({
        url: `/api/playlists/${playlistId}/songs/${songId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { playlistId }) => [{ type: 'Playlist', id: playlistId }],
    }),
  }),
});

export const {
  useGetPlaylistsQuery,
  useGetPlaylistQuery,
  useCreatePlaylistMutation,
  useUpdatePlaylistMutation,
  useDeletePlaylistMutation,
  useAddSongToPlaylistMutation,
  useRemoveSongFromPlaylistMutation,
} = playlistApi; 