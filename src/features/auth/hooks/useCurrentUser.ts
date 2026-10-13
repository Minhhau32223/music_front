import { useQuery } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'

export const currentUserQueryKey = ['auth', 'me'] as const

export function useCurrentUser() {
  const authenticated = useAuthStore((state) => state.status === 'authenticated')
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: ({ signal }) => authApi.getCurrentUser(signal),
    enabled: authenticated,
    staleTime: 2 * 60_000,
    gcTime: 30 * 60_000,
    retry: false,
  })
}
