import { Heart } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Song } from '@/features/songs/types/song.types'
import { useLikedSongs } from '../hooks/useLikedSongs'
import { useToggleFavorite } from '../hooks/useToggleFavorite'

type LikeButtonProps = {
  song: Song
  showLabel?: boolean
  className?: string
  onToggled?: () => void
}

export function LikeButton({ song, showLabel = false, className, onToggled }: LikeButtonProps) {
  const likedSongs = useLikedSongs()
  const toggle = useToggleFavorite(song)
  const liked = likedSongs.data?.some((item) => item.id === song.id) ?? false
  const unavailable = likedSongs.isLoading || likedSongs.isError
  const label = liked ? 'Bỏ thích' : 'Yêu thích'

  return (
    <button
      type="button"
      className={cn('like-button', liked && 'liked', showLabel && 'with-label', className)}
      aria-label={`${label} ${song.title}`}
      aria-pressed={liked}
      disabled={unavailable}
      aria-busy={toggle.isPending || undefined}
      title={likedSongs.isError ? 'Không thể tải trạng thái yêu thích' : label}
      onClick={(event) => {
        event.stopPropagation()
        toggle.mutate(!liked)
        onToggled?.()
      }}
    >
      <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
      {showLabel && <span>{label}</span>}
    </button>
  )
}
