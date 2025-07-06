import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Song, ApiResponse } from '../../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const audioApi = createApi({
  reducerPath: 'audioApi',
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
  tagTypes: ['Song', 'Playlist'],
  endpoints: (builder) => ({
    // Get all songs
    getSongs: builder.query<Song[], void>({
      query: () => '/api/songs',
      providesTags: ['Song'],
    }),

    // Get song by ID
    getSong: builder.query<Song, string>({
      query: (id) => `/api/songs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Song', id }],
    }),

    // Upload song
    uploadSong: builder.mutation<Song, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append('audio', file);
        return {
          url: '/api/songs/upload',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Song'],
    }),

    // Delete song
    deleteSong: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/songs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Song'],
    }),

    // Update song metadata
    updateSong: builder.mutation<Song, { id: string; updates: Partial<Song> }>({
      query: ({ id, updates }) => ({
        url: `/api/songs/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Song', id }],
    }),
  }),
});

export const {
  useGetSongsQuery,
  useGetSongQuery,
  useUploadSongMutation,
  useDeleteSongMutation,
  useUpdateSongMutation,
} = audioApi; 