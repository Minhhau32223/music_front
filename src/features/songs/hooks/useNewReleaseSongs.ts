import { useQuery } from '@tanstack/react-query'
import { newReleaseQuery } from '@/features/catalog/queries'
export function useNewReleaseSongs(limit = 6, enabled = true) {
  return useQuery({ ...newReleaseQuery(limit), enabled })
}
