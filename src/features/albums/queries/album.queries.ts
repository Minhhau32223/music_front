import { queryOptions } from '@tanstack/react-query'
import { retryDetailQuery } from '@/lib/query-retry'
import { albumApi } from '../api/album.api'
import { albumKeys } from './album.query-keys'

const detailCache = { staleTime: 300_000, gcTime: 1_800_000, retry: retryDetailQuery }

export const albumDetailQuery = (id: number) =>
  queryOptions({
    queryKey: albumKeys.detail(id),
    queryFn: ({ signal }) => albumApi.getAlbum(id, signal),
    ...detailCache,
  })

export const albumTracksQuery = (id: number) =>
  queryOptions({
    queryKey: albumKeys.tracks(id),
    queryFn: ({ signal }) => albumApi.getAlbumTracks(id, signal),
    ...detailCache,
  })
