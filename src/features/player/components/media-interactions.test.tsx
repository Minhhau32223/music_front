import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { ToastProvider } from '@/components/ui/Toast'
import { SongContextMenu } from '@/components/shared/SongContextMenu'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { favoriteKeys } from '@/features/favorites/queries/favorite.query-keys'
import { songKeys } from '@/features/songs/queries/song.query-keys'
import { songApi } from '@/features/songs/api/song.api'
import { historyApi } from '@/features/history/api/history.api'
import { usePlaybackTracking } from '@/features/history/hooks/usePlaybackTracking'
import { toPlayableTrack, type Song } from '@/features/songs/types/song.types'
import { EMPTY_PLAYER_STATE, usePlayerStore } from '../store/player.store'
import { useLyricsStore } from '../store/lyrics.store'
import { LyricsPanel } from './LyricsPanel'

const song: Song = {
  id: 1,
  title: 'Night',
  artist: { id: 2, name: 'Artist' },
  durationMs: 0,
  audioUrl: '/api/stream/song/1/play',
  playCount: 0,
  lyrics: 'First line\nSecond line',
}
function setup(ui: ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, retryDelay: 0, staleTime: Infinity } },
  })
  client.setQueryData(songKeys.detail(1), song)
  client.setQueryData(songKeys.detail(2), { ...song, id: 2, title: 'Next', lyrics: 'New lyrics' })
  client.setQueryData(favoriteKeys.songs(), [])
  const view = render(
    <QueryClientProvider client={client}>
      <ToastProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </ToastProvider>
    </QueryClientProvider>,
  )
  return { client, ...view }
}
beforeEach(() => {
  useAuthStore.getState().clearSession()
  useLyricsStore.getState().close()
  usePlayerStore.setState({ ...EMPTY_PLAYER_STATE })
})
describe('shared media interactions', () => {
  it('opens right-click and More with the same actions, moves keyboard focus and restores it', () => {
    const { container } = setup(
      <article data-song-surface>
        <SongContextMenu song={song} onPlayNow={vi.fn()} />
      </article>,
    )
    fireEvent.contextMenu(container.querySelector('article')!, { clientX: 100, clientY: 100 })
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Play now' })).toHaveFocus()
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' })
    expect(screen.getByRole('menuitem', { name: 'Play next' })).toHaveFocus()
    expect(screen.queryByRole('menuitem', { name: 'Add to playlist' })).not.toBeInTheDocument()
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
    const more = screen.getByRole('button', { name: 'Options for Night' })
    expect(more).toHaveFocus()
    fireEvent.click(more)
    expect(screen.getByRole('menuitem', { name: 'View lyrics' })).toBeInTheDocument()
  })
  it('hides removal for non-owner and exposes authenticated playlist actions', () => {
    useAuthStore.getState().setSession('test')
    setup(
      <SongContextMenu
        song={song}
        onPlayNow={vi.fn()}
        playlistContext={{ canEdit: false, onRemove: vi.fn() }}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Options for Night' }))
    expect(screen.getByRole('menuitem', { name: 'Add to playlist' })).toBeInTheDocument()
    expect(screen.queryByRole('menuitem', { name: 'Remove from playlist' })).not.toBeInTheDocument()
  })
  it('reuses cached lyrics and follows the current track without keeping old text', () => {
    usePlayerStore.setState({ queue: [toPlayableTrack(song)], currentIndex: 0 })
    useLyricsStore.getState().open('current')
    setup(<LyricsPanel />)
    expect(screen.getByText(/First line/).textContent).toBe('First line\nSecond line')
    act(() => usePlayerStore.setState({ queue: [toPlayableTrack({ ...song, id: 2 })] }))
    expect(screen.getByText('New lyrics')).toBeInTheDocument()
    expect(screen.queryByText(/First line/)).not.toBeInTheDocument()
  })
  it('shows missing lyrics and a retryable failure', async () => {
    useLyricsStore.getState().open(1)
    const { client } = setup(<LyricsPanel />)
    act(() => {
      client.setQueryData(songKeys.detail(1), { ...song, lyrics: ' ' })
    })
    expect(await screen.findByText('This song has no lyrics yet.')).toBeInTheDocument()
    const get = vi.spyOn(songApi, 'getSong').mockRejectedValue({ status: 500, kind: 'server' })
    act(() => useLyricsStore.getState().open(3))
    expect(await screen.findByText('Unable to load lyrics.')).toBeInTheDocument()
    get.mockResolvedValue({ ...song, id: 3, lyrics: 'Recovered' })
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByText('Recovered')).toBeInTheDocument()
    get.mockRestore()
  })
})
function Tracking() {
  usePlaybackTracking()
  return null
}
it('records real playback once per generation, skips guest, resume and repeat-one events', async () => {
  const record = vi.spyOn(historyApi, 'record').mockResolvedValue()
  const { unmount } = setup(<Tracking />)
  act(() =>
    usePlayerStore.setState({
      queue: [toPlayableTrack(song)],
      currentIndex: 0,
      activeGeneration: 901,
      shouldPlay: true,
      playbackStatus: 'playing',
    }),
  )
  expect(record).not.toHaveBeenCalled()
  useAuthStore.getState().setSession('test')
  act(() => usePlayerStore.setState({ playbackStatus: 'loading' }))
  expect(record).not.toHaveBeenCalled()
  act(() => usePlayerStore.setState({ playbackStatus: 'playing' }))
  await waitFor(() => expect(record).toHaveBeenCalledTimes(1))
  act(() => {
    usePlayerStore.setState({ currentTimeMs: 1000, repeatMode: 'one' })
    usePlayerStore.setState({ playbackStatus: 'paused' })
    usePlayerStore.setState({ playbackStatus: 'playing' })
  })
  expect(record).toHaveBeenCalledTimes(1)
  act(() => usePlayerStore.setState({ activeGeneration: 902, playbackStatus: 'playing' }))
  await waitFor(() => expect(record).toHaveBeenCalledTimes(2))
  unmount()
  setup(<Tracking />)
  act(() => usePlayerStore.setState({ currentTimeMs: 2000 }))
  expect(record).toHaveBeenCalledTimes(2)
  record.mockRestore()
})
