import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, renderHook, screen, act, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { RoleRoute } from '@/features/auth/components/RoleRoute'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { currentUserQueryKey } from '@/features/auth/hooks/useCurrentUser'
import { contentForm, workspaceApi } from './api'
import { applicationQuery, useWorkspaceMutation, workspaceKeys } from './queries'
import { retryDetailQuery } from '@/lib/query-retry'

const application = {
  id: 1,
  userId: 1,
  artistName: 'Test',
  bio: 'Bio',
  profileImage: 'https://example.com/a.png',
  status: 'PENDING',
  submittedAt: '2026-10-01T10:00:00',
  reviewedAt: null,
  reviewedBy: null,
  rejectionReason: null,
}
const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => useAuthStore.getState().setSession('test'))
afterEach(() => {
  server.resetHandlers()
  vi.restoreAllMocks()
})
afterAll(() => server.close())

describe('workspace contract', () => {
  it('sends only application fields and maps null moderation metadata', async () => {
    server.use(
      http.post('http://localhost:8000/api/artist-applications', async ({ request }) => {
        expect(request.headers.get('authorization')).toBe('Bearer test')
        expect(request.headers.get('x-request-id')).toBeTruthy()
        expect(await request.json()).toEqual({
          artistName: 'Test',
          bio: 'Bio',
          profileImage: application.profileImage,
        })
        return HttpResponse.json(application)
      }),
    )
    expect(await workspaceApi.apply({ ...application, artistName: ' Test ' })).toMatchObject({
      status: 'PENDING',
      reviewedAt: null,
    })
  })
  it('whitelists multipart fields and leaves boundary to the browser', () => {
    const file = new File(['audio'], 'song.mp3', { type: 'audio/mpeg' })
    const data = contentForm('songs', {
      name: ' Song ',
      lyrics: 'Lyrics',
      albumId: 2,
      file,
      ...{ artistId: 9, status: 'PUBLISHED', publishedAt: 'now' },
    })
    expect([...data.keys()].sort()).toEqual(['albumId', 'file', 'lyrics', 'name'])
    expect(data.get('name')).toBe('Song')
  })
  it.each([403, 404, 409, 422])('surfaces %i without retrying', async (status) => {
    let calls = 0
    server.use(
      http.get('http://localhost:8000/api/artist-applications/me', () => {
        calls++
        return HttpResponse.json({ message: 'Conflict' }, { status })
      }),
    )
    const client = new QueryClient()
    await expect(client.fetchQuery(applicationQuery())).rejects.toMatchObject({ status })
    expect(calls).toBe(1)
    expect(retryDetailQuery(0, { status, kind: 'unknown' })).toBe(false)
    client.clear()
  })
  it('sends reject reason and invalidates only workspace and public catalog scopes', async () => {
    server.use(
      http.patch(
        'http://localhost:8000/api/admin/artist-applications/1/reject',
        async ({ request }) => {
          expect(await request.json()).toEqual({ rejectionReason: 'Incomplete' })
          return HttpResponse.json({ ...application, status: 'REJECTED' })
        },
      ),
    )
    const client = new QueryClient()
    client.setQueryData(workspaceKeys.admin, [])
    client.setQueryData(['favorites', 'songs'], [])
    const invalidation = vi.spyOn(client, 'invalidateQueries')
    const { result } = renderHook(
      () =>
        useWorkspaceMutation(
          () => workspaceApi.review('artist-applications', 1, 'reject', ' Incomplete '),
          'admin',
        ),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={client}>{children}</QueryClientProvider>
        ),
      },
    )
    await act(async () => {
      await result.current.mutateAsync()
    })
    expect(invalidation).toHaveBeenCalledWith({ queryKey: workspaceKeys.admin })
    expect(client.getQueryState(['favorites', 'songs'])?.isInvalidated).toBe(false)
  })
  it('keeps cached content unchanged on failed mutation and refetches its scope', async () => {
    const client = new QueryClient()
    client.setQueryData([...workspaceKeys.artist, 'songs'], [{ id: 1, status: 'DRAFT' }])
    const { result } = renderHook(
      () =>
        useWorkspaceMutation(async () => {
          throw { status: 409, kind: 'unknown' }
        }, 'artist'),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={client}>{children}</QueryClientProvider>
        ),
      },
    )
    await act(async () => {
      await result.current.mutateAsync().catch(() => undefined)
    })
    expect(client.getQueryData([...workspaceKeys.artist, 'songs'])).toEqual([
      { id: 1, status: 'DRAFT' },
    ])
    expect(client.getQueryState([...workspaceKeys.artist, 'songs'])?.isInvalidated).toBe(true)
  })
})
describe('role boundaries', () => {
  it.each([
    ['ARTIST', 'ARTIST', true],
    ['ADMIN', 'ADMIN', true],
    ['USER', 'ARTIST', false],
    ['ADMIN', 'ARTIST', false],
    ['ARTIST', 'ADMIN', false],
  ] as const)('%s accessing %s: %s', async (role, required, allowed) => {
    const client = new QueryClient()
    client.setQueryData(currentUserQueryKey, { id: 1, role })
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={['/workspace']}>
          <Routes>
            <Route element={<RoleRoute role={required} />}>
              <Route path="/workspace" element={<p>Workspace content</p>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    )
    await waitFor(() => expect(screen.queryByText('Workspace content') !== null).toBe(allowed))
    if (!allowed) expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
