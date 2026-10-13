import { mapAlbumDto } from '@/features/albums/api/album.mapper'
import { mapArtistDto } from '@/features/artists/api/artist.mapper'
import { mapSongDto } from '@/features/songs/api/song.mapper'
import type { SearchResponseDto } from '../types/search.dto'
import type { SearchResult } from '../types/search.types'

export function mapSearchResponse(dto: SearchResponseDto): SearchResult {
  const songs = (dto.songs ?? []).map(mapSongDto)
  const albums = (dto.albums ?? []).map(mapAlbumDto)
  const artists = (dto.artists ?? []).map(mapArtistDto)

  return {
    songs,
    albums,
    artists,
    totalCount: songs.length + albums.length + artists.length,
  }
}
