import { Link } from 'react-router-dom'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { WorkspaceState } from '@/features/workspace/components'

export function ProfilePage() {
  const user = useCurrentUser()
  return (
    <div className="page">
      <h1>Profile</h1>
      <WorkspaceState
        pending={user.isPending}
        error={user.error}
        retry={() => void user.refetch()}
      />
      {user.data && (
        <>
          <h2>{user.data.username}</h2>
          <p>{user.data.email}</p>
          <p>Role: {user.data.role}</p>
          <nav className="modal-actions" aria-label="Workspaces">
            {user.data.role === 'USER' && (
              <Link className="button secondary-variant" to="/artist-application">
                Artist application
              </Link>
            )}
            {user.data.role === 'ARTIST' && (
              <Link className="button secondary-variant" to="/studio">
                Artist studio
              </Link>
            )}
            {user.data.role === 'ADMIN' && (
              <Link className="button secondary-variant" to="/admin">
                Moderation
              </Link>
            )}
          </nav>
        </>
      )}
    </div>
  )
}
