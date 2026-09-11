import { apiClient } from '@/lib/api/api-client'
import { normalizeApiError } from '@/lib/api/api-error'
import { mapPageResult, type PageResponseDto } from '@/lib/pagination/pagination.types'
import { mapSongDetailDto, mapSongDto } from './song.mapper'
import type { SongDto } from '../types/song.dto'
import type { SongListParams } from '../types/song.types'
export const songApi = {
  async getSongs(params: SongListParams = {}, signal?: AbortSignal) {
    try {
      const data = (
        await apiClient.get<PageResponseDto<SongDto>>('/songs/filter', { params, signal })
      ).data
      return mapPageResult(data, mapSongDto)
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
  async getSong(id: number, signal?: AbortSignal) {
    try {
      return mapSongDetailDto((await apiClient.get<SongDto>(`/songs/${id}/`, { signal })).data)
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
  async getLatestSongs(limit = 6) {
    return this.getSongs({ page: 0, size: limit, sortBy: 'createdAt', sortDirection: 'DESC' })
  },
  async getPopularSongs(limit = 8) {
    try {
      return (
        await apiClient.get<SongDto[]>('/recommendations/top-songs', { params: { limit } })
      ).data.map(mapSongDto)
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
}
