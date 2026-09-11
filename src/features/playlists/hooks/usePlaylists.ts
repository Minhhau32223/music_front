import { useQuery } from '@tanstack/react-query'
import {
  playlistDetailQuery,
  playlistListQuery,
  playlistTracksQuery,
} from '../queries/playlist.queries'

export function usePlaylists() {
  return useQuery(playlistListQuery())
}

export function usePlaylistDetail(id: number | null) {
  return useQuery({ ...playlistDetailQuery(id ?? 0), enabled: id !== null })
}

export function usePlaylistTracks(id: number | null) {
  return useQuery({ ...playlistTracksQuery(id ?? 0), enabled: id !== null })
}
