import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Tooltip } from './Tooltip'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
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
  ...props
}: IconButtonProps) {
  const button = (
    <button
      type="button"
      aria-label={label}
      className={cn('icon-button', active && 'active', className)}
      {...props}
    >
      {children}
    </button>
  )
  return tooltip ? <Tooltip label={label}>{button}</Tooltip> : button
}
