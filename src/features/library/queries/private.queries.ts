import { queryOptions } from '@tanstack/react-query'
import { retryDetailQuery } from '@/lib/query-retry'
import { favoriteApi } from '@/features/favorites/api/favorite.api'
import { favoriteKeys } from '@/features/favorites/queries/favorite.query-keys'
import { libraryApi } from '../api/library.api'
import { libraryKeys } from './library.query-keys'
import { historyApi } from '@/features/history/api/history.api'
const policy = { gcTime: 1_800_000, retry: retryDetailQuery }
export const favoriteQuery = () =>
  queryOptions({
    ...policy,
    staleTime: 60_000,
    queryKey: favoriteKeys.songs(),
    queryFn: ({ signal }) => favoriteApi.getLikedSongs(signal),
  })
export const followedQuery = () =>
  queryOptions({
    ...policy,
    staleTime: 120_000,
    queryKey: libraryKeys.followedArtists(),
    queryFn: ({ signal }) => libraryApi.getFollowedArtists(signal),
  })
export const historyKey = ['history', 'recent'] as const
export const historyQuery = () =>
  queryOptions({
    ...policy,
    gcTime: 600_000,
    staleTime: 30_000,
    queryKey: historyKey,
    queryFn: ({ signal }) => historyApi.getRecent(signal),
  })
