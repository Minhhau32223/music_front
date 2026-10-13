import type { AlbumDto } from '@/features/albums/types/album.dto'
import type { ArtistDto } from '@/features/artists/types/artist.dto'
import type { SongDto } from '@/features/songs/types/song.dto'

export type SearchResponseDto = {
  songs: SongDto[]
  albums: AlbumDto[]
  artists: ArtistDto[]
}
