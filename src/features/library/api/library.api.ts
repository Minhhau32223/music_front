import { apiClient } from '@/lib/api/api-client'
import { normalizeApiError } from '@/lib/api/api-error'
import { mapArtistDto } from '@/features/artists/api/artist.mapper'
import type { ArtistDto } from '@/features/artists/types/artist.dto'

async function normalized(request: () => Promise<void>) {
  try {
    await request()
  } catch (error) {
    throw normalizeApiError(error)
  }
}

export const libraryApi = {
  async getFollowedArtists(signal?: AbortSignal) {
    try {
      return (await apiClient.get<ArtistDto[]>('/artist-follows/me/', { signal })).data.map(
        mapArtistDto,
      )
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
  followArtist: (artistId: number) =>
    normalized(async () => void (await apiClient.post(`/artist-follows/${artistId}/`))),
  unfollowArtist: (artistId: number) =>
    normalized(async () => void (await apiClient.delete(`/artist-follows/${artistId}/`))),
}
