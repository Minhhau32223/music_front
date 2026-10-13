import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'
import { currentUserQueryKey } from './useCurrentUser'

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (session) => {
      queryClient.clear()
      setSession(session.accessToken)
      await queryClient.fetchQuery({
        queryKey: currentUserQueryKey,
        queryFn: ({ signal }) => authApi.getCurrentUser(signal),
        staleTime: 120_000,
        retry: false,
      })
    },
  })
}
