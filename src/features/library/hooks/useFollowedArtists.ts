import { useQuery } from '@tanstack/react-query'
import { followedQuery } from '../queries/private.queries'
import { useAuthStore } from '@/features/auth/store/auth.store'
export function useFollowedArtists() {
  const guest = useAuthStore((s) => s.status === 'unauthenticated')
  return useQuery({ ...followedQuery(), enabled: !guest })
}
