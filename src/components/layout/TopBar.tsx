import { ArrowLeft, ArrowRight, LogOut, Search } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { IconButton } from '@/components/ui/IconButton'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { motion } from 'framer-motion'
import { useState } from 'react'

export function TopBar() {
  const navigate = useNavigate()
  const currentUser = useCurrentUser()
  const logout = useLogout()
  const guest = useAuthStore((s) => s.status === 'unauthenticated')
  const username = currentUser.data?.username ?? 'Listener'
  const [isFocused, setIsFocused] = useState(false)

  return (
    <header className="topbar">
      <div className="history-controls">
        <IconButton label="Go back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </IconButton>
        <IconButton label="Go forward" onClick={() => navigate(1)}>
          <ArrowRight size={18} />
        </IconButton>
      </div>
      <motion.label
        className="top-search"
        data-focused={isFocused}
        animate={{ width: isFocused ? 'min(420px, 45vw)' : 'min(360px, 40vw)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Search size={17} style={{ color: isFocused ? 'var(--accent-primary)' : 'inherit' }} />
        <input
          aria-label="Search"
          placeholder="Songs, artists, or albums..."
          onFocus={() => {
            setIsFocused(true)
            navigate('/search')
          }}
          onBlur={() => setIsFocused(false)}
        />
      </motion.label>
      <div className="top-actions">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link className="profile" to={guest ? '/login' : '/profile'} aria-label="Profile">
            <Avatar
              src={currentUser.data?.avatarUrl ?? undefined}
              alt={username}
              fallback={username.slice(0, 2).toUpperCase()}
              size="sm"
            />
            <span>{currentUser.isLoading ? 'Loading…' : username}</span>
          </Link>
        </motion.div>
        {guest ? (
          <motion.button
            type="button"
            onClick={() => navigate('/login')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Log in
          </motion.button>
        ) : (
          <IconButton label="Log out" onClick={() => logout.mutate()} disabled={logout.isPending}>
            <LogOut size={18} />
          </IconButton>
        )}
      </div>
    </header>
  )
}
