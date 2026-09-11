import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'
import { currentUserQueryKey } from './useCurrentUser'

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (session) => {
      setSession(session.accessToken)
      queryClient.setQueryData(currentUserQueryKey, {
        id: session.id,
        username: session.username,
        email: session.email,
        active: true,
        role: 'USER',
        avatarUrl: null,
      })
    },
  })
}
