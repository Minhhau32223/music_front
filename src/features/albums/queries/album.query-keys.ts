export const albumKeys = {
  all: ['albums'] as const,
  lists: () => [...albumKeys.all, 'list'] as const,
  list: () => [...albumKeys.lists()] as const,
  detail: (id: number) => [...albumKeys.all, 'detail', id] as const,
  tracks: (id: number) => [...albumKeys.detail(id), 'tracks'] as const,
  newReleases: (limit: number) => [...albumKeys.all, 'new-releases', { limit }] as const,
}
