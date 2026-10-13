import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/features/auth/store/auth.store'
import type { AccessTokenResponse } from '@/features/auth/types/auth.types'
import { isApiError, normalizeApiError } from './api-error'
import { accessTokenRefreshManager } from './refresh-manager'
import { env } from '@/app/config/env'

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean; _startedAt?: number }

const baseURL = env.apiBaseUrl

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

sessionClient.interceptors.request.use((config) => {
  if (!config.headers.has('X-Request-ID')) config.headers.set('X-Request-ID', crypto.randomUUID())
  return config
})

apiClient.interceptors.request.use((config: RetryableConfig) => {
  config._startedAt = performance.now()
  const session = useAuthStore.getState()
  const accessToken = session.status === 'authenticated' ? session.accessToken : null
  config.headers = AxiosHeaders.from(config.headers)
  if (!config.headers.has('X-Request-ID')) config.headers.set('X-Request-ID', crypto.randomUUID())
  if (!accessToken) config.headers.delete('Authorization')
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
    if (error.response?.status === 401 && original._retry && !isAuthEndpoint)
      useAuthStore.getState().clearSession()
    if (
      error.response?.status !== 401 ||
      original._retry ||
      isAuthEndpoint ||
      useAuthStore.getState().status === 'unauthenticated'
    ) {
      return Promise.reject(normalizeApiError(error))
    }

    original._retry = true
    const currentToken = useAuthStore.getState().accessToken
    if (currentToken && original.headers.get('Authorization') !== `Bearer ${currentToken}`) {
      original.headers.set('Authorization', `Bearer ${currentToken}`)
      return apiClient(original)
    }
    const refreshSessionToken = useAuthStore.getState().accessToken
    try {
      const accessToken = await accessTokenRefreshManager.run(async () => {
        const startedToken = useAuthStore.getState().accessToken
        const response = await sessionClient.post<AccessTokenResponse>('/auth/refresh/')
        if (
          useAuthStore.getState().accessToken !== startedToken ||
          useAuthStore.getState().status === 'unauthenticated'
        ) {
          throw { status: 401, kind: 'auth', message: 'Session changed during refresh.' }
        }
        useAuthStore.getState().setSession(response.data.accessToken)
        return response.data.accessToken
      })
      original.headers = AxiosHeaders.from(original.headers)
      original.headers.set('Authorization', `Bearer ${accessToken}`)
      return apiClient(original)
    } catch (refreshError) {
      const normalized = isApiError(refreshError) ? refreshError : normalizeApiError(refreshError)
      if (useAuthStore.getState().accessToken === refreshSessionToken)
        useAuthStore.getState().clearSession()
      return Promise.reject(normalized)
    }
  },
)
