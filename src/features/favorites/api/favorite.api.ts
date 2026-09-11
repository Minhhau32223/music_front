import { apiClient } from '@/lib/api/api-client'
import { normalizeApiError } from '@/lib/api/api-error'
import { mapSongDto } from '@/features/songs/api/song.mapper'
import type { SongDto } from '@/features/songs/types/song.dto'

async function normalized(request: () => Promise<void>) {
  try {
    await request()
  } catch (error) {
    throw normalizeApiError(error)
  }
}

export const favoriteApi = {
  async getLikedSongs(signal?: AbortSignal) {
    try {
      return (await apiClient.get<SongDto[]>('/favorites/me', { signal })).data.map(mapSongDto)
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
  likeSong: (songId: number) =>
    normalized(async () => void (await apiClient.post(`/favorites/${songId}`))),
  unlikeSong: (songId: number) =>
    normalized(async () => void (await apiClient.delete(`/favorites/${songId}`))),
}
