import type { SongListParams } from '../types/song.types'
export const songKeys = {
  all: ['songs'] as const,
  lists: () => [...songKeys.all, 'list'] as const,
  list: (params: SongListParams) => [...songKeys.lists(), params] as const,
  detail: (id: number) => [...songKeys.all, 'detail', id] as const,
  latest: (limit: number) => [...songKeys.all, 'latest', { limit }] as const,
  popular: (limit: number) => [...songKeys.all, 'popular', { limit }] as const,
}
