import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Album, Song } from '../../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const albumApi = createApi({
  reducerPath: 'albumApi',
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
  tagTypes: ['Album'],
  endpoints: (builder) => ({
    // Get all albums
    getAlbums: builder.query<Album[], void>({
      query: () => '/api/albums',
      providesTags: ['Album'],
    }),

    // Get album by ID
    getAlbum: builder.query<Album, string>({
      query: (id) => `/api/albums/${id}`,
      providesTags: (result, error, id) => [{ type: 'Album', id }],
    }),

    // Create album
    createAlbum: builder.mutation<Album, Omit<Album, 'id' | 'createdAt' | 'updatedAt'>>({
      query: (album) => ({
        url: '/api/albums',
        method: 'POST',
        body: album,
      }),
      invalidatesTags: ['Album'],
    }),

    // Update album
    updateAlbum: builder.mutation<Album, { id: string; updates: Partial<Album> }>({
      query: ({ id, updates }) => ({
        url: `/api/albums/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Album', id }],
    }),

    // Delete album
    deleteAlbum: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/albums/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Album'],
    }),
  }),
});

export const {
  useGetAlbumsQuery,
  useGetAlbumQuery,
  useCreateAlbumMutation,
  useUpdateAlbumMutation,
  useDeleteAlbumMutation,
} = albumApi; 