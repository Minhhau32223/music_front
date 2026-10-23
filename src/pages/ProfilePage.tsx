import { Link } from 'react-router-dom'
import { BadgeCheck, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { WorkspaceState } from '@/features/workspace/components'

const roleLabels = {
  USER: 'Listener',
  ARTIST: 'Artist',
  ADMIN: 'Administrator',
} as const

const roleActions = {
  USER: { to: '/artist-application', label: 'Artist application' },
  ARTIST: { to: '/studio', label: 'Artist studio' },
  ADMIN: { to: '/admin', label: 'Moderation' },
} as const

export function ProfilePage() {
  const user = useCurrentUser()
  const initials = (user.data?.username ?? '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return (
    <div className="page profile-page">
      <WorkspaceState
        pending={user.isPending}
        error={user.error}
        retry={() => void user.refetch()}
      />
      {user.data && (
        <>
          <header className="profile-hero">
            <div className="profile-avatar">
              <span aria-hidden="true">{initials}</span>
              {user.data.avatarUrl && (
                <img
                  src={user.data.avatarUrl}
                  alt=""
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
              )}
            </div>
            <div className="detail-hero-copy">
              <span className="caption detail-eyebrow">Your account</span>
              <h1>{user.data.username}</h1>
              <p className="detail-meta">{user.data.email}</p>
              <div className="profile-badges">
                <span className="profile-badge">
                  <UserRound size={14} />
                  {roleLabels[user.data.role]}
                </span>
                {user.data.active && (
                  <span className="profile-badge profile-badge-active">
                    <BadgeCheck size={14} />
                    Active
                  </span>
                )}
              </div>
              <div className="hero-actions">
                <Link className="button primary" to={roleActions[user.data.role].to}>
                  {roleActions[user.data.role].label}
                </Link>
                <Link className="button secondary-variant" to="/liked-songs">
                  Liked songs
                </Link>
              </div>
            </div>
          </header>

          <section className="profile-section" aria-labelledby="profile-details-heading">
            <div className="section-heading">
              <div className="section-title-wrap">
                <span className="caption section-kicker">Account details</span>
                <h2 id="profile-details-heading">Profile information</h2>
              </div>
            </div>
            <dl className="profile-facts">
              <div>
                <dt>
                  <Mail size={15} /> Email
                </dt>
                <dd>{user.data.email}</dd>
              </div>
              <div>
                <dt>
                  <ShieldCheck size={15} /> Role
                </dt>
                <dd>{roleLabels[user.data.role]}</dd>
              </div>
              <div>
                <dt>
                  <UserRound size={15} /> Username
                </dt>
                <dd>{user.data.username}</dd>
              </div>
            </dl>
          </section>
        </>
      )}
    </div>
  )
}
