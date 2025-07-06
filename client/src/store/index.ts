import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { audioApi } from './api/audioApi';
import { playlistApi } from './api/playlistApi';
import { albumApi } from './api/albumApi';
import { authApi } from './api/authApi';
import authReducer from './slices/authSlice';
import audioPlayerReducer from './slices/audioPlayerSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    audioPlayer: audioPlayerReducer,
    ui: uiReducer,
    [audioApi.reducerPath]: audioApi.reducer,
    [playlistApi.reducerPath]: playlistApi.reducer,
    [albumApi.reducerPath]: albumApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(
      audioApi.middleware,
      playlistApi.middleware,
      albumApi.middleware,
      authApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 