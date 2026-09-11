import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from './auth.store'

describe('auth store', () => {
  beforeEach(() => useAuthStore.setState({ status: 'unknown', accessToken: null }))

  it('holds an authenticated session in memory', () => {
    useAuthStore.getState().setSession('access-token')
    expect(useAuthStore.getState()).toMatchObject({
      status: 'authenticated',
      accessToken: 'access-token',
    })
  })

  it('clears local authentication state', () => {
    useAuthStore.getState().setSession('access-token')
    useAuthStore.getState().clearSession()
    expect(useAuthStore.getState()).toMatchObject({ status: 'unauthenticated', accessToken: null })
  })
})
