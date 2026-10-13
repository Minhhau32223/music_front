import { useQuery } from '@tanstack/react-query'
import { personalizedQuery } from '@/features/catalog/queries'
export function usePersonalizedSongs(userId?: number, limit = 6, enabled = true) {
  return useQuery({ ...personalizedQuery(userId ?? 0, limit), enabled: userId != null && enabled })
}
