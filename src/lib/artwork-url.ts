export const ARTWORK_SIZES = {
  xs: 48,
  sm: 96,
  md: 192,
  lg: 320,
  xl: 640,
} as const

export type ArtworkSize = keyof typeof ARTWORK_SIZES

/** Requests only the artwork size a rendered surface needs. */
export function getArtworkUrl(source: string | undefined, size: ArtworkSize = 'md') {
  if (!source || !source.includes('res.cloudinary.com/') || !source.includes('/image/upload/')) {
    return source
  }

  const width = ARTWORK_SIZES[size]
  return source.replace(
    '/image/upload/',
    `/image/upload/f_auto,q_auto,c_fill,g_auto,w_${width},h_${width}/`,
  )
}

export function getArtworkSrcSet(source: string | undefined) {
  if (!source || !source.includes('res.cloudinary.com/') || !source.includes('/image/upload/')) {
    return undefined
  }

  return (Object.entries(ARTWORK_SIZES) as [ArtworkSize, number][])
    .map(([size, width]) => `${getArtworkUrl(source, size)} ${width}w`)
    .join(', ')
}
