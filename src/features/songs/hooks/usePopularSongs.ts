import { useQuery } from '@tanstack/react-query'
import { popularSongQuery } from '@/features/catalog/queries'
export function usePopularSongs(limit = 8, enabled = true) {
  return useQuery({ ...popularSongQuery(limit), enabled })
}
