const colorCache = new Map<string, Promise<string>>()

export const DEFAULT_HERO_COLOR = '76 51 128'

function clampChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)))
}

export function normalizeHeroColor(value?: string): string | undefined {
  if (!value) return undefined
  const color = value.trim()
  const shortHex = /^#([\da-f])([\da-f])([\da-f])$/i.exec(color)
  if (shortHex) {
    return shortHex
      .slice(1)
      .map((channel) => parseInt(`${channel}${channel}`, 16))
      .join(' ')
  }
  const hex = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(color)
  if (hex)
    return hex
      .slice(1)
      .map((channel) => parseInt(channel, 16))
      .join(' ')
  const rgb = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i.exec(color)
  if (rgb)
    return rgb
      .slice(1)
      .map((channel) => clampChannel(Number(channel)))
      .join(' ')
  return undefined
}

function sampleArtwork(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.decoding = 'async'
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 32
        canvas.height = 32
        const context = canvas.getContext('2d', { willReadFrequently: true })
        if (!context) throw new Error('Canvas is unavailable')
        context.drawImage(image, 0, 0, 32, 32)
        const pixels = context.getImageData(0, 0, 32, 32).data
        let red = 0
        let green = 0
        let blue = 0
        let weightTotal = 0
        for (let index = 0; index < pixels.length; index += 16) {
          const alpha = pixels[index + 3] / 255
          if (alpha < 0.2) continue
          const brightness = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 765
          const weight = alpha * (0.5 + brightness)
          red += pixels[index] * weight
          green += pixels[index + 1] * weight
          blue += pixels[index + 2] * weight
          weightTotal += weight
        }
        if (!weightTotal) throw new Error('Artwork has no visible pixels')
        resolve([red, green, blue].map((channel) => clampChannel(channel / weightTotal)).join(' '))
      } catch (error) {
        reject(error)
      }
    }
    image.onerror = () => reject(new Error('Artwork could not be sampled'))
    image.src = url
  })
}

export function getArtworkColor(url: string) {
  const cached = colorCache.get(url)
  if (cached) return cached
  const pending = sampleArtwork(url).catch((error) => {
    colorCache.delete(url)
    throw error
  })
  colorCache.set(url, pending)
  return pending
}
