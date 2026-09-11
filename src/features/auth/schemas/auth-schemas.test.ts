import { describe, expect, it } from 'vitest'
import { loginSchema } from './login.schema'
import { registerSchema } from './register.schema'

describe('auth schemas', () => {
  it('accepts a valid login', () => {
    expect(
      loginSchema.safeParse({ email: 'listener@nocturne.test', password: 'secret' }).success,
    ).toBe(true)
  })

  it('rejects an invalid email', () => {
    expect(loginSchema.safeParse({ email: 'invalid', password: 'secret' }).success).toBe(false)
  })

  it('requires matching registration passwords', () => {
    const result = registerSchema.safeParse({
      username: 'listener',
      email: 'listener@nocturne.test',
      password: 'secret',
      confirmPassword: 'different',
    })
    expect(result.success).toBe(false)
  })
})
