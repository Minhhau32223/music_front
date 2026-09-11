import { apiClient } from '@/lib/api/api-client'
import { normalizeApiError } from '@/lib/api/api-error'
import {
  mapPlaylistDetailDto,
  mapPlaylistSummaryDto,
  mapPlaylistTracksDto,
} from './playlist.mapper'
import type {
  CreatePlaylistRequest,
  PlaylistDto,
  PlaylistTracksDto,
  UpdatePlaylistRequest,
} from '../types/playlist.dto'

async function normalized<T>(request: () => Promise<T>) {
  try {
    return await request()
  } catch (error) {
    throw normalizeApiError(error)
  }
}

export const playlistApi = {
  getPlaylists: (signal?: AbortSignal) =>
    normalized(async () =>
      (await apiClient.get<PlaylistDto[]>('/playlists/', { signal })).data.map(
        mapPlaylistSummaryDto,
      ),
    ),
  getPlaylist: (id: number, signal?: AbortSignal) =>
    normalized(async () =>
      mapPlaylistDetailDto((await apiClient.get<PlaylistDto>(`/playlists/${id}`, { signal })).data),
    ),
  getPlaylistTracks: (id: number, signal?: AbortSignal) =>
    normalized(async () =>
      mapPlaylistTracksDto(
        (await apiClient.get<PlaylistTracksDto>(`/playlists/${id}/songs`, { signal })).data,
      ),
    ),
  createPlaylist: (input: CreatePlaylistRequest) =>
    normalized(async () =>
      mapPlaylistDetailDto((await apiClient.post<PlaylistDto>('/playlists/create', input)).data),
    ),
  updatePlaylist: (id: number, input: UpdatePlaylistRequest) =>
    normalized(async () => {
      const body = new FormData()
      body.append('name', input.name)
      return mapPlaylistDetailDto((await apiClient.put<PlaylistDto>(`/playlists/${id}`, body)).data)
    }),
  deletePlaylist: (id: number) =>
    normalized(async () => void (await apiClient.delete(`/playlists/${id}`))),
  addSong: (playlistId: number, songId: number) =>
    normalized(
      async () => void (await apiClient.post(`/playlists/${playlistId}/songs`, { songId })),
    ),
  removeSong: (playlistId: number, songId: number) =>
    normalized(
      async () => void (await apiClient.delete(`/playlists/${playlistId}/songs/${songId}`)),
    ),
}
