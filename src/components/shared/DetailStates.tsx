import { CircleAlert, Disc3, SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { isApiError } from '@/lib/api/api-error'

export function DetailPageSkeleton() {
  return (
    <div className="page detail-page" aria-label="Loading detail page">
      <div className="detail-skeleton-hero">
        <div className="skeleton detail-skeleton-art" />
        <div className="detail-skeleton-copy">
          <div className="skeleton skeleton-line short" />
          <div className="skeleton detail-skeleton-title" />
          <div className="skeleton skeleton-line" />
        </div>
      </div>
      <DetailTrackListSkeleton />
    </div>
  )
}

export function DetailTrackListSkeleton() {
  return (
    <div className="detail-skeleton-list" aria-label="Loading tracklist">
      {Array.from({ length: 5 }, (_, index) => (
        <div className="skeleton detail-skeleton-row" key={index} />
      ))}
    </div>
  )
}

export function DetailErrorState({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const status = isApiError(error) ? error.status : 0
  const title = status === 403 ? 'Access denied' : 'Unable to load content'
  const message =
    status === 403
      ? 'Your current account cannot view this content.'
      : status === 0
        ? 'Unable to connect to NOCTURNE. Check your connection and try again.'
        : 'NOCTURNE is having trouble. Please try again in a few minutes.'
  return (
    <div className="page">
      <div className="state-card" role="alert">
        <div>
          <CircleAlert size={34} color="var(--error)" />
          <h1>{title}</h1>
          <p>{message}</p>
          <Button variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        </div>
      </div>
    </div>
  )
}

export function DetailNotFoundState({ entity }: { entity: string }) {
  return (
    <div className="page">
      <div className="state-card" role="status">
        <div>
          <SearchX size={34} color="var(--text-muted)" />
          <h1>{entity} not found</h1>
          <p>The link may be invalid or the content may have been removed.</p>
          <Link className="button secondary-variant" to="/home">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export function DetailSectionState({
  loading,
  error,
  empty,
  emptyMessage,
  onRetry,
}: {
  loading: boolean
  error: boolean
  empty: boolean
  emptyMessage: string
  onRetry: () => void
}) {
  if (loading) {
    return (
      <div className="detail-section-state" role="status">
        <span className="button-loader" /> Loading…
      </div>
    )
  }
  if (error) {
    return (
      <div className="detail-section-state" role="alert">
        <CircleAlert size={19} /> Unable to load this item.
        <Button size="sm" variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      </div>
    )
  }
  if (empty) {
    return (
      <div className="detail-section-state">
        <Disc3 size={19} /> {emptyMessage}
      </div>
    )
  }
  return null
}
