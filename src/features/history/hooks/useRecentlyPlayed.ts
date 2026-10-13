import { useQuery } from '@tanstack/react-query'
import { historyQuery } from '@/features/library/queries/private.queries'
import { useAuthStore } from '@/features/auth/store/auth.store'
export { historyKey } from '@/features/library/queries/private.queries'
export function useRecentlyPlayed() {
  const authenticated = useAuthStore((s) => s.status === 'authenticated')
  return useQuery({ ...historyQuery(), enabled: authenticated })
}
