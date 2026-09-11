import { useEffect, useState } from 'react'
import { DEFAULT_HERO_COLOR, getArtworkColor, normalizeHeroColor } from '@/lib/artwork-color'

export function useArtworkColor(artworkUrl?: string, fallbackColor?: string) {
  const fallback = normalizeHeroColor(fallbackColor) ?? DEFAULT_HERO_COLOR
  const [sampled, setSampled] = useState<{ url: string; color: string } | null>(null)

  useEffect(() => {
    let active = true
    if (artworkUrl) {
      void getArtworkColor(artworkUrl)
        .then((color) => {
          if (active) setSampled({ url: artworkUrl, color })
        })
        .catch(() => undefined)
    }
    return () => {
      active = false
    }
  }, [artworkUrl])

  return sampled && sampled.url === artworkUrl ? sampled.color : fallback
}
