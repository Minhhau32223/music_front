import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ToastProvider } from '@/components/ui/Toast'
import { favoriteApi } from '@/features/favorites/api/favorite.api'
import { useToggleFavorite } from '@/features/favorites/hooks/useToggleFavorite'
import { favoriteKeys } from '@/features/favorites/queries/favorite.query-keys'
import { playlistApi } from '@/features/playlists/api/playlist.api'
import {
  useAddSongToPlaylist,
  useDeletePlaylist,
} from '@/features/playlists/hooks/usePlaylistMutations'
import { playlistKeys } from '@/features/playlists/queries/playlist.query-keys'
import { EMPTY_PLAYER_STATE, usePlayerStore } from '@/features/player/store/player.store'
import type { Song } from '@/features/songs/types/song.types'

const song: Song = {
  id: 9,
  title: 'After Midnight',
  durationMs: 192_000,
  audioUrl: 'after-midnight.mp3',
  playCount: 17,
  artist: { id: 2, name: 'Nocturne' },
}

function createHarness() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  )
  return { client, wrapper }
}

beforeEach(() => usePlayerStore.setState({ ...EMPTY_PLAYER_STATE, initialized: true }))
afterEach(() => vi.restoreAllMocks())

describe('Phase 6 optimistic mutations', () => {
  it('rolls a failed favorite change back to its prior cache state', async () => {
    const { client, wrapper } = createHarness()
    client.setQueryData(favoriteKeys.songs(), [])
    let rejectRequest: (error: unknown) => void = () => undefined
    vi.spyOn(favoriteApi, 'likeSong').mockReturnValue(
      new Promise<void>((_resolve, reject) => {
        rejectRequest = reject
      }),
    )
    const { result } = renderHook(() => useToggleFavorite(song), { wrapper })

    act(() => result.current.mutate(true))
    await waitFor(() => expect(client.getQueryData<Song[]>(favoriteKeys.songs())).toEqual([song]))
    act(() => rejectRequest({ status: 0, kind: 'network', message: 'offline' }))
    await waitFor(() => expect(client.getQueryData(favoriteKeys.songs())).toEqual([]))
  })

  it('deleting a playlist never mutates the active player queue', async () => {
    const { client, wrapper } = createHarness()
    client.setQueryData(playlistKeys.list(), [
      { id: 3, name: 'Night Drive', ownerId: 7 },
      { id: 4, name: 'Focus', ownerId: 7 },
    ])
    usePlayerStore.setState({
      queue: [{ ...song, artistId: 2, artistName: 'Nocturne' }],
      currentIndex: 0,
      playbackStatus: 'paused',
    })
    vi.spyOn(playlistApi, 'deletePlaylist').mockResolvedValue(undefined)
    const cancelQueries = vi.spyOn(client, 'cancelQueries')
    const { result } = renderHook(() => useDeletePlaylist(), { wrapper })

    act(() => result.current.mutate(3))
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(usePlayerStore.getState().queue).toEqual([
      expect.objectContaining({ id: 9, audioUrl: 'after-midnight.mp3' }),
    ])
    expect(cancelQueries).toHaveBeenCalledWith({ queryKey: playlistKeys.detail(3) })
  })

  it('serializes rapid like then unlike and keeps the last intent in shared cache', async () => {
    const { client, wrapper } = createHarness()
    client.setQueryData(favoriteKeys.songs(), [])
    let finishLike: () => void = () => undefined
    vi.spyOn(favoriteApi, 'likeSong').mockReturnValue(
      new Promise<void>((resolve) => {
        finishLike = resolve
      }),
    )
    const unlike = vi.spyOn(favoriteApi, 'unlikeSong').mockResolvedValue(undefined)
    const { result } = renderHook(() => useToggleFavorite(song), { wrapper })

    act(() => result.current.mutate(true))
    await waitFor(() => expect(client.getQueryData<Song[]>(favoriteKeys.songs())).toEqual([song]))
    act(() => result.current.mutate(false))
    act(() => finishLike())

    await waitFor(() => expect(unlike).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(client.getQueryData(favoriteKeys.songs())).toEqual([]))
  })

  it('sends at most one in-flight add request for the same playlist and song', async () => {
    const { client, wrapper } = createHarness()
    client.setQueryData(playlistKeys.tracks(3), [])
    let finishAdd: () => void = () => undefined
    const addSong = vi.spyOn(playlistApi, 'addSong').mockReturnValue(
      new Promise<undefined>((resolve) => {
        finishAdd = () => resolve(undefined)
      }),
    )
    const { result } = renderHook(() => useAddSongToPlaylist(song), { wrapper })

    act(() => {
      result.current.mutate(3)
      result.current.mutate(3)
    })
    await waitFor(() => expect(addSong).toHaveBeenCalledTimes(1))
    act(() => finishAdd())
    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(client.getQueryData<Array<{ song: Song }>>(playlistKeys.tracks(3))).toEqual([
      expect.objectContaining({ song }),
    ])
  })
})
