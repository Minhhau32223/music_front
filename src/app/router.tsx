import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { AppShell } from '@/components/layout/AppShell'
import { GuestRoute } from '@/features/auth/components/GuestRoute'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { RoleRoute } from '@/features/auth/components/RoleRoute'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import {
  AlbumDetailPage,
  DiscoverPage,
  ArtistDetailPage,
  LazyPage,
  LibraryPage,
  LikedSongsPage,
  ProfilePage,
  NotFoundPage,
  ApplicationPage,
  ArtistWorkspace,
  AdminWorkspace,
  PlaylistPage,
  SearchPage,
  SongPage,
  UIPlaygroundPage,
} from './lazy-pages'

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
    element: <Outlet />,
    children: [
      {
        path: '/',
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/home" replace /> },
          { path: 'home', element: <HomePage /> },
          {
            path: 'search',
            element: (
              <LazyPage>
                <SearchPage />
              </LazyPage>
            ),
          },
          {
            path: 'album/:albumId',
            element: (
              <LazyPage>
                <AlbumDetailPage />
              </LazyPage>
            ),
          },
          {
            path: 'artist/:artistId',
            element: (
              <LazyPage>
                <ArtistDetailPage />
              </LazyPage>
            ),
          },
          {
            path: 'song/:songId',
            element: (
              <LazyPage>
                <SongPage />
              </LazyPage>
            ),
          },
          {
            element: <ProtectedRoute />,
            children: [
              {
                path: 'library',
                element: (
                  <LazyPage>
                    <LibraryPage />
                  </LazyPage>
                ),
              },
              {
                path: 'liked-songs',
                element: (
                  <LazyPage>
                    <LikedSongsPage />
                  </LazyPage>
                ),
              },
              {
                path: 'profile',
                element: (
                  <LazyPage>
                    <ProfilePage />
                  </LazyPage>
                ),
              },
              {
                path: 'artist-application',
                element: (
                  <LazyPage>
                    <ApplicationPage />
                  </LazyPage>
                ),
              },
              {
                element: <RoleRoute role="ARTIST" />,
                children: [
                  {
                    path: 'studio',
                    element: (
                      <LazyPage>
                        <ArtistWorkspace />
                      </LazyPage>
                    ),
                  },
                ],
              },
              {
                element: <RoleRoute role="ADMIN" />,
                children: [
                  {
                    path: 'admin',
                    element: (
                      <LazyPage>
                        <AdminWorkspace />
                      </LazyPage>
                    ),
                  },
                ],
              },
            ],
          },
          {
            path: 'playlist/:playlistId',
            element: (
              <LazyPage>
                <PlaylistPage />
              </LazyPage>
            ),
          },
          {
            path: 'discover',
            element: (
              <LazyPage>
                <DiscoverPage />
              </LazyPage>
            ),
          },
          ...(import.meta.env.DEV
            ? [
                {
                  path: 'dev/ui',
                  element: (
                    <LazyPage>
                      <UIPlaygroundPage />
                    </LazyPage>
                  ),
                },
              ]
            : []),
          {
            path: '*',
            element: (
              <LazyPage>
                <NotFoundPage />
              </LazyPage>
            ),
          },
        ],
      },
    ],
  },
])
