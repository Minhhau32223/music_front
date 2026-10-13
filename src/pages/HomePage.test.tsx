import { fireEvent, render as baseRender, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from '@/components/ui/Toast'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useNewReleaseSongs } from '@/features/songs/hooks/useNewReleaseSongs'
import { useArtists } from '@/features/artists/hooks/useArtists'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useLatestSongs } from '@/features/songs/hooks/useLatestSongs'
import { usePopularSongs } from '@/features/songs/hooks/usePopularSongs'
import { audioEngine } from '@/features/player/engine/audio-engine'
import { EMPTY_PLAYER_STATE, usePlayerStore } from '@/features/player/store/player.store'
import { HomePage } from './HomePage'
import { useAlbums } from '@/features/albums/hooks/useAlbums'

vi.mock('@/features/albums/hooks/useAlbums')

vi.mock('@/features/songs/hooks/useNewReleaseSongs')
vi.mock('@/features/artists/hooks/useArtists')
vi.mock('@/features/auth/hooks/useCurrentUser')
vi.mock('@/features/songs/hooks/useLatestSongs')
vi.mock('@/features/songs/hooks/usePopularSongs')

function render(ui: ReactNode) {
  return baseRender(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <ToastProvider>{ui}</ToastProvider>
    </QueryClientProvider>,
  )
}

const song = {
  id: 1,
  title: 'Night Signal',
  durationMs: 201000,
  audioUrl: 'song.mp3',
  playCount: 8,
  artist: { id: 2, name: 'Nocturne' },
  album: { id: 3, title: 'After Dark', artistName: 'Nocturne' },
}
const query = (data: unknown, overrides = {}) => ({
  data,
  isLoading: false,
  isError: false,
  refetch: vi.fn(),
  ...overrides,
})

describe('HomePage catalog composition', () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession()
    usePlayerStore.setState({ ...EMPTY_PLAYER_STATE, initialized: true })
    vi.spyOn(audioEngine, 'loadSource').mockReturnValue(1)
    vi.spyOn(audioEngine, 'play').mockResolvedValue()
    vi.spyOn(audioEngine, 'setVolume').mockImplementation(() => undefined)
    vi.spyOn(audioEngine, 'setMuted').mockImplementation(() => undefined)
    vi.mocked(useCurrentUser).mockReturnValue(query({ username: 'Hau' }) as never)
    vi.mocked(useLatestSongs).mockReturnValue(query({ items: [song] }) as never)
    vi.mocked(useNewReleaseSongs).mockReturnValue(query([song]) as never)
    vi.mocked(useArtists).mockReturnValue(query([song.artist]) as never)
    vi.mocked(useAlbums).mockReturnValue(query([song.album]) as never)
    vi.mocked(usePopularSongs).mockReturnValue(query([song]) as never)
  })
  it('renders greeting and backend catalog sections', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: /Welcome,\s*Hau/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Albums' })).toBeInTheDocument()
    expect(screen.queryByText(/Acoustic session active/)).not.toBeInTheDocument()
    expect(screen.getAllByText('Night Signal').length).toBeGreaterThan(0)
    expect(screen.getByText('New releases')).toBeInTheDocument()
    expect(screen.getByText('Artists')).toBeInTheDocument()
  })
  it('isolates one failed section', () => {
    vi.mocked(useArtists).mockReturnValue(query(undefined, { isError: true }) as never)
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    expect(screen.getByText("Couldn't load this section.")).toBeInTheDocument()
    expect(screen.getAllByText('Night Signal').length).toBeGreaterThan(0)
  })
  it('renders successful empty states', () => {
    vi.mocked(useLatestSongs).mockReturnValue(query({ items: [] }) as never)
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    expect(screen.getByText('No songs have been added yet.')).toBeInTheDocument()
  })
  it('creates a context-aware player queue from a catalog play action', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getAllByRole('button', { name: 'Play Night Signal' })[0])
    expect(usePlayerStore.getState()).toMatchObject({
      currentIndex: 0,
      playbackStatus: 'loading',
      queue: [expect.objectContaining({ title: 'Night Signal', playbackUrl: 'song.mp3' })],
    })
    expect(audioEngine.play).toHaveBeenCalledOnce()
  })
})
