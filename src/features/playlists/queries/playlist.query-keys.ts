export const playlistKeys = {
  all: ['playlists'] as const,
  lists: () => [...playlistKeys.all, 'list'] as const,
  list: () => [...playlistKeys.lists()] as const,
  detail: (id: number) => [...playlistKeys.all, 'detail', id] as const,
  tracks: (id: number) => [...playlistKeys.detail(id), 'tracks'] as const,
}
