import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { retryDetailQuery } from '@/lib/query-retry'
import { workspaceApi } from './api'
import type { ReviewKind, ArtistApplication, ArtistContent } from './types'

export const workspaceKeys = {
  root: ['workspace'] as const,
  artist: ['workspace', 'artist'] as const,
  admin: ['workspace', 'admin'] as const,
  applications: ['workspace', 'applications'] as const,
}
const policy = { staleTime: 30_000, gcTime: 15 * 60_000, retry: retryDetailQuery }
export const applicationQuery = () =>
  queryOptions({
    ...policy,
    queryKey: workspaceKeys.applications,
    queryFn: ({ signal }) => workspaceApi.applications(signal),
  })
export const profileQuery = () =>
  queryOptions({
    ...policy,
    queryKey: [...workspaceKeys.artist, 'profile'],
    queryFn: ({ signal }) => workspaceApi.profile(signal),
  })
export const contentQuery = (kind: 'songs' | 'albums') =>
  queryOptions({
    ...policy,
    queryKey: [...workspaceKeys.artist, kind],
    queryFn: ({ signal }) => workspaceApi.content(kind, signal),
  })
export const moderationQuery = (kind: ReviewKind) =>
  queryOptions({
    ...policy,
    queryKey: [...workspaceKeys.admin, kind],
    queryFn: async ({ signal }): Promise<(ArtistApplication | ArtistContent)[]> =>
      kind === 'artist-applications'
        ? workspaceApi.pendingApplications(signal)
        : workspaceApi.pendingContent(kind, signal),
  })

export function useWorkspaceMutation<T, R>(
  mutationFn: (input: T) => Promise<R>,
  scope: 'artist' | 'admin' | 'applications',
) {
  const client = useQueryClient()
  return useMutation({
    mutationFn,
    retry: false,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: workspaceKeys[scope] })
      if (scope !== 'applications')
        await Promise.all(
          ['songs', 'albums', 'artists', 'search'].map((key) =>
            client.invalidateQueries({ queryKey: [key] }),
          ),
        )
    },
    onError: () => {
      void client.invalidateQueries({ queryKey: workspaceKeys[scope] })
    },
  })
}
