import { ChevronLeft, Compass, Home, Library, Plus, Radio, Search } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { IconButton } from '@/components/ui/IconButton'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { PlaylistFormDialog } from '@/features/playlists/components/PlaylistFormDialog'
import { usePlaylists } from '@/features/playlists/hooks/usePlaylists'

const navItems = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/library', label: 'Your Library', icon: Library },
  { to: '/discover', label: 'Discover', icon: Compass },
]

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const [createOpen, setCreateOpen] = useState(false)
  const currentUser = useCurrentUser()
  const playlists = usePlaylists()
  const ownPlaylists =
    playlists.data?.filter((playlist) => playlist.ownerId === currentUser.data?.id) ?? []

  return (
    <>
      <aside className="sidebar">
        <div className="brand" aria-label="NOCTURNE">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-word">NOCTURNE</span>
        </div>
        <nav className="sidebar-nav" aria-label="Điều hướng chính">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              title={collapsed ? label : undefined}
            >
              <Icon size={19} />
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-playlists">
          <div className="sidebar-divider" />
          <div className="playlist-head">
            <span className="caption">Playlists</span>
            <button
              type="button"
              className="sidebar-create-playlist"
              aria-label="Tạo playlist"
              onClick={() => setCreateOpen(true)}
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="playlist-list">
            {playlists.isLoading || currentUser.isLoading ? (
              <span className="playlist-sidebar-state">Đang tải…</span>
            ) : ownPlaylists.length ? (
              ownPlaylists.map((playlist) => (
                <NavLink
                  key={playlist.id}
                  to={`/playlist/${playlist.id}`}
                  className={({ isActive }) => `playlist-link${isActive ? ' active' : ''}`}
                  title={playlist.name}
                >
                  {playlist.name}
                </NavLink>
              ))
            ) : (
              <button
                type="button"
                className="playlist-sidebar-empty"
                onClick={() => setCreateOpen(true)}
              >
                Tạo playlist đầu tiên
              </button>
            )}
          </div>
        </div>
        <button className="live-button" type="button">
          <Radio size={17} />
          <span>Live Broadcasts</span>
        </button>
      </aside>
      <IconButton
        label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        tooltip={false}
        className="sidebar-toggle"
        onClick={onToggle}
      >
        <ChevronLeft size={15} style={{ transform: collapsed ? 'rotate(180deg)' : undefined }} />
      </IconButton>
      <PlaylistFormDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  )
}
