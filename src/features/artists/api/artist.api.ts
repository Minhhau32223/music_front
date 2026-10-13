import { apiClient } from '@/lib/api/api-client'
import { normalizeApiError } from '@/lib/api/api-error'
import { mapArtistDetailDto, mapArtistDto } from './artist.mapper'
import type { ArtistDto } from '../types/artist.dto'
import { songApi } from '@/features/songs/api/song.api'
import type { AlbumSummary } from '@/features/albums/types/album.types'
export const artistApi = {
  async getArtists(signal?: AbortSignal) {
    try {
      return (await apiClient.get<ArtistDto[]>('/artists/', { signal })).data.map(mapArtistDto)
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
  async getArtist(id: number, signal?: AbortSignal) {
    try {
      return mapArtistDetailDto(
        (await apiClient.get<ArtistDto>(`/artists/${id}/`, { signal })).data,
      )
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
  async getArtistTracks(id: number, signal?: AbortSignal) {
    const page = await songApi.getSongs(
      {
        artistId: id,
        page: 0,
        size: 100,
        sortBy: 'playCount',
        sortDirection: 'DESC',
      },
      signal,
    )
    return page.items
  },
  async getArtistReleases(id: number, signal?: AbortSignal): Promise<AlbumSummary[]> {
    const page = await songApi.getSongs(
      {
        artistId: id,
        page: 0,
        size: 100,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
      },
      signal,
    )
    const releases = new Map<number, AlbumSummary>()
    page.items.forEach((song) => {
      if (song.album && !releases.has(song.album.id)) releases.set(song.album.id, song.album)
    })
    return [...releases.values()]
  },
}
