import { useQuery } from '@tanstack/react-query'
import { songApi } from '../api/song.api'
import { songKeys } from '../queries/song.query-keys'
export function usePopularSongs(limit = 8) {
  return useQuery({
    queryKey: songKeys.popular(limit),
    queryFn: () => songApi.getPopularSongs(limit),
    staleTime: 180_000,
    gcTime: 1_800_000,
    retry: 1,
  })
}
