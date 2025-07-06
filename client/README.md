# Pa-Pa-Power Frontend

A modern React + TypeScript frontend for the Pa-Pa-Power audio player application.

## Features

- 🎵 **Modern UI**: Built with Material-UI for a beautiful, responsive interface
- 🔐 **Authentication**: JWT-based authentication with protected routes
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🎨 **Spotify-inspired Theme**: Clean, modern design with green accent colors
- ⚡ **Fast Development**: Built with Vite for lightning-fast development experience
- 🔒 **Type Safety**: Full TypeScript support for better development experience

## Tech Stack

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **Material-UI (MUI)** - React UI component library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see server README)

### Installation

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx          # Navigation header
│   │   └── Layout.tsx          # Main layout wrapper
│   └── ProtectedRoute.tsx      # Route protection component
├── contexts/
│   └── AuthContext.tsx         # Authentication context
├── pages/
│   ├── Home.tsx                # Landing page
│   ├── Login.tsx               # Login page
│   ├── Register.tsx            # Registration page
│   └── Songs.tsx               # Songs management page
├── services/
│   └── api.ts                  # API service layer
├── types/
│   └── index.ts                # TypeScript interfaces
├── App.tsx                     # Main app component
└── main.tsx                    # App entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Pages

### Home Page (`/`)
- Landing page with feature showcase
- Call-to-action for registration/login
- Responsive hero section

### Login Page (`/login`)
- User authentication form
- Error handling and validation
- Link to registration page

### Register Page (`/register`)
- User registration form
- Password confirmation
- Form validation

### Songs Page (`/songs`) - Protected
- Display uploaded songs
- Play/pause functionality (UI only)
- Delete songs
- Upload new songs (coming soon)

### Playlists Page (`/playlists`) - Protected
- Coming soon

### Albums Page (`/albums`) - Protected
- Coming soon

### Profile Page (`/profile`) - Protected
- Coming soon

## Authentication

The app uses JWT-based authentication with the following features:

- **Automatic Token Management**: Tokens are stored in localStorage
- **Protected Routes**: Unauthenticated users are redirected to login
- **Token Refresh**: Automatic logout on token expiration
- **Persistent Sessions**: Users stay logged in across browser sessions

## API Integration

The frontend communicates with the backend through a centralized API service:

- **Axios Interceptors**: Automatic token inclusion and error handling
- **Type-safe API Calls**: All API methods are fully typed
- **Error Handling**: Consistent error handling across the app
- **Loading States**: Built-in loading indicators

## Styling

The app uses Material-UI with a custom theme:

- **Spotify-inspired Colors**: Green primary color (#1db954)
- **Custom Components**: Enhanced buttons, cards, and forms
- **Responsive Grid**: Mobile-first responsive design
- **Consistent Spacing**: Standardized spacing and typography

## Development

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route to `src/App.tsx`
3. Update navigation in `src/components/Layout/Header.tsx`

### Adding New API Endpoints

1. Add the method to `src/services/api.ts`
2. Import and use in your components
3. Handle loading and error states

### Styling Guidelines

- Use Material-UI components when possible
- Follow the established color scheme
- Maintain consistent spacing (8px grid)
- Ensure responsive design

## Environment Variables

- `VITE_API_URL` - Backend API base URL (default: http://localhost:3001)

## Next Steps

1. Implement song upload functionality
2. Add real audio playback with HTML5 Audio API
3. Create playlist and album management pages
4. Add search and filtering capabilities
5. Implement user profile management
6. Add social features (sharing, following)

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Add proper error handling
4. Test on multiple screen sizes
5. Follow Material-UI design patterns
