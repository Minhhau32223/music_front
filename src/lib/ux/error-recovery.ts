import { isApiError } from '@/lib/api/api-error'

export type UiErrorKind =
  | 'NETWORK'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION'
  | 'RATE_LIMITED'
  | 'SERVER'
  | 'PLAYBACK'
  | 'UNKNOWN'

export function getUiErrorKind(error: unknown): UiErrorKind {
  if (!isApiError(error)) return 'UNKNOWN'
  if (error.kind === 'network') return 'NETWORK'
  if (error.kind === 'validation') return 'VALIDATION'
  if (error.kind === 'server') return 'SERVER'

  switch (error.status) {
    case 401:
      return 'UNAUTHORIZED'
    case 403:
      return 'FORBIDDEN'
    case 404:
      return 'NOT_FOUND'
    case 409:
      return 'CONFLICT'
    case 422:
      return 'VALIDATION'
    case 429:
      return 'RATE_LIMITED'
    default:
      return 'UNKNOWN'
  }
}

export function getErrorRecovery(error: unknown) {
  switch (getUiErrorKind(error)) {
    case 'NETWORK':
      return { title: 'You’re offline', message: 'Check your connection, then try again.' }
    case 'UNAUTHORIZED':
      return { title: 'Your session has ended', message: 'Please sign in again to continue.' }
    case 'FORBIDDEN':
      return {
        title: 'This action isn’t available',
        message: 'You do not have permission to access this.',
      }
    case 'NOT_FOUND':
      return {
        title: 'We couldn’t find that',
        message: 'It may have been removed or is no longer available.',
      }
    case 'CONFLICT':
      return {
        title: 'That already exists',
        message: 'Review the information and try a different value.',
      }
    case 'VALIDATION':
      return { title: 'Check the information', message: 'Some fields need your attention.' }
    case 'RATE_LIMITED':
      return {
        title: 'Please wait a moment',
        message: 'Too many requests were made. Try again shortly.',
      }
    case 'SERVER':
      return {
        title: 'NOCTURNE is temporarily unavailable',
        message: 'Please try again in a moment.',
      }
    case 'PLAYBACK':
      return { title: 'Playback needs attention', message: 'Try playing this track again.' }
    default:
      return { title: 'Something went wrong', message: 'Please try again.' }
  }
}
