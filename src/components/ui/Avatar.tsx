import { useState } from 'react'
import { cn } from '@/lib/cn'

type AvatarProps = { src?: string; alt: string; fallback: string; size?: 'sm' | 'md' | 'lg' }

export function Avatar({ src, alt, fallback, size = 'md' }: AvatarProps) {
  const [failed, setFailed] = useState(false)
  return (
    <span className={cn('avatar', size)}>
      {src && !failed ? <img src={src} alt={alt} onError={() => setFailed(true)} /> : fallback}
    </span>
  )
}
