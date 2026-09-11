import { parseDurationToMs } from '@/lib/format/duration'
import type { SongDto } from '../types/song.dto'
import type { Song, SongDetail } from '../types/song.types'
export function mapSongDto(dto: SongDto): Song {
  const artworkUrl = dto.image || undefined
  return {
    id: dto.id,
    title: dto.name,
    durationMs: parseDurationToMs(dto.duration),
    audioUrl: dto.file,
    artworkUrl,
    playCount: dto.playCount ?? 0,
    artist: { id: dto.artistId, name: dto.artistName || 'Unknown artist' },
    album:
      dto.albumId == null
        ? undefined
        : {
            id: dto.albumId,
            title: dto.albumName || 'Unknown album',
            artworkUrl,
            artistId: dto.artistId,
            artistName: dto.artistName || 'Unknown artist',
          },
  }
}

export const mapSongDetailDto = (dto: SongDto): SongDetail => mapSongDto(dto)
