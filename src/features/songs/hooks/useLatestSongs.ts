import { useQuery } from '@tanstack/react-query'
import { latestSongQuery } from '@/features/catalog/queries'
export function useLatestSongs(limit = 6) {
  return useQuery(latestSongQuery(limit))
}
