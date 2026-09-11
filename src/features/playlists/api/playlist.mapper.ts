import { mapSongDto } from '@/features/songs/api/song.mapper'
import type { PlaylistDto, PlaylistTracksDto } from '../types/playlist.dto'
import type { PlaylistDetail, PlaylistSummary, PlaylistTrack } from '../types/playlist.types'

export const mapPlaylistSummaryDto = (dto: PlaylistDto): PlaylistSummary => ({
  id: dto.id,
  name: dto.name,
  artworkUrl: dto.image || undefined,
  ownerId: dto.userId,
})

export const mapPlaylistDetailDto = (dto: PlaylistDto): PlaylistDetail => ({
  id: dto.id,
  name: dto.name,
  artworkUrl: dto.image || undefined,
  ownerId: dto.userId,
})

export const mapPlaylistTracksDto = (dto: PlaylistTracksDto): PlaylistTrack[] =>
  dto.map((song, position) => ({ position, song: mapSongDto(song) }))
