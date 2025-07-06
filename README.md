# Pa-Pa-Power Audio Player

A full-stack audio player application with a Node.js/TypeScript backend and React frontend.

## Features

- 🎵 Audio file upload and playback
- 📝 Automatic metadata extraction from audio files
- 🖼️ Album cover extraction and display
- 📚 Playlist management
- 🎼 Album organization
- 👤 User authentication and favorites
- 🔒 JWT-based authentication
- 💾 SQLite database for data persistence

## Backend Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

#### Songs
- `POST /api/songs/upload` - Upload audio file (requires auth)
- `GET /api/songs` - Get all songs
- `GET /api/songs/:id` - Get song by ID
- `DELETE /api/songs/:id` - Delete song (requires auth)

#### Playlists
- `POST /api/playlists` - Create playlist (requires auth)
- `GET /api/playlists` - Get all playlists
- `PUT /api/playlists/:id` - Update playlist (requires auth)

#### Albums
- `POST /api/albums` - Create album (requires auth)
- `GET /api/albums` - Get all albums

#### User
- `PUT /api/users/favorites` - Update user favorites (requires auth)

## Database Schema

The application uses SQLite with the following tables:

- **songs**: Audio file metadata and file paths
- **playlists**: User-created playlists with song references
- **albums**: Album information and song collections
- **users**: User accounts and authentication data

## File Structure

```
server/
├── src/
│   ├── configs/
│   │   ├── database.ts      # Database configuration
│   │   ├── environment.ts   # Environment variables
│   │   └── multer.ts        # File upload configuration
│   ├── database/
│   │   └── database.ts      # Database operations
│   ├── middlewares/
│   │   ├── auth.ts          # JWT authentication middleware
│   │   └── errorHandler.ts  # Error handling middleware
│   ├── routes/
│   │   ├── auth.ts          # Authentication routes
│   │   ├── songs.ts         # Song management routes
│   │   ├── playlists.ts     # Playlist management routes
│   │   ├── albums.ts        # Album management routes
│   │   ├── users.ts         # User management routes
│   │   └── index.ts         # Route aggregator
│   ├── services/
│   │   └── audioService.ts  # Audio file processing
│   ├── types/
│   │   └── index.ts         # TypeScript interfaces
│   └── index.ts             # Main Express server
├── uploads/                 # Uploaded audio files and covers
├── data/                    # SQLite database file
└── package.json
```

## Supported Audio Formats

- MP3
- WAV
- FLAC
- M4A
- AAC
- OGG

## Development

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

### Environment Variables
- `PORT` - Server port (default: 3001)
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment mode (development/production)

## Architecture

The backend follows a modular architecture with clear separation of concerns:

- **Configs**: Configuration files for database, environment variables, and file uploads
- **Middlewares**: Authentication and error handling middleware
- **Routes**: API endpoints organized by feature (auth, songs, playlists, albums, users)
- **Services**: Business logic for audio file processing
- **Database**: Data access layer with SQLite operations
- **Types**: TypeScript interfaces and type definitions

This structure makes the codebase maintainable, testable, and scalable.

## Next Steps

1. Set up the React frontend in the `client/` directory
2. Implement real-time audio streaming
3. Add search and filtering capabilities
4. Implement user profile management
5. Add social features (sharing playlists, following users) 