import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

type Props = {
  index: string
  kicker: string
  title: string
  loading: boolean
  error: boolean
  empty: boolean
  emptyMessage: string
  onRetry: () => void
  skeleton: ReactNode
  children: ReactNode
}

export function CatalogSection(props: Props) {
  return (
    <section className="section" aria-labelledby={`section-${props.index}`}>
      <div className="section-heading">
        <div className="section-title-wrap">
          <h2 id={`section-${props.index}`}>{props.title}</h2>
        </div>
      </div>
      {props.loading ? (
        props.skeleton
      ) : props.error ? (
        <div className="catalog-state" role="alert">
          <p>Couldn't load this section.</p>
          <Button size="sm" variant="secondary" onClick={props.onRetry}>
            Try again
          </Button>
        </div>
      ) : props.empty ? (
        <div className="catalog-state">
          <p>{props.emptyMessage}</p>
        </div>
      ) : (
        props.children
      )}
    </section>
  )
}

export function CardGridSkeleton({ round = false }: { round?: boolean }) {
  return (
    <div className="card-grid" aria-label="Loading section">
      {Array.from({ length: 5 }, (_, index) => (
        <div className="skeleton-card" key={index}>
          <div className={`skeleton skeleton-square${round ? ' round' : ''}`} />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line short" />
        </div>
      ))}
    </div>
  )
}
