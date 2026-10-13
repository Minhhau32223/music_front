import { useQuery } from '@tanstack/react-query'
import { songListQuery } from '@/features/catalog/queries'
import type { SongListParams } from '../types/song.types'
export function useSongs(params: SongListParams = {}) {
  return useQuery(songListQuery(params))
}
