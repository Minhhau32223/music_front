import { CircleAlert, Inbox, LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function LoadingState() {
  return (
    <div className="state-card" role="status">
      <div>
        <LoaderCircle size={30} className="button-loader" />
        <h2>Loading your music</h2>
        <p>Preparing this nocturnal session.</p>
      </div>
    </div>
  )
}
export function EmptyState() {
  return (
    <div className="state-card">
      <div>
        <Inbox size={32} color="var(--text-muted)" />
        <h1>Your library is quiet</h1>
        <p>Saved albums, artists and playlists will appear here.</p>
        <Button>Discover music</Button>
      </div>
    </div>
  )
}
export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="state-card" role="alert">
      <div>
        <CircleAlert size={32} color="var(--error)" />
        <h2>Couldn't load your music</h2>
        <p>Please try again.</p>
        <Button variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      </div>
    </div>
  )
}
