import { lazy, Suspense, type ReactNode } from 'react'
import { LoadingState } from '@/components/shared/States'

export const AlbumDetailPage = lazy(() =>
  import('@/pages/AlbumDetailPage').then(({ AlbumDetailPage: Page }) => ({ default: Page })),
)
export const ArtistDetailPage = lazy(() =>
  import('@/pages/ArtistDetailPage').then(({ ArtistDetailPage: Page }) => ({ default: Page })),
)
export const SearchPage = lazy(() =>
  import('@/pages/PhaseSevenSearchPage').then(({ SearchPage: Page }) => ({ default: Page })),
)
export const DiscoverPage = lazy(() =>
  import('@/pages/PhaseSevenSearchPage').then(({ DiscoverPage: Page }) => ({ default: Page })),
)
export const SongPage = lazy(() =>
  import('@/pages/SongPage').then(({ SongPage: Page }) => ({ default: Page })),
)
export const LibraryPage = lazy(() =>
  import('@/pages/LibraryPage').then(({ LibraryPage: Page }) => ({ default: Page })),
)
export const LikedSongsPage = lazy(() =>
  import('@/pages/LikedSongsPage').then(({ LikedSongsPage: Page }) => ({ default: Page })),
)
export const PlaylistPage = lazy(() =>
  import('@/pages/PlaylistPage').then(({ PlaylistPage: Page }) => ({ default: Page })),
)
export const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
)
export const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)
export const ApplicationPage = lazy(() =>
  import('@/features/workspace/ApplicationPage').then((m) => ({ default: m.ApplicationPage })),
)
export const ArtistWorkspace = lazy(() =>
  import('@/features/workspace/ArtistWorkspace').then((m) => ({ default: m.ArtistWorkspace })),
)
export const AdminWorkspace = lazy(() =>
  import('@/features/workspace/AdminWorkspace').then((m) => ({ default: m.AdminWorkspace })),
)
export const UIPlaygroundPage = import.meta.env.DEV
  ? lazy(() =>
      import('@/pages/UIPlaygroundPage').then(({ UIPlaygroundPage: Page }) => ({ default: Page })),
    )
  : () => null

export function LazyPage({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<LoadingState title="Loading page" message="Preparing the next view." />}>
      {children}
    </Suspense>
  )
}
