import { useQuery } from '@tanstack/react-query'
import {
  artistDetailQuery,
  artistReleasesQuery,
  artistTracksQuery,
} from '../queries/artist.queries'

export function useArtistDetail(id: number | null) {
  return useQuery({ ...artistDetailQuery(id ?? 0), enabled: id !== null })
}

export function useArtistTracks(id: number | null) {
  return useQuery({ ...artistTracksQuery(id ?? 0), enabled: id !== null })
}

export function useArtistReleases(id: number | null) {
  return useQuery({ ...artistReleasesQuery(id ?? 0), enabled: id !== null })
}
