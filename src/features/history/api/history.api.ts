import { apiClient } from '@/lib/api/api-client'
import { normalizeApiError } from '@/lib/api/api-error'

export type RecentlyPlayedDto = {
  songId: number
  songName: string
  image: string | null
  artistName: string | null
  playedAt: string
}

export const historyApi = {
  async record(songId: number) {
    try {
      await apiClient.post('/recently-played/play', { songId })
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
  async getRecent(signal?: AbortSignal) {
    try {
      return (await apiClient.get<RecentlyPlayedDto[]>('/recently-played/me', { signal })).data
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
}
