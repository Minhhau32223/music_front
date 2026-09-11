import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { AppShell } from '@/components/layout/AppShell'
import { GuestRoute } from '@/features/auth/components/GuestRoute'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { AlbumDetailPage } from '@/pages/AlbumDetailPage'
import { ArtistDetailPage } from '@/pages/ArtistDetailPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { SearchPage } from '@/pages/SearchPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { UIPlaygroundPage } from '@/pages/UIPlaygroundPage'
import { SongPage } from '@/pages/SongPage'
import { LibraryPage } from '@/pages/LibraryPage'
import { LikedSongsPage } from '@/pages/LikedSongsPage'
import { PlaylistPage } from '@/pages/PlaylistPage'

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/home" replace /> },
          { path: 'home', element: <HomePage /> },
          { path: 'search', element: <SearchPage /> },
          { path: 'album/:albumId', element: <AlbumDetailPage /> },
          { path: 'artist/:artistId', element: <ArtistDetailPage /> },
          { path: 'song/:songId', element: <SongPage /> },
          { path: 'library', element: <LibraryPage /> },
          { path: 'liked-songs', element: <LikedSongsPage /> },
          { path: 'playlist/:playlistId', element: <PlaylistPage /> },
          { path: 'discover', element: <SearchPage /> },
          { path: 'profile', element: <PlaceholderPage /> },
          { path: 'dev/ui', element: <UIPlaygroundPage /> },
          { path: '*', element: <PlaceholderPage /> },
        ],
      },
    ],
  },
])
