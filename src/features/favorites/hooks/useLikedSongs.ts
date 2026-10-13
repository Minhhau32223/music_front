import { useQuery } from '@tanstack/react-query'
import { favoriteQuery } from '@/features/library/queries/private.queries'
import { useAuthStore } from '@/features/auth/store/auth.store'
export function useLikedSongs() {
  const guest = useAuthStore((s) => s.status === 'unauthenticated')
  return useQuery({ ...favoriteQuery(), enabled: !guest })
}
