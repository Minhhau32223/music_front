import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest'
import { http, HttpResponse, delay } from 'msw'
import { setupServer } from 'msw/node'
import { apiClient } from './api-client'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { queryClient } from '@/lib/query-client'
const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => {
  useAuthStore.getState().setSession('expired')
  queryClient.clear()
})
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
it('refreshes once for concurrent 401s and retries original requests with tracing', async () => {
  let refreshes = 0
  server.use(
    http.post('http://localhost:8000/api/auth/refresh/', async () => {
      refreshes++
      await delay(30)
      return HttpResponse.json({ accessToken: 'fresh' })
    }),
    http.get('http://localhost:8000/api/test', ({ request }) => {
      expect(request.headers.get('x-request-id')).toBeTruthy()
      return request.headers.get('authorization') === 'Bearer fresh'
        ? HttpResponse.json({ ok: true })
        : new HttpResponse(null, { status: 401 })
    }),
  )
  const results = await Promise.all([apiClient.get('/test'), apiClient.get('/test')])
  expect(results.every((result) => result.data.ok)).toBe(true)
  expect(refreshes).toBe(1)
})
it('clears private cache when refresh fails without looping', async () => {
  queryClient.setQueryData(['workspace', 'admin'], ['private'])
  let refreshes = 0
  server.use(
    http.get('http://localhost:8000/api/test', () => new HttpResponse(null, { status: 401 })),
    http.post('http://localhost:8000/api/auth/refresh/', () => {
      refreshes++
      return new HttpResponse(null, { status: 401 })
    }),
  )
  await expect(apiClient.get('/test')).rejects.toMatchObject({ status: 401 })
  expect(refreshes).toBe(1)
  expect(useAuthStore.getState().accessToken).toBeNull()
  expect(queryClient.getQueryCache().getAll()).toHaveLength(0)
})
it('does not restore a session after logout during refresh', async () => {
  server.use(
    http.get('http://localhost:8000/api/test', () => new HttpResponse(null, { status: 401 })),
    http.post('http://localhost:8000/api/auth/refresh/', async () => {
      useAuthStore.getState().clearSession()
      return HttpResponse.json({ accessToken: 'late' })
    }),
  )
  await expect(apiClient.get('/test')).rejects.toMatchObject({ status: 401 })
  expect(useAuthStore.getState().status).toBe('unauthenticated')
})
