import { ChevronLeft, Compass, Home, Library, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { IconButton } from '@/components/ui/IconButton'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { PlaylistFormDialog } from '@/features/playlists/components/PlaylistFormDialog'
import { usePlaylists } from '@/features/playlists/hooks/usePlaylists'
import {
  playlistDetailQuery,
  playlistTracksQuery,
} from '@/features/playlists/queries/playlist.queries'
import { queryClient } from '@/lib/query-client'
import { useIntentPrefetch } from '@/hooks/useIntentPrefetch'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/library', label: 'Your Library', icon: Library },
  { to: '/discover', label: 'Discover', icon: Compass },
]

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const [createOpen, setCreateOpen] = useState(false)
  const guest = useAuthStore((s) => s.status === 'unauthenticated')
  const navigate = useNavigate()
  const createPlaylist = () => (guest ? navigate('/login') : setCreateOpen(true))
  const currentUser = useCurrentUser()
  const playlists = usePlaylists()
  const ownPlaylists =
    playlists.data?.filter((playlist) => playlist.ownerId === currentUser.data?.id) ?? []

  return (
    <>
      <aside className="sidebar">
        <Link className="brand" to="/home" aria-label="Go to Home">
          <span className="brand-mark" aria-hidden="true" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                className="brand-word"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                NOCTURNE
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              title={collapsed ? label : undefined}
            >
              <Icon size={19} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    className="nav-label"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-playlists">
          <div className="sidebar-divider" />
          <div className="playlist-head">
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  className="caption"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Playlists
                </motion.span>
              )}
            </AnimatePresence>
            <motion.button
              type="button"
              className="sidebar-create-playlist"
              aria-label="Create playlist"
              onClick={createPlaylist}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={16} />
            </motion.button>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                className="playlist-list"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                {playlists.isLoading || currentUser.isLoading ? (
                  <span className="playlist-sidebar-state">
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      Loading…
                    </motion.div>
                  </span>
                ) : ownPlaylists.length ? (
                  ownPlaylists.map((playlist) => (
                    <PlaylistNavLink key={playlist.id} playlist={playlist} />
                  ))
                ) : (
                  <button type="button" className="playlist-sidebar-empty" onClick={createPlaylist}>
                    Create your first playlist
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>
      <IconButton
        label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        tooltip={false}
        className="sidebar-toggle"
        onClick={onToggle}
      >
        <motion.div
          animate={{ rotate: collapsed ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <ChevronLeft size={15} />
        </motion.div>
      </IconButton>
      <PlaylistFormDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  )
}

function PlaylistNavLink({ playlist }: { playlist: { id: number; name: string } }) {
  const intent = useIntentPrefetch(() => {
    void queryClient.prefetchQuery(playlistDetailQuery(playlist.id))
    void queryClient.prefetchQuery(playlistTracksQuery(playlist.id))
  })

  return (
    <NavLink
      to={`/playlist/${playlist.id}`}
      className={({ isActive }) => `playlist-link${isActive ? ' active' : ''}`}
      title={playlist.name}
      onPointerEnter={(event) => event.pointerType !== 'touch' && intent.schedule()}
      onPointerLeave={intent.cancel}
      onFocus={intent.schedule}
      onBlur={intent.cancel}
    >
      <motion.span whileHover={{ x: 2 }} transition={{ type: 'spring', stiffness: 400 }}>
        {playlist.name}
      </motion.span>
    </NavLink>
  )
}
