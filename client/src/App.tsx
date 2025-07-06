import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, NotificationProvider, AudioPlayerProvider } from '@/contexts';
import { Layout, ProtectedRoute, ErrorBoundary } from '@/components';
import { Home, Login, Register, Songs, Playlists, Albums } from '@/pages';

function App() {
  return (
    <ErrorBoundary>
    <AuthProvider>
      <NotificationProvider>
        <AudioPlayerProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route
                  path="/songs"
                  element={
                    <ProtectedRoute>
                        <ErrorBoundary>
                      <Songs />
                        </ErrorBoundary>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/playlists"
                  element={
                    <ProtectedRoute>
                        <ErrorBoundary>
                      <Playlists />
                        </ErrorBoundary>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/albums"
                  element={
                    <ProtectedRoute>
                        <ErrorBoundary>
                      <Albums />
                        </ErrorBoundary>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                        <ErrorBoundary>
                      <div>Profile Page (Coming Soon)</div>
                        </ErrorBoundary>
                    </ProtectedRoute>
                  }
                />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </Router>
        </AudioPlayerProvider>
      </NotificationProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
