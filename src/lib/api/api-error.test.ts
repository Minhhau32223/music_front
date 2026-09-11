import axios from 'axios'
import { describe, expect, it } from 'vitest'
import { normalizeApiError } from './api-error'

describe('normalizeApiError', () => {
  it('keeps network failures separate from expired sessions', () => {
    const error = new axios.AxiosError('Network Error')
    expect(normalizeApiError(error)).toMatchObject({ status: 0, kind: 'network' })
  })

  it('normalizes 401 as an auth failure', () => {
    const error = new axios.AxiosError('Unauthorized', 'ERR_BAD_REQUEST', undefined, undefined, {
      status: 401,
      statusText: 'Unauthorized',
      headers: {},
      config: { headers: new axios.AxiosHeaders() },
      data: { message: 'raw backend detail' },
    })
    expect(normalizeApiError(error)).toMatchObject({ status: 401, kind: 'auth' })
  })

  it('does not normalize an ApiError twice', () => {
    const error = { status: 409, kind: 'unknown' as const, message: 'Email already exists.' }
    expect(normalizeApiError(error)).toBe(error)
  })
})
