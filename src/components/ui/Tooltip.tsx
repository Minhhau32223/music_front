import type { ReactNode } from 'react'

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="tooltip-wrap">
      {children}
      <span role="tooltip" className="tooltip-content">
        {label}
      </span>
    </span>
  )
}
