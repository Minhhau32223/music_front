import axios from 'axios'

export type ApiError = {
  status: number
  code?: string
  message: string
  fieldErrors?: Record<string, string>
  kind: 'auth' | 'network' | 'validation' | 'server' | 'unknown'
}

type ErrorEnvelope = {
  message?: string
  code?: string
  errors?: Record<string, string>
  fieldErrors?: Record<string, string>
}

const messages: Record<number, string> = {
  400: 'Please check the information you entered.',
  401: 'Your session is invalid or has expired.',
  403: 'You do not have permission to do that.',
  404: 'The requested resource could not be found.',
  409: 'That information is already in use.',
  422: 'Some fields need your attention.',
  429: 'Too many requests. Please wait and try again.',
}

export function normalizeApiError(error: unknown): ApiError {
  if (isApiError(error)) return error

  if (!axios.isAxiosError<ErrorEnvelope>(error)) {
    return { status: 0, message: 'Something went wrong. Please try again.', kind: 'unknown' }
  }

  if (!error.response) {
    return {
      status: 0,
      message: "We couldn't connect to NOCTURNE. Please try again.",
      kind: 'network',
    }
  }

  const status = error.response.status
  const payload = error.response.data
  const fieldErrors = payload?.fieldErrors ?? payload?.errors
  const kind =
    status === 401 ? 'auth' : fieldErrors ? 'validation' : status >= 500 ? 'server' : 'unknown'
  const safeBackendMessage = status === 409 || status === 400 ? payload?.message : undefined

  return {
    status,
    code: payload?.code,
    message:
      safeBackendMessage ??
      messages[status] ??
      (status >= 500 ? 'NOCTURNE is unavailable right now. Please try again.' : 'Request failed.'),
    fieldErrors,
    kind,
  }
}

export function isApiError(error: unknown): error is ApiError {
  return Boolean(error && typeof error === 'object' && 'status' in error && 'kind' in error)
}
