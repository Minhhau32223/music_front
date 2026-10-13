import { fireEvent, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { ToastProvider } from '@/components/ui/Toast'
import { favoriteKeys } from '@/features/favorites/queries/favorite.query-keys'
import { songKeys } from '@/features/songs/queries/song.query-keys'
import type { PlayableTrack } from '@/features/songs/types/song.types'
import { audioEngine } from '../engine/audio-engine'
import { EMPTY_PLAYER_STATE, usePlayerStore } from '../store/player.store'
import { PlayerBar } from './PlayerBar'

const track: PlayableTrack = {
  id: 1,
  title: 'Night Signal',
  artistId: 2,
  artistName: 'Nocturne',
  playbackUrl: 'https://audio.test/night-signal.mp3',
  durationMs: 180_000,
}

function renderPlayer() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  client.setQueryData(songKeys.detail(track.id), {
    ...track,
    artist: { id: track.artistId, name: track.artistName },
    playCount: 0,
  })
  client.setQueryData(favoriteKeys.songs(), [])
  return render(
    <QueryClientProvider client={client}>
      <ToastProvider>
        <MemoryRouter>
          <PlayerBar />
        </MemoryRouter>
      </ToastProvider>
    </QueryClientProvider>,
  )
}

describe('player controls', () => {
  beforeEach(() => {
    usePlayerStore.setState({
      ...EMPTY_PLAYER_STATE,
      initialized: true,
      queue: [track],
      currentIndex: 0,
      playbackStatus: 'paused',
      durationMs: track.durationMs,
      activeGeneration: 1,
    })
    vi.spyOn(audioEngine, 'seek').mockImplementation(() => undefined)
    vi.spyOn(audioEngine, 'setVolume').mockImplementation(() => undefined)
    vi.spyOn(audioEngine, 'setMuted').mockImplementation(() => undefined)
  })

  it('renders real metadata and exposes accessible playback controls', () => {
    renderPlayer()
    expect(screen.getByText('Night Signal')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Play' })).toBeEnabled()
    expect(screen.getByRole('slider', { name: 'Song progress' })).toHaveAttribute(
      'aria-valuetext',
      '0:00 of 3:00',
    )
  })

  it('seeks and changes volume through native keyboard-accessible sliders', () => {
    renderPlayer()
    fireEvent.change(screen.getByRole('slider', { name: 'Song progress' }), {
      target: { value: '45000' },
    })
    fireEvent.change(screen.getByRole('slider', { name: 'Volume' }), {
      target: { value: '35' },
    })
    expect(audioEngine.seek).toHaveBeenCalledWith(45_000)
    expect(audioEngine.setVolume).toHaveBeenCalledWith(0.35)
  })
})
