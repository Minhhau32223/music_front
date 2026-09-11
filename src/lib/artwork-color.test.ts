import { describe, expect, it } from 'vitest'
import { normalizeHeroColor } from './artwork-color'

describe('hero color normalization', () => {
  it('accepts safe hex and rgb values', () => {
    expect(normalizeHeroColor('#201044')).toBe('32 16 68')
    expect(normalizeHeroColor('#2af')).toBe('34 170 255')
    expect(normalizeHeroColor('rgb(300, 12, 5)')).toBe('255 12 5')
  })

  it('rejects values that could escape the CSS color channel', () => {
    expect(normalizeHeroColor('url(javascript:alert(1))')).toBeUndefined()
    expect(normalizeHeroColor('red')).toBeUndefined()
  })
})
