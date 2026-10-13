import { useQuery } from '@tanstack/react-query'
import { artistListQuery } from '@/features/catalog/queries'
export function useArtists() {
  return useQuery(artistListQuery())
}
