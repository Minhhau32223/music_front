import { describe, expect, it } from 'vitest'
import { getErrorRecovery, getUiErrorKind } from './error-recovery'

describe('error recovery', () => {
  it('maps API status codes to the shared UX taxonomy', () => {
    expect(getUiErrorKind({ status: 403, kind: 'unknown', message: 'No access' })).toBe('FORBIDDEN')
    expect(getUiErrorKind({ status: 429, kind: 'unknown', message: 'Slow down' })).toBe(
      'RATE_LIMITED',
    )
    expect(getUiErrorKind({ status: 0, kind: 'network', message: 'Offline' })).toBe('NETWORK')
  })

  it('returns a safe, actionable network message', () => {
    expect(getErrorRecovery({ status: 0, kind: 'network', message: 'Offline' })).toEqual({
      title: 'You’re offline',
      message: 'Check your connection, then try again.',
    })
  })
})
