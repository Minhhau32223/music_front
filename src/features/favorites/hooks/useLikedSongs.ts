import { useQuery } from '@tanstack/react-query'
import { favoriteApi } from '../api/favorite.api'
import { favoriteKeys } from '../queries/favorite.query-keys'

export function useLikedSongs() {
  return useQuery({
    queryKey: favoriteKeys.songs(),
    queryFn: ({ signal }) => favoriteApi.getLikedSongs(signal),
    staleTime: 60_000,
    gcTime: 1_800_000,
    retry: 1,
  })
}
