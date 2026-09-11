import { useQuery } from '@tanstack/react-query'
import { albumApi } from '../api/album.api'
import { albumKeys } from '../queries/album.query-keys'
export function useAlbums() {
  return useQuery({
    queryKey: albumKeys.list(),
    queryFn: albumApi.getAlbums,
    staleTime: 300_000,
    gcTime: 1_800_000,
    retry: 1,
  })
}
