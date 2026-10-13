import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/toast-context'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'
import { clearRecentSearches } from '@/features/search'

export function useLogout() {
  const clearSession = useAuthStore((state) => state.clearSession)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearSession()
      clearRecentSearches()
      queryClient.clear()
      showToast('You have been signed out.', 'success')
      navigate('/login', { replace: true })
    },
  })
}
