import { useQuery } from '@tanstack/react-query'
import { normalizeSearchQuery } from '../api/search.api'
import { searchQuery } from '../queries/search.queries'

export const MIN_SEARCH_LENGTH = 2

export function useSearch(query: string) {
  const normalizedQuery = normalizeSearchQuery(query)

  return useQuery({
    ...searchQuery(normalizedQuery),
    enabled: normalizedQuery.length >= MIN_SEARCH_LENGTH,
  })
}
