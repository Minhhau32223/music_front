import { useQuery } from '@tanstack/react-query'
import { albumListQuery } from '@/features/catalog/queries'
export function useAlbums() {
  return useQuery(albumListQuery())
}
