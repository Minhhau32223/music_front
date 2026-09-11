import type { AlbumSummary } from '@/features/albums/types/album.types'
import type { ArtistSummary } from '@/features/artists/types/artist.types'
export type Song = {
  id: number
  title: string
  durationMs: number
  audioUrl: string
  artworkUrl?: string
  artist: ArtistSummary
  album?: AlbumSummary
  playCount: number
}
export type SongDetail = Song
export type SongListParams = {
  page?: number
  size?: number
  sortBy?: 'playCount' | 'id' | 'createdAt' | 'name'
  sortDirection?: 'ASC' | 'DESC'
  artistId?: number
  albumId?: number
}
export type PlayableTrack = {
  id: number
  title: string
  artistId: number
  artistName: string
  albumId?: number
  albumTitle?: string
  artworkUrl?: string
  audioUrl: string
  durationMs: number
}
export const toPlayableTrack = (song: Song): PlayableTrack => ({
  id: song.id,
  title: song.title,
  artistId: song.artist.id,
  artistName: song.artist.name,
  albumId: song.album?.id,
  albumTitle: song.album?.title,
  artworkUrl: song.artworkUrl,
  audioUrl: song.audioUrl,
  durationMs: song.durationMs,
})
