import { useQuery } from '@tanstack/react-query'
import { libraryApi } from '../api/library.api'
import { libraryKeys } from '../queries/library.query-keys'

export function useFollowedArtists() {
  return useQuery({
    queryKey: libraryKeys.followedArtists(),
    queryFn: ({ signal }) => libraryApi.getFollowedArtists(signal),
    staleTime: 120_000,
    gcTime: 1_800_000,
    retry: 1,
  })
}
