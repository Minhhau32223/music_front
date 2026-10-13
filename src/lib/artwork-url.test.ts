import { describe, expect, it } from 'vitest'
import { getArtworkSrcSet, getArtworkUrl } from './artwork-url'

describe('getArtworkUrl', () => {
  const cloudinaryImage = 'https://res.cloudinary.com/nocturne/image/upload/v1/covers/night.jpg'

  it('uses an appropriately sized Cloudinary transformation', () => {
    expect(getArtworkUrl(cloudinaryImage, 'sm')).toContain('f_auto,q_auto,c_fill,g_auto,w_96,h_96')
    expect(getArtworkSrcSet(cloudinaryImage)).toContain('640w')
  })

  it('does not rewrite non-Cloudinary image URLs', () => {
    expect(getArtworkUrl('https://example.test/cover.jpg', 'sm')).toBe(
      'https://example.test/cover.jpg',
    )
  })
})
