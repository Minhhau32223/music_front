import { create } from 'zustand'
import type { AuthStatus } from '../types/auth.types'

type AuthState = {
  status: AuthStatus
  accessToken: string | null
  setAccessToken: (accessToken: string | null) => void
  setStatus: (status: AuthStatus) => void
  setSession: (accessToken: string) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'unknown',
  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  setStatus: (status) => set({ status }),
  setSession: (accessToken) => set({ accessToken, status: 'authenticated' }),
  clearSession: () => set({ accessToken: null, status: 'unauthenticated' }),
}))
