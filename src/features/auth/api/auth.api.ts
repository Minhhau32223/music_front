import { apiClient, sessionClient } from '@/lib/api/api-client'
import { normalizeApiError } from '@/lib/api/api-error'
import type {
  AccessTokenResponse,
  CurrentUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../types/auth.types'

async function withNormalizedError<T>(request: () => Promise<T>): Promise<T> {
  try {
    return await request()
  } catch (error) {
    throw normalizeApiError(error)
  }
}

export const authApi = {
  login: (request: LoginRequest) =>
    withNormalizedError(
      async () => (await apiClient.post<LoginResponse>('/auth/login/', request)).data,
    ),
  register: (request: RegisterRequest) =>
    withNormalizedError(
      async () => (await apiClient.post<RegisterResponse>('/auth/register/', request)).data,
    ),
  refresh: () =>
    withNormalizedError(
      async () => (await sessionClient.post<AccessTokenResponse>('/auth/refresh/')).data,
    ),
  logout: () => withNormalizedError(async () => void (await sessionClient.post('/auth/logout/'))),
  getCurrentUser: (signal?: AbortSignal) =>
    withNormalizedError(
      async () => (await apiClient.get<CurrentUser>('/users/me/', { signal })).data,
    ),
}
