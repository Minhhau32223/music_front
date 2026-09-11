import { useQuery } from '@tanstack/react-query'
import { songApi } from '../api/song.api'
import { songKeys } from '../queries/song.query-keys'
import type { SongListParams } from '../types/song.types'
export function useSongs(params: SongListParams = {}) {
  return useQuery({
    queryKey: songKeys.list(params),
    queryFn: () => songApi.getSongs(params),
    staleTime: 180_000,
    gcTime: 1_800_000,
    retry: 1,
  })
}
