import { isApiError } from './api/api-error'

export function retryDetailQuery(failureCount: number, error: unknown) {
  if (isApiError(error) && (error.status === 400 || error.status === 404)) return false
  return failureCount < 1
}
