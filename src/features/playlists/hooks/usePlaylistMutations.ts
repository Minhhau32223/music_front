import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/toast-context'
import { isApiError } from '@/lib/api/api-error'
import { playlistApi } from '../api/playlist.api'
import { playlistKeys } from '../queries/playlist.query-keys'
import type { PlaylistDetail, PlaylistSummary, PlaylistTrack } from '../types/playlist.types'
import type { Song } from '@/features/songs/types/song.types'

type PlaylistCacheSnapshot = {
  list?: PlaylistSummary[]
  detail?: PlaylistDetail
}

const inFlightAdditions = new Set<string>()

function updateTrackCount(value: PlaylistSummary | PlaylistDetail | undefined, delta: number) {
  if (!value || value.trackCount === undefined) return value
  return { ...value, trackCount: Math.max(0, value.trackCount + delta) }
}

export function useCreatePlaylist() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: playlistApi.createPlaylist,
    onSuccess: (playlist) => {
      queryClient.setQueryData<PlaylistSummary[]>(playlistKeys.list(), (current = []) =>
        current.some((item) => item.id === playlist.id) ? current : [playlist, ...current],
      )
      queryClient.setQueryData(playlistKeys.detail(playlist.id), playlist)
      showToast(`Created playlist “${playlist.name}”.`)
    },
    onError: () => showToast('Unable to create playlist. Please try again.', 'error'),
    onSettled: () => void queryClient.invalidateQueries({ queryKey: playlistKeys.list() }),
  })
}

export function useRenamePlaylist(playlistId: number) {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (name: string) => playlistApi.updatePlaylist(playlistId, { name }),
    onMutate: async (name): Promise<PlaylistCacheSnapshot> => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: playlistKeys.list() }),
        queryClient.cancelQueries({ queryKey: playlistKeys.detail(playlistId) }),
      ])
      const list = queryClient.getQueryData<PlaylistSummary[]>(playlistKeys.list())
      const detail = queryClient.getQueryData<PlaylistDetail>(playlistKeys.detail(playlistId))
      queryClient.setQueryData<PlaylistSummary[]>(playlistKeys.list(), (current = []) =>
        current.map((item) => (item.id === playlistId ? { ...item, name } : item)),
      )
      queryClient.setQueryData<PlaylistDetail>(playlistKeys.detail(playlistId), (current) =>
        current ? { ...current, name } : current,
      )
      return { list, detail }
    },
    onError: (_error, _name, snapshot) => {
      if (snapshot?.list) queryClient.setQueryData(playlistKeys.list(), snapshot.list)
      if (snapshot?.detail)
        queryClient.setQueryData(playlistKeys.detail(playlistId), snapshot.detail)
      showToast('Unable to rename playlist. Your change was reverted.', 'error')
    },
    onSuccess: (playlist) => {
      queryClient.setQueryData(playlistKeys.detail(playlistId), playlist)
      showToast('Playlist updated.')
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: playlistKeys.list() })
      void queryClient.invalidateQueries({ queryKey: playlistKeys.detail(playlistId) })
    },
  })
}

export function useDeletePlaylist() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: playlistApi.deletePlaylist,
    onMutate: async (playlistId) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: playlistKeys.list() }),
        queryClient.cancelQueries({ queryKey: playlistKeys.detail(playlistId) }),
      ])
      const list = queryClient.getQueryData<PlaylistSummary[]>(playlistKeys.list())
      const detail = queryClient.getQueryData<PlaylistDetail>(playlistKeys.detail(playlistId))
      const tracks = queryClient.getQueryData<PlaylistTrack[]>(playlistKeys.tracks(playlistId))
      queryClient.setQueryData<PlaylistSummary[]>(playlistKeys.list(), (current = []) =>
        current.filter((item) => item.id !== playlistId),
      )
      return { list, detail, tracks }
    },
    onError: (_error, playlistId, snapshot) => {
      if (snapshot?.list) queryClient.setQueryData(playlistKeys.list(), snapshot.list)
      if (snapshot?.detail)
        queryClient.setQueryData(playlistKeys.detail(playlistId), snapshot.detail)
      if (snapshot?.tracks)
        queryClient.setQueryData(playlistKeys.tracks(playlistId), snapshot.tracks)
      showToast('Unable to delete playlist. Your list was restored.', 'error')
    },
    onSuccess: (_data, playlistId) => {
      queryClient.removeQueries({ queryKey: playlistKeys.detail(playlistId) })
      showToast('Playlist deleted.')
    },
    onSettled: () => void queryClient.invalidateQueries({ queryKey: playlistKeys.list() }),
  })
}

export function useAddSongToPlaylist(song: Song) {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async (playlistId: number) => {
      const requestKey = `${playlistId}:${song.id}`
      if (inFlightAdditions.has(requestKey)) return { duplicate: true }
      inFlightAdditions.add(requestKey)
      try {
        await playlistApi.addSong(playlistId, song.id)
        return { duplicate: false }
      } catch (error) {
        if (isApiError(error) && error.status === 409) return { duplicate: true }
        throw error
      } finally {
        inFlightAdditions.delete(requestKey)
      }
    },
    onMutate: async (playlistId) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: playlistKeys.tracks(playlistId) }),
        queryClient.cancelQueries({ queryKey: playlistKeys.detail(playlistId) }),
      ])
      const tracks = queryClient.getQueryData<PlaylistTrack[]>(playlistKeys.tracks(playlistId))
      const list = queryClient.getQueryData<PlaylistSummary[]>(playlistKeys.list())
      const detail = queryClient.getQueryData<PlaylistDetail>(playlistKeys.detail(playlistId))
      const alreadyPresent = tracks?.some((track) => track.song.id === song.id) ?? false

      if (tracks && !alreadyPresent) {
        queryClient.setQueryData<PlaylistTrack[]>(playlistKeys.tracks(playlistId), [
          ...tracks,
          { position: tracks.length, song },
        ])
        queryClient.setQueryData<PlaylistSummary[]>(playlistKeys.list(), (current = []) =>
          current.map((item) =>
            item.id === playlistId ? (updateTrackCount(item, 1) as PlaylistSummary) : item,
          ),
        )
        queryClient.setQueryData<PlaylistDetail>(playlistKeys.detail(playlistId), (current) =>
          updateTrackCount(current, 1),
        )
      }
      return { tracks, list, detail, alreadyPresent }
    },
    onError: (_error, playlistId, snapshot) => {
      if (snapshot?.tracks)
        queryClient.setQueryData(playlistKeys.tracks(playlistId), snapshot.tracks)
      if (snapshot?.list) queryClient.setQueryData(playlistKeys.list(), snapshot.list)
      if (snapshot?.detail)
        queryClient.setQueryData(playlistKeys.detail(playlistId), snapshot.detail)
      showToast(
        isApiError(_error) && _error.status === 403
          ? 'You do not have permission to edit this playlist.'
          : 'Unable to add the song to the playlist. Your change was reverted.',
        'error',
      )
    },
    onSuccess: (result) =>
      showToast(result.duplicate ? 'The song is already in this playlist.' : 'Added to playlist.'),
    onSettled: (_data, _error, playlistId) => {
      void queryClient.invalidateQueries({ queryKey: playlistKeys.tracks(playlistId) })
      void queryClient.invalidateQueries({ queryKey: playlistKeys.detail(playlistId) })
      void queryClient.invalidateQueries({ queryKey: playlistKeys.list() })
    },
  })
}

export function useRemoveSongFromPlaylist(playlistId: number) {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (songId: number) => playlistApi.removeSong(playlistId, songId),
    onMutate: async (songId) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: playlistKeys.tracks(playlistId) }),
        queryClient.cancelQueries({ queryKey: playlistKeys.detail(playlistId) }),
      ])
      const tracks = queryClient.getQueryData<PlaylistTrack[]>(playlistKeys.tracks(playlistId))
      const list = queryClient.getQueryData<PlaylistSummary[]>(playlistKeys.list())
      const detail = queryClient.getQueryData<PlaylistDetail>(playlistKeys.detail(playlistId))
      queryClient.setQueryData<PlaylistTrack[]>(playlistKeys.tracks(playlistId), (current = []) =>
        current
          .filter((track) => track.song.id !== songId)
          .map((track, position) => ({ ...track, position })),
      )
      queryClient.setQueryData<PlaylistSummary[]>(playlistKeys.list(), (current = []) =>
        current.map((item) =>
          item.id === playlistId ? (updateTrackCount(item, -1) as PlaylistSummary) : item,
        ),
      )
      queryClient.setQueryData<PlaylistDetail>(playlistKeys.detail(playlistId), (current) =>
        updateTrackCount(current, -1),
      )
      return { tracks, list, detail }
    },
    onError: (_error, _songId, snapshot) => {
      if (snapshot?.tracks)
        queryClient.setQueryData(playlistKeys.tracks(playlistId), snapshot.tracks)
      if (snapshot?.list) queryClient.setQueryData(playlistKeys.list(), snapshot.list)
      if (snapshot?.detail)
        queryClient.setQueryData(playlistKeys.detail(playlistId), snapshot.detail)
      showToast(
        isApiError(_error) && _error.status === 403
          ? 'You do not have permission to edit this playlist.'
          : 'Unable to remove the song. Your change was reverted.',
        'error',
      )
    },
    onSuccess: () => showToast('Song removed from playlist.'),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: playlistKeys.tracks(playlistId) })
      void queryClient.invalidateQueries({ queryKey: playlistKeys.detail(playlistId) })
      void queryClient.invalidateQueries({ queryKey: playlistKeys.list() })
    },
  })
}
