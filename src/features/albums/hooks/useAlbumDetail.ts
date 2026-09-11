import { useQuery } from '@tanstack/react-query'
import { albumDetailQuery, albumTracksQuery } from '../queries/album.queries'

export function useAlbumDetail(id: number | null) {
  return useQuery({ ...albumDetailQuery(id ?? 0), enabled: id !== null })
}

export function useAlbumTracks(id: number | null) {
  return useQuery({ ...albumTracksQuery(id ?? 0), enabled: id !== null })
}
