import { useQuery } from '@tanstack/react-query'
import { songApi } from '../api/song.api'
import { songKeys } from '../queries/song.query-keys'
export function useLatestSongs(limit = 6) {
  return useQuery({
    queryKey: songKeys.latest(limit),
    queryFn: () => songApi.getLatestSongs(limit),
    staleTime: 180_000,
    gcTime: 1_800_000,
    retry: 1,
  })
}
