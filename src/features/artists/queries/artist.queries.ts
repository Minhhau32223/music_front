import { queryOptions } from '@tanstack/react-query'
import { retryDetailQuery } from '@/lib/query-retry'
import { artistApi } from '../api/artist.api'
import { artistKeys } from './artist.query-keys'

const detailCache = { staleTime: 300_000, gcTime: 1_800_000, retry: retryDetailQuery }

export const artistDetailQuery = (id: number) =>
  queryOptions({
    queryKey: artistKeys.detail(id),
    queryFn: ({ signal }) => artistApi.getArtist(id, signal),
    ...detailCache,
  })

export const artistTracksQuery = (id: number) =>
  queryOptions({
    queryKey: artistKeys.tracks(id),
    queryFn: ({ signal }) => artistApi.getArtistTracks(id, signal),
    ...detailCache,
  })

export const artistReleasesQuery = (id: number) =>
  queryOptions({
    queryKey: artistKeys.releases(id),
    queryFn: ({ signal }) => artistApi.getArtistReleases(id, signal),
    ...detailCache,
  })
