import { queryOptions } from '@tanstack/react-query'
import { retryDetailQuery } from '@/lib/query-retry'
import { songApi } from '../api/song.api'
import { songKeys } from './song.query-keys'

export const songDetailQuery = (id: number) =>
  queryOptions({
    queryKey: songKeys.detail(id),
    queryFn: ({ signal }) => songApi.getSong(id, signal),
    staleTime: 300_000,
    gcTime: 1_800_000,
    retry: retryDetailQuery,
  })
