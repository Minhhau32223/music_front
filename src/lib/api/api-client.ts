import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/features/auth/store/auth.store'
import type { AccessTokenResponse } from '@/features/auth/types/auth.types'
import { isApiError, normalizeApiError } from './api-error'
import { accessTokenRefreshManager } from './refresh-manager'

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean; _startedAt?: number }

const localApiBaseUrl =
  typeof window === 'undefined'
    ? 'http://localhost:8000/api'
    : `http://${window.location.hostname}:8000/api`
const baseURL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? localApiBaseUrl : 'http://localhost:8000/api')

export const apiClient = axios.create({
  baseURL,
  timeout: 12_000,
  withCredentials: true,
  headers: { Accept: 'application/json' },
})

export const sessionClient = axios.create({
  baseURL,
  timeout: 12_000,
  withCredentials: true,
  headers: { Accept: 'application/json' },
})

apiClient.interceptors.request.use((config: RetryableConfig) => {
  config._startedAt = performance.now()
  const accessToken = useAuthStore.getState().accessToken
  if (accessToken) {
    config.headers = AxiosHeaders.from(config.headers)
    config.headers.set('Authorization', `Bearer ${accessToken}`)
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      const config = response.config as RetryableConfig
      const duration = config._startedAt ? Math.round(performance.now() - config._startedAt) : 0
      console.info(
        `[API] ${config.method?.toUpperCase()} ${config.url} ${response.status} ${duration}ms`,
      )
    }
    return response
  },
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.config) {
      return Promise.reject(normalizeApiError(error))
    }

    const original = error.config as RetryableConfig
    const isAuthEndpoint = original.url?.includes('/auth/') ?? false
    if (error.response?.status !== 401 || original._retry || isAuthEndpoint) {
      return Promise.reject(normalizeApiError(error))
    }

    original._retry = true
    try {
      const accessToken = await accessTokenRefreshManager.run(async () => {
        const response = await sessionClient.post<AccessTokenResponse>('/auth/refresh/')
        useAuthStore.getState().setSession(response.data.accessToken)
        return response.data.accessToken
      })
      original.headers = AxiosHeaders.from(original.headers)
      original.headers.set('Authorization', `Bearer ${accessToken}`)
      return apiClient(original)
    } catch (refreshError) {
      const normalized = isApiError(refreshError) ? refreshError : normalizeApiError(refreshError)
      if (normalized.status === 401) {
        useAuthStore.getState().clearSession()
      }
      return Promise.reject(normalized)
    }
  },
)
