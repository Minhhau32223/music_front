import type { AlbumSummary } from '@/features/albums/types/album.types'
import type { ArtistSummary } from '@/features/artists/types/artist.types'
import type { Song } from '@/features/songs/types/song.types'

export type SearchResult = {
  songs: Song[]
  albums: AlbumSummary[]
  artists: ArtistSummary[]
  totalCount: number
}
