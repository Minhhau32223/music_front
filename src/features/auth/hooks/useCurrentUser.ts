import { useQuery } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'

export const currentUserQueryKey = ['auth', 'me'] as const

export function useCurrentUser() {
  const authenticated = useAuthStore((state) => state.status === 'authenticated')
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: authApi.getCurrentUser,
    enabled: authenticated,
    retry: false,
  })
}
