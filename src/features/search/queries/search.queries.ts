import { queryOptions } from '@tanstack/react-query'
import { retryDetailQuery } from '@/lib/query-retry'
import { searchApi } from '../api/search.api'
import { searchKeys } from './search.query-keys'
export const searchQuery = (query: string) =>
  queryOptions({
    queryKey: searchKeys.results(query),
    queryFn: ({ signal }) => searchApi.search(query, signal),
    staleTime: 45_000,
    gcTime: 600_000,
    retry: retryDetailQuery,
  })
