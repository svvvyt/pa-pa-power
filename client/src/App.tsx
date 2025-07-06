import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Songs from './pages/Songs';
import Playlists from './pages/Playlists';
import Albums from './pages/Albums';
import { AudioPlayerProvider } from './contexts/AudioPlayerContext';

function App() {
  return (
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
                      <Songs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/playlists"
                  element={
                    <ProtectedRoute>
                      <Playlists />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/albums"
                  element={
                    <ProtectedRoute>
                      <Albums />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <div>Profile Page (Coming Soon)</div>
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
  );
}

export default App;
