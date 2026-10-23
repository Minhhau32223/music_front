import { Button } from '@/components/ui/Button'
import { normalizeApiError } from '@/lib/api/api-error'

export function WorkspaceError({ error }: { error: unknown }) {
  if (!error) return null
  const normalized = normalizeApiError(error)
  return (
    <div role="alert">
      <p>{normalized.message}</p>
      {normalized.fieldErrors && (
        <ul>
          {Object.entries(normalized.fieldErrors).map(([name, message]) => (
            <li key={name}>
              {name}: {message}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
export function WorkspaceState({
  pending,
  error,
  retry,
}: {
  pending: boolean
  error: unknown
  retry: () => void
}) {
  if (pending)
    return (
      <p className="workspace-state" role="status">
        Loading…
      </p>
    )
  if (error)
    return (
      <div className="workspace-state" role="alert">
        <WorkspaceError error={error} />
        <Button onClick={retry}>Try again</Button>
      </div>
    )
  return null
}
