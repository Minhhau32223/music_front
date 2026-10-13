import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
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
      <motion.button
        type="button"
        className={`like-button${showLabel ? ' with-label' : ''}`}
        aria-label="Like currently playing song"
        disabled
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Heart size={18} />
        {showLabel && <span>Like</span>}
      </motion.button>
    )
  }

  return <LikeButton song={song.data} showLabel={showLabel} />
}
