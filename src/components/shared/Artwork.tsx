import { Disc3 } from 'lucide-react'
import { useState, type ImgHTMLAttributes } from 'react'
import type { ArtworkShape } from '@/types/music'
import { cn } from '@/lib/cn'
import { ARTWORK_SIZES, getArtworkSrcSet, getArtworkUrl, type ArtworkSize } from '@/lib/artwork-url'

type ArtworkProps = {
  src?: string
  alt: string
  shape?: ArtworkShape
  children?: React.ReactNode
  loading?: ImgHTMLAttributes<HTMLImageElement>['loading']
  fetchPriority?: ImgHTMLAttributes<HTMLImageElement>['fetchPriority']
  size?: ArtworkSize
  sizes?: string
  className?: string
}

export function Artwork({
  src,
  alt,
  shape = 'album',
  children,
  loading = 'lazy',
  fetchPriority,
  size = 'md',
  sizes,
  className,
}: ArtworkProps) {
  const [failedSource, setFailedSource] = useState<string>()
  return (
    <div className={cn('artwork', shape === 'artist' && 'artist', className)}>
      {src && failedSource !== src ? (
        <img
          src={getArtworkUrl(src, size)}
          srcSet={getArtworkSrcSet(src)}
          sizes={sizes ?? `${ARTWORK_SIZES[size]}px`}
          width={ARTWORK_SIZES[size]}
          height={ARTWORK_SIZES[size]}
          alt={alt}
          loading={loading}
          fetchPriority={fetchPriority}
          onError={() => setFailedSource(src)}
        />
      ) : (
        <div className="artwork-fallback">
          <Disc3 size={32} />
        </div>
      )}
      {children}
    </div>
  )
}
