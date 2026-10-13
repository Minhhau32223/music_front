import { queryOptions } from '@tanstack/react-query'
import { retryDetailQuery } from '@/lib/query-retry'
import { playlistApi } from '../api/playlist.api'
import { playlistKeys } from './playlist.query-keys'

export const playlistListQuery = () =>
  queryOptions({
    queryKey: playlistKeys.list(),
    queryFn: ({ signal }) => playlistApi.getPlaylists(signal),
    staleTime: 120_000,
    gcTime: 1_800_000,
    retry: retryDetailQuery,
  })

export const playlistDetailQuery = (id: number) =>
  queryOptions({
    queryKey: playlistKeys.detail(id),
    queryFn: ({ signal }) => playlistApi.getPlaylist(id, signal),
    staleTime: 120_000,
    gcTime: 1_800_000,
    retry: retryDetailQuery,
  })

export const playlistTracksQuery = (id: number) =>
  queryOptions({
    queryKey: playlistKeys.tracks(id),
    queryFn: ({ signal }) => playlistApi.getPlaylistTracks(id, signal),
    staleTime: 60_000,
    gcTime: 1_800_000,
    retry: retryDetailQuery,
  })
