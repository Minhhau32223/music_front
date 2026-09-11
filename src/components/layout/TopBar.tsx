import { ArrowLeft, ArrowRight, Bell, LogOut, Search, SlidersHorizontal, Waves } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { IconButton } from '@/components/ui/IconButton'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useLogout } from '@/features/auth/hooks/useLogout'

export function TopBar() {
  const navigate = useNavigate()
  const currentUser = useCurrentUser()
  const logout = useLogout()
  const username = currentUser.data?.username ?? 'Listener'
  return (
    <header className="topbar">
      <div className="history-controls">
        <IconButton label="Quay lại" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </IconButton>
        <IconButton label="Đi tiếp" onClick={() => navigate(1)}>
          <ArrowRight size={18} />
        </IconButton>
      </div>
      <label className="top-search">
        <Search size={17} />
        <input
          aria-label="Tìm kiếm"
          placeholder="Artists, songs, or podcasts..."
          onFocus={() => navigate('/search')}
        />
        <SlidersHorizontal size={15} />
      </label>
      <div className="top-actions">
        <span className="hires">
          <Waves size={13} /> HI-RES
        </span>
        <IconButton label="Thông báo">
          <Bell size={18} />
        </IconButton>
        <div className="profile">
          <Avatar
            src={currentUser.data?.avatarUrl ?? undefined}
            alt={username}
            fallback={username.slice(0, 2).toUpperCase()}
            size="sm"
          />
          <span>{currentUser.isLoading ? 'Loading…' : username}</span>
        </div>
        <IconButton label="Đăng xuất" onClick={() => logout.mutate()} disabled={logout.isPending}>
          <LogOut size={18} />
        </IconButton>
      </div>
    </header>
  )
}
