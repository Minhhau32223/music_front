import type { SongDto } from '@/features/songs/types/song.dto'

export type PlaylistDto = {
  id: number
  name: string
  image: string | null
  userId: number
}

export type PlaylistTracksDto = SongDto[]

export type CreatePlaylistRequest = {
  name: string
  image?: string
}

export type UpdatePlaylistRequest = {
  name: string
}
