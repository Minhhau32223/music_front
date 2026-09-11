export const artistKeys = {
  all: ['artists'] as const,
  lists: () => [...artistKeys.all, 'list'] as const,
  list: () => [...artistKeys.lists()] as const,
  detail: (id: number) => [...artistKeys.all, 'detail', id] as const,
  tracks: (id: number) => [...artistKeys.detail(id), 'tracks'] as const,
  releases: (id: number) => [...artistKeys.detail(id), 'releases'] as const,
}
