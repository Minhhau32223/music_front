import { useQuery } from '@tanstack/react-query'
import { artistApi } from '../api/artist.api'
import { artistKeys } from '../queries/artist.query-keys'
export function useArtists() {
  return useQuery({
    queryKey: artistKeys.list(),
    queryFn: artistApi.getArtists,
    staleTime: 600_000,
    gcTime: 1_800_000,
    retry: 1,
  })
}
