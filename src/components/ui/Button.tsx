import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { motion, type HTMLMotionProps } from 'framer-motion'

const buttonVariants = cva('button', {
  variants: {
    variant: {
      primary: 'primary',
      secondary: 'secondary-variant',
      ghost: 'ghost',
      danger: 'danger',
    },
    size: { sm: 'sm', md: '', lg: 'lg', icon: 'icon' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})
type ButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> &
  VariantProps<typeof buttonVariants> & { loading?: boolean; children: ReactNode }

export function Button({
  variant,
  size,
  loading,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      type="button"
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      {loading && <span className="button-loader" aria-hidden="true" />}
      {children}
    </motion.button>
  )
}
