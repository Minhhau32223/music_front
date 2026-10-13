import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Tooltip } from './Tooltip'
import { motion, type HTMLMotionProps } from 'framer-motion'

type IconButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  label: string
  children: ReactNode
  active?: boolean
  tooltip?: boolean
}

export function IconButton({
  label,
  children,
  active,
  tooltip = true,
  className,
  disabled,
  ...props
}: IconButtonProps) {
  const button = (
    <motion.button
      type="button"
      aria-label={label}
      className={cn('icon-button', active && 'active', className)}
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
  return tooltip ? <Tooltip label={label}>{button}</Tooltip> : button
}
