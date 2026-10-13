import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  hint?: string
  startIcon?: ReactNode
  endAdornment?: ReactNode
}

export function Input({
  label,
  error,
  hint,
  startIcon,
  endAdornment,
  disabled,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? `field-${props.name ?? 'input'}`
  return (
    <label className="field" htmlFor={inputId}>
      {label && <span className="field-label">{label}</span>}
      <span className={cn('input-wrap', error && 'error', disabled && 'disabled', className)}>
        {startIcon}
        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? `${inputId}-message` : undefined}
          {...props}
        />
        {endAdornment}
      </span>
      {(error || hint) && (
        <span
          id={`${inputId}-message`}
          className={cn('field-message', error && 'error')}
          aria-live={error ? 'polite' : undefined}
        >
          {error ?? hint}
        </span>
      )}
    </label>
  )
}
