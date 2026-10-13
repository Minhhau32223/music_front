import { useQuery } from '@tanstack/react-query'
import { albumApi } from '../api/album.api'
import { albumKeys } from '../queries/album.query-keys'
import { retryDetailQuery } from '@/lib/query-retry'
export function useNewReleases(limit = 6) {
  return useQuery({
    queryKey: albumKeys.newReleases(limit),
    queryFn: ({ signal }) => albumApi.getNewReleases(limit, signal),
    staleTime: 300_000,
    gcTime: 1_800_000,
    retry: retryDetailQuery,
  })
}
