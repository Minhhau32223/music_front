import { queryOptions } from '@tanstack/react-query'
import { retryDetailQuery } from '@/lib/query-retry'
import { artistApi } from '@/features/artists/api/artist.api'
import { artistKeys } from '@/features/artists/queries/artist.query-keys'
import { albumApi } from '@/features/albums/api/album.api'
import { albumKeys } from '@/features/albums/queries/album.query-keys'
import { songApi } from '@/features/songs/api/song.api'
import { songKeys } from '@/features/songs/queries/song.query-keys'
import type { SongListParams } from '@/features/songs/types/song.types'

const policy = { gcTime: 1_800_000, retry: retryDetailQuery }
export const artistListQuery = () =>
  queryOptions({
    ...policy,
    staleTime: 600_000,
    queryKey: artistKeys.list(),
    queryFn: ({ signal }) => artistApi.getArtists(signal),
  })
export const albumListQuery = () =>
  queryOptions({
    ...policy,
    staleTime: 300_000,
    queryKey: albumKeys.list(),
    queryFn: ({ signal }) => albumApi.getAlbums(signal),
  })
export const songListQuery = (params: SongListParams = {}) =>
  queryOptions({
    ...policy,
    staleTime: 180_000,
    queryKey: songKeys.list(params),
    queryFn: ({ signal }) => songApi.getSongs(params, signal),
  })
export const latestSongQuery = (limit: number) =>
  queryOptions({
    ...policy,
    staleTime: 180_000,
    queryKey: songKeys.latest(limit),
    queryFn: ({ signal }) => songApi.getLatestSongs(limit, signal),
  })
export const popularSongQuery = (limit: number) =>
  queryOptions({
    ...policy,
    staleTime: 180_000,
    queryKey: songKeys.popular(limit),
    queryFn: ({ signal }) => songApi.getPopularSongs(limit, signal),
  })
export const newReleaseQuery = (limit: number) =>
  queryOptions({
    ...policy,
    staleTime: 300_000,
    queryKey: songKeys.newReleases(limit),
    queryFn: ({ signal }) => songApi.getNewReleaseSongs(limit, signal),
  })
export const personalizedQuery = (userId: number, limit: number) =>
  queryOptions({
    ...policy,
    gcTime: 600_000,
    staleTime: 60_000,
    queryKey: songKeys.personalized(userId, limit),
    queryFn: ({ signal }) => songApi.getPersonalizedSongs(limit, signal),
  })
