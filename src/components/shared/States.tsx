import { CircleAlert, Inbox, LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getErrorRecovery } from '@/lib/ux/error-recovery'

type LoadingStateProps = { title?: string; message?: string }
type EmptyStateProps = {
  title?: string
  message?: string
  actionLabel?: string
  onAction?: () => void
}
type ErrorStateProps = {
  error?: unknown
  title?: string
  message?: string
  actionLabel?: string
  onRetry?: () => void
}

export function LoadingState({
  title = 'Loading your music',
  message = 'Preparing this nocturnal session.',
}: LoadingStateProps) {
  return (
    <div className="state-card" role="status" aria-live="polite">
      <div>
        <LoaderCircle size={30} className="button-loader" aria-hidden="true" />
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
    </div>
  )
}
export function EmptyState({
  title = 'Your library is quiet',
  message = 'Saved albums, artists and playlists will appear here.',
  actionLabel = 'Discover music',
  onAction,
}: EmptyStateProps) {
  return (
    <div className="state-card">
      <div>
        <Inbox size={32} color="var(--text-muted)" aria-hidden="true" />
        <h1>{title}</h1>
        <p>{message}</p>
        {onAction && <Button onClick={onAction}>{actionLabel}</Button>}
      </div>
    </div>
  )
}
export function ErrorState({
  error,
  title,
  message,
  actionLabel = 'Try again',
  onRetry,
}: ErrorStateProps) {
  const recovery = getErrorRecovery(error)
  return (
    <div className="state-card" role="alert">
      <div>
        <CircleAlert size={32} color="var(--error)" aria-hidden="true" />
        <h2>{title ?? recovery.title}</h2>
        <p>{message ?? recovery.message}</p>
        {onRetry && (
          <Button variant="secondary" onClick={onRetry}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
