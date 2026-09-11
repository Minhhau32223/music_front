import type { CSSProperties, ReactNode } from 'react'
import { useArtworkColor } from '@/hooks/useArtworkColor'
import { cn } from '@/lib/cn'

type DynamicBackdropProps = {
  artworkUrl?: string
  fallbackColor?: string
  className?: string
  children: ReactNode
}

export function DynamicBackdrop({
  artworkUrl,
  fallbackColor,
  className,
  children,
}: DynamicBackdropProps) {
  const color = useArtworkColor(artworkUrl, fallbackColor)
  const style = { '--detail-hero-color': color } as CSSProperties
  return (
    <section className={cn('detail-hero', className)} style={style}>
      {children}
    </section>
  )
}
