import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { motion } from 'framer-motion'

export function Badge({
  children,
  accent,
  className,
}: {
  children: ReactNode
  accent?: boolean
  className?: string
}) {
  return (
    <motion.span 
      className={cn('badge', accent && 'accent', className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.span>
  )
}
