import type { Song } from '@/features/songs/types/song.types'

export type PlaylistSummary = {
  id: number
  name: string
  artworkUrl?: string
  ownerId: number
  trackCount?: number
}

export type PlaylistDetail = PlaylistSummary

export type PlaylistTrack = {
  position: number
  song: Song
}

export type PlaylistFormValues = {
  name: string
}

export function canEditPlaylist(playlist: Pick<PlaylistSummary, 'ownerId'>, userId?: number) {
  return userId !== undefined && playlist.ownerId === userId
}
