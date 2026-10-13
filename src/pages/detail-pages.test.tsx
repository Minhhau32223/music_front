import { fireEvent, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAlbumDetail, useAlbumTracks } from '@/features/albums/hooks/useAlbumDetail'
import {
  useArtistDetail,
  useArtistReleases,
  useArtistTracks,
} from '@/features/artists/hooks/useArtistDetail'
import { audioEngine } from '@/features/player/engine/audio-engine'
import { EMPTY_PLAYER_STATE, usePlayerStore } from '@/features/player/store/player.store'
import { useSongDetail } from '@/features/songs/hooks/useSongDetail'
import { AlbumDetailPage } from './AlbumDetailPage'
import { ArtistDetailPage } from './ArtistDetailPage'
import { SongPage } from './SongPage'
import { ToastProvider } from '@/components/ui/Toast'
import { favoriteKeys } from '@/features/favorites/queries/favorite.query-keys'
import { libraryKeys } from '@/features/library/queries/library.query-keys'

vi.mock('@/features/albums/hooks/useAlbumDetail')
vi.mock('@/features/artists/hooks/useArtistDetail')
vi.mock('@/features/songs/hooks/useSongDetail')

const songs = [
  {
    id: 1,
    title: 'Night Signal',
    durationMs: 201_000,
    audioUrl: 'night.mp3',
    artworkUrl: undefined,
    playCount: 8,
    artist: { id: 2, name: 'Nocturne' },
    album: { id: 3, title: 'After Dark', artistId: 2, artistName: 'Nocturne' },
  },
  {
    id: 2,
    title: 'Blue Hour',
    durationMs: 180_000,
    audioUrl: 'blue.mp3',
    artworkUrl: undefined,
    playCount: 3,
    artist: { id: 2, name: 'Nocturne' },
    album: { id: 3, title: 'After Dark', artistId: 2, artistName: 'Nocturne' },
  },
]

const query = (data: unknown, overrides = {}) => ({
  data,
  isLoading: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
  ...overrides,
})

function renderRoute(path: string, pattern: string, element: React.ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  client.setQueryData(favoriteKeys.songs(), [])
  client.setQueryData(libraryKeys.followedArtists(), [])
  return render(
    <QueryClientProvider client={client}>
      <ToastProvider>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path={pattern} element={element} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    </QueryClientProvider>,
  )
}

describe('Phase 5 detail pages', () => {
  beforeEach(() => {
    usePlayerStore.setState({ ...EMPTY_PLAYER_STATE, initialized: true })
    vi.spyOn(audioEngine, 'loadSource').mockReturnValue(1)
    vi.spyOn(audioEngine, 'play').mockResolvedValue()
    vi.spyOn(audioEngine, 'setVolume').mockImplementation(() => undefined)
    vi.spyOn(audioEngine, 'setMuted').mockImplementation(() => undefined)
    vi.mocked(useArtistDetail).mockReturnValue(
      query({ id: 2, name: 'Nocturne', bio: 'Real biography' }) as never,
    )
    vi.mocked(useArtistTracks).mockReturnValue(query(songs) as never)
    vi.mocked(useArtistReleases).mockReturnValue(query([songs[0].album]) as never)
    vi.mocked(useAlbumDetail).mockReturnValue(
      query({ id: 3, title: 'After Dark', description: 'Real description' }) as never,
    )
    vi.mocked(useAlbumTracks).mockReturnValue(query(songs) as never)
    vi.mocked(useSongDetail).mockReturnValue(query(songs[0]) as never)
  })

  it('renders real artist data and omits unsupported fake metadata', () => {
    renderRoute('/artist/2', '/artist/:artistId', <ArtistDetailPage />)
    expect(screen.getByRole('heading', { name: 'Nocturne', level: 1 })).toBeInTheDocument()
    expect(screen.getByText('Real biography')).toBeInTheDocument()
    expect(screen.queryByText(/Verified|monthly listeners|Following/i)).not.toBeInTheDocument()
  })

  it('starts the complete album context at the selected track', () => {
    renderRoute('/album/3', '/album/:albumId', <AlbumDetailPage />)
    fireEvent.click(screen.getByRole('button', { name: 'Play Blue Hour' }))
    expect(usePlayerStore.getState()).toMatchObject({
      currentIndex: 1,
      playbackStatus: 'loading',
      queue: [
        expect.objectContaining({ id: 1, title: 'Night Signal' }),
        expect.objectContaining({ id: 2, title: 'Blue Hour' }),
      ],
    })
  })

  it('exposes only implemented song actions and writes through Player Commands', () => {
    renderRoute('/song/1', '/song/:songId', <SongPage />)
    expect(screen.getAllByRole('link', { name: 'Nocturne' })[0]).toHaveAttribute(
      'href',
      '/artist/2',
    )
    expect(screen.getAllByRole('link', { name: 'After Dark' })[0]).toHaveAttribute(
      'href',
      '/album/3',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Play' }))
    expect(usePlayerStore.getState().queue[0]).toMatchObject({ id: 1, playbackUrl: 'night.mp3' })
    expect(screen.queryByText(/Follow|Download/i)).not.toBeInTheDocument()
  })

  it('rejects a malformed route id without presenting stale entity data', () => {
    renderRoute('/album/nope', '/album/:albumId', <AlbumDetailPage />)
    expect(screen.getByRole('heading', { name: 'album not found' })).toBeInTheDocument()
    expect(screen.queryByText('After Dark')).not.toBeInTheDocument()
  })

  it('renders a dedicated 404 state without a retry action', () => {
    vi.mocked(useArtistDetail).mockReturnValue(
      query(undefined, {
        isError: true,
        error: { status: 404, kind: 'unknown', message: 'Not found' },
      }) as never,
    )
    renderRoute('/artist/404', '/artist/:artistId', <ArtistDetailPage />)
    expect(screen.getByRole('heading', { name: 'artist not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/home')
    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument()
  })

  it('isolates an artist track failure while keeping identity and releases visible', () => {
    vi.mocked(useArtistTracks).mockReturnValue(
      query(undefined, { isError: true, error: new Error('network') }) as never,
    )
    renderRoute('/artist/2', '/artist/:artistId', <ArtistDetailPage />)
    expect(screen.getByRole('heading', { name: 'Nocturne', level: 1 })).toBeInTheDocument()
    expect(screen.getByText('Unable to load this item.')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'After Dark' }).length).toBeGreaterThan(0)
  })

  it('treats an album with no tracks as valid empty data and disables play', () => {
    vi.mocked(useAlbumTracks).mockReturnValue(query([]) as never)
    renderRoute('/album/3', '/album/:albumId', <AlbumDetailPage />)
    expect(screen.getByText('This album has no songs yet.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Play' })).toBeDisabled()
  })

  it('does not replace an existing queue when a detail page merely mounts', () => {
    usePlayerStore.setState({
      queue: [
        {
          id: 99,
          title: 'Already Playing',
          artistId: 8,
          artistName: 'Existing Artist',
          playbackUrl: 'existing.mp3',
          durationMs: 90_000,
        },
      ],
      currentIndex: 0,
      playbackStatus: 'paused',
    })
    renderRoute('/song/1', '/song/:songId', <SongPage />)
    expect(usePlayerStore.getState().queue).toEqual([
      expect.objectContaining({ id: 99, playbackUrl: 'existing.mp3' }),
    ])
  })
})
