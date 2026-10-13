import { QueryClient } from '@tanstack/react-query'
import { retryDetailQuery } from './query-retry'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 15 * 60_000,
      retry: retryDetailQuery,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
})
