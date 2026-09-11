import { apiClient } from '@/lib/api/api-client'
import { normalizeApiError } from '@/lib/api/api-error'
import { mapSongDto } from '@/features/songs/api/song.mapper'
import type { SongDto } from '@/features/songs/types/song.dto'
import { mapAlbumDetailDto, mapAlbumDto } from './album.mapper'
import type { AlbumDto } from '../types/album.dto'
import type { AlbumSummary } from '../types/album.types'
export const albumApi = {
  async getAlbums() {
    try {
      return (await apiClient.get<AlbumDto[]>('/albums/')).data.map(mapAlbumDto)
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
  async getAlbum(id: number, signal?: AbortSignal) {
    try {
      return mapAlbumDetailDto((await apiClient.get<AlbumDto>(`/albums/${id}/`, { signal })).data)
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
  async getAlbumTracks(id: number, signal?: AbortSignal) {
    try {
      const songs = (await apiClient.get<SongDto[]>(`/albums/${id}/songs/`, { signal })).data
      return songs.map(mapSongDto)
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
  async getNewReleases(limit = 6): Promise<AlbumSummary[]> {
    try {
      const songs = (
        await apiClient.get<SongDto[]>('/recommendations/new-releases', { params: { limit } })
      ).data.map(mapSongDto)
      const albums = new Map<number, AlbumSummary>()
      songs.forEach((song) => {
        if (song.album) albums.set(song.album.id, song.album)
      })
      return [...albums.values()]
    } catch (error) {
      throw normalizeApiError(error)
    }
  },
}
