import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Badge({
  children,
  accent,
  className,
}: {
  children: ReactNode
  accent?: boolean
  className?: string
}) {
  return <span className={cn('badge', accent && 'accent', className)}>{children}</span>
}
