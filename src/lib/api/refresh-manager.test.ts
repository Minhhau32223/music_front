import { describe, expect, it, vi } from 'vitest'
import { RefreshManager } from './refresh-manager'

describe('RefreshManager', () => {
  it('shares one in-flight refresh among concurrent callers', async () => {
    const manager = new RefreshManager<string>()
    const factory = vi.fn(async () => 'new-access-token')
    const [first, second] = await Promise.all([manager.run(factory), manager.run(factory)])
    expect(first).toBe('new-access-token')
    expect(second).toBe('new-access-token')
    expect(factory).toHaveBeenCalledTimes(1)
  })

  it('allows a later refresh after the active request settles', async () => {
    const manager = new RefreshManager<string>()
    const factory = vi.fn(async () => 'token')
    await manager.run(factory)
    await manager.run(factory)
    expect(factory).toHaveBeenCalledTimes(2)
  })
})
