import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { ToastProvider } from '@/components/ui/Toast'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { audioEngine } from '@/features/player/engine/audio-engine'
import { EMPTY_PLAYER_STATE, usePlayerStore } from '@/features/player/store/player.store'
import { DiscoverPage, SearchPage as PhaseSevenSearchPage } from './PhaseSevenSearchPage'

const songs = ['Night One', 'Night Two'].map((name, index) => ({
  id: index + 1,
  name,
  file: `https://audio.test/${index + 1}.mp3`,
  image: null,
  lyrics: null,
  duration: '3:00',
  playCount: 10 - index,
  albumId: 5,
  artistId: 4,
  albumName: 'After Dark',
  artistName: 'Nocturne',
}))

const server = setupServer(
  http.get('http://localhost:8000/api/search', ({ request }) => {
    const keyword = new URL(request.url).searchParams.get('keyword')
    return HttpResponse.json({ songs: keyword ? songs : [], albums: [], artists: [] })
  }),
)

function LocationProbe() {
  return <output data-testid="location">{useLocation().search}</output>
}

function renderSearch(initialEntry = '/search?q=night') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <ToastProvider>
        <MemoryRouter initialEntries={[initialEntry]}>
          <LocationProbe />
          <Routes>
            <Route path="/search" element={<PhaseSevenSearchPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    </QueryClientProvider>,
  )
}

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => {
  useAuthStore.getState().clearSession()
  window.localStorage.clear()
  usePlayerStore.setState({ ...EMPTY_PLAYER_STATE, initialized: true })
  vi.spyOn(audioEngine, 'loadSource').mockReturnValue(1)
  vi.spyOn(audioEngine, 'play').mockResolvedValue()
  vi.spyOn(audioEngine, 'setVolume').mockImplementation(() => undefined)
  vi.spyOn(audioEngine, 'setMuted').mockImplementation(() => undefined)
})
afterEach(() => {
  server.resetHandlers()
  vi.restoreAllMocks()
})
afterAll(() => server.close())

describe('Phase 7 search page', () => {
  it('offers discovery without search-only instructions or guest recommendations', async () => {
    server.use(
      http.get('http://localhost:8000/api/recommendations/top-songs', () =>
        HttpResponse.json(songs),
      ),
      http.get('http://localhost:8000/api/recommendations/new-releases', () =>
        HttpResponse.json(songs),
      ),
    )
    renderSearch('/discover')
    expect(screen.getByRole('heading', { name: 'Discover' })).toBeInTheDocument()
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
    expect(screen.queryByText('Made for you')).not.toBeInTheDocument()
    expect(await screen.findAllByText('Night One')).toHaveLength(2)
  })
  it('keeps q as canonical URL state after the debounce window', async () => {
    renderSearch('/search')
    const input = screen.getByRole('searchbox', { name: 'Search songs, artists, or albums' })
    fireEvent.change(input, { target: { value: '  đêm mưa  ' } })

    await waitFor(
      () => expect(screen.getByTestId('location')).toHaveTextContent('?q=%C4%91%C3%AAm+m%C6%B0a'),
      { timeout: 1_500 },
    )
    expect(screen.getByRole('searchbox', { name: 'Search songs, artists, or albums' })).toHaveValue(
      'đêm mưa',
    )
  })

  it('plays the complete search song context from the clicked result', async () => {
    renderSearch()
    const secondPlay = await screen.findByRole('button', { name: 'Play Night Two' })
    fireEvent.click(secondPlay)

    expect(usePlayerStore.getState()).toMatchObject({
      currentIndex: 1,
      playbackStatus: 'loading',
      queue: [
        expect.objectContaining({
          id: 1,
          playbackUrl: 'http://localhost:8000/api/stream/song/1/play',
        }),
        expect.objectContaining({
          id: 2,
          playbackUrl: 'http://localhost:8000/api/stream/song/2/play',
        }),
      ],
    })
  })
})
