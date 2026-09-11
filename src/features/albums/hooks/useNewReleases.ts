import { useQuery } from '@tanstack/react-query'
import { albumApi } from '../api/album.api'
import { albumKeys } from '../queries/album.query-keys'
export function useNewReleases(limit = 6) {
  return useQuery({
    queryKey: albumKeys.newReleases(limit),
    queryFn: () => albumApi.getNewReleases(limit),
    staleTime: 300_000,
    gcTime: 1_800_000,
    retry: 1,
  })
}
