# Pa-Pa-Power Audio Player 🎵

A modern, full-stack audio player application built with React, TypeScript, and Node.js. Features a beautiful Material-UI interface with real-time audio playback, playlist management, and album organization.

![Pa-Pa-Power Audio Player](https://img.shields.io/badge/React-19.1.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Material-UI](https://img.shields.io/badge/Material--UI-7.2.0-purple?logo=material-ui)

## ✨ Features

### 🎵 Audio Management
- **File Upload**: Drag & drop audio file upload with progress tracking
- **Multi-format Support**: MP3, WAV, FLAC, M4A, AAC, OGG
- **Metadata Extraction**: Automatic extraction of title, artist, album, duration, and cover art
- **Real-time Playback**: Seamless audio streaming with controls

### 📚 Organization
- **Playlists**: Create, edit, and manage custom playlists
- **Albums**: Organize songs into albums with cover art
- **Favorites**: Mark and manage favorite songs
- **Search & Filter**: Find songs by title, artist, or album

### 👤 User Experience
- **Authentication**: Secure JWT-based user registration and login
- **Responsive Design**: Beautiful Material-UI interface that works on all devices
- **Audio Player**: Persistent player with queue management
- **Notifications**: Real-time feedback for user actions

### 🔧 Technical Features
- **TypeScript**: Full type safety across frontend and backend
- **Redux Toolkit**: State management with persistence
- **Real-time Updates**: Live synchronization between components
- **Error Handling**: Comprehensive error boundaries and validation

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd pa-pa-power
```

2. **Install backend dependencies**
```bash
cd ./server
npm install
```

3. **Set up backend environment**
```bash
# Create .env file in server directory
cp .env.example .env
```

Edit the `.env` file:
```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

4. **Install frontend dependencies**
```bash
cd ./client
npm install
```

5. **Start the development servers**

In the server directory:
```bash
npm run dev
```

In the client directory (new terminal):
```bash
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 📁 Project Structure

```
pa-pa-power/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── features/   # Feature-specific components
│   │   │   │   ├── albums/ # Album management
│   │   │   │   ├── audio/  # Audio player components
│   │   │   │   ├── auth/   # Authentication components
│   │   │   │   ├── playlists/ # Playlist management
│   │   │   │   └── songs/  # Song management
│   │   │   ├── Layout/     # Layout components
│   │   │   ├── shared/     # Shared utilities
│   │   │   └── ui/         # Base UI components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── configs/        # Configuration files
│   │   ├── database/       # Database operations
│   │   ├── middlewares/    # Express middlewares
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── types/          # TypeScript types
│   ├── uploads/            # Uploaded files
│   └── data/               # SQLite database
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React 19.1.0** - UI library
- **TypeScript 5.8.3** - Type safety
- **Material-UI 7.2.0** - Component library
- **Redux Toolkit 2.8.2** - State management
- **React Router 7.6.3** - Navigation
- **Axios 1.10.0** - HTTP client
- **Vite 7.0.0** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express 4.18.2** - Web framework
- **TypeScript 5.1.6** - Type safety
- **SQLite 5.1.6** - Database
- **JWT 9.0.2** - Authentication
- **Multer 1.4.5** - File uploads
- **Music-metadata 7.13.0** - Audio metadata extraction
- **Sharp 0.32.6** - Image processing

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Songs
- `POST /api/songs/upload` - Upload audio file
- `GET /api/songs` - Get all songs
- `GET /api/songs/:id` - Get song by ID
- `PUT /api/songs/:id` - Update song
- `DELETE /api/songs/:id` - Delete song

### Playlists
- `POST /api/playlists` - Create playlist
- `GET /api/playlists` - Get all playlists
- `GET /api/playlists/:id` - Get playlist by ID
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist

### Albums
- `POST /api/albums` - Create album
- `GET /api/albums` - Get all albums
- `GET /api/albums/:id` - Get album by ID
- `PUT /api/albums/:id` - Update album
- `DELETE /api/albums/:id` - Delete album

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/favorites` - Update favorites
- `PUT /api/users/profile` - Update profile

## 🎯 Key Features Explained

### Audio Player
- **Persistent Player**: Continues playing when navigating between pages
- **Queue Management**: Add/remove songs from queue
- **Playback Controls**: Play, pause, skip, volume control
- **Progress Tracking**: Real-time progress bar with seeking

### File Upload
- **Drag & Drop**: Intuitive file upload interface
- **Progress Tracking**: Visual upload progress
- **Metadata Extraction**: Automatic extraction of audio metadata
- **Cover Art Processing**: Automatic cover art extraction and optimization

### State Management
- **Redux Toolkit**: Centralized state management
- **Redux Persist**: Persistent state across sessions
- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Comprehensive error management

## 🔧 Development

### Available Scripts

#### Frontend (client/)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

#### Backend (server/)
```bash
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
```

### Environment Variables

#### Backend (.env)
```env
PORT=3001                                    # Server port
JWT_SECRET=your-secret-key                  # JWT signing secret
NODE_ENV=development                        # Environment mode
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api      # Backend API URL
```

## 🗄️ Database Schema

### Tables
- **users**: User accounts and authentication
- **songs**: Audio file metadata and file paths
- **playlists**: User-created playlists
- **playlist_songs**: Many-to-many relationship between playlists and songs
- **albums**: Album information
- **album_songs**: Many-to-many relationship between albums and songs

## 🚀 Deployment

### Backend Deployment
1. Build the TypeScript code: `npm run build`
2. Set production environment variables
3. Start the server: `npm start`

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist/` folder to your hosting service
3. Configure environment variables for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## 🔮 Roadmap

- [ ] Real-time collaboration features
- [ ] Advanced audio effects and equalizer
- [ ] Social features (sharing, following)
- [ ] Mobile app development
- [ ] Cloud storage integration
- [ ] Advanced search and recommendations
- [ ] Podcast support
- [ ] Offline mode

---

**Built with ❤️ using React, TypeScript, and Node.js** 