import { Heart } from 'lucide-react'
import { LikeButton } from '@/features/favorites/components/LikeButton'
import { useSongDetail } from '@/features/songs/hooks/useSongDetail'
import type { PlayableTrack } from '@/features/songs/types/song.types'

export function PlayerLikeButton({
  track,
  showLabel = false,
}: {
  track: PlayableTrack | null
  showLabel?: boolean
}) {
  const song = useSongDetail(track?.id ?? null)

  if (!track || !song.data) {
    return (
      <button
        type="button"
        className={`like-button${showLabel ? ' with-label' : ''}`}
        aria-label="Yêu thích bài hát đang phát"
        disabled
      >
        <Heart size={18} />
        {showLabel && <span>Yêu thích</span>}
      </button>
    )
  }

  return <LikeButton song={song.data} showLabel={showLabel} />
}
