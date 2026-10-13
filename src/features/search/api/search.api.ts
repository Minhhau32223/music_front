import { apiClient } from '@/lib/api/api-client'
import { normalizeApiError } from '@/lib/api/api-error'
import { mapSearchResponse } from './search.mapper'
import type { SearchResponseDto } from '../types/search.dto'

export const normalizeSearchQuery = (query: string) => query.trim()

export const searchApi = {
  async search(query: string, signal?: AbortSignal) {
    try {
      const keyword = normalizeSearchQuery(query)
      const response = await apiClient.get<SearchResponseDto>('/search', {
        params: { keyword },
        signal,
      })
      return mapSearchResponse(response.data)
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
}
