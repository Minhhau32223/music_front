import { ListPlus, Play, X } from 'lucide-react'
import { IconButton } from '@/components/ui/IconButton'
import type { PlayableTrack } from '@/features/songs/types/song.types'
import { Artwork } from '@/components/shared/Artwork'

type QueueItemProps = {
  track: PlayableTrack
  current?: boolean
  onPlay?: () => void
  onPlayNext?: () => void
  onRemove: () => void
}

export function QueueItem({ track, current, onPlay, onPlayNext, onRemove }: QueueItemProps) {
  return (
    <article className={`player-queue-item${current ? ' current' : ''}`}>
      <div className="queue-item-art">
        <Artwork src={track.artworkUrl} alt={`${track.title} artwork`} />
      </div>
      <div className="queue-item-copy">
        <strong title={track.title}>{track.title}</strong>
        <span title={track.artistName}>{track.artistName}</span>
      </div>
      <div className="queue-item-actions">
        {onPlay && (
          <IconButton label={`Phát ${track.title} ngay`} onClick={onPlay}>
            <Play size={15} fill="currentColor" />
          </IconButton>
        )}
        {onPlayNext && (
          <IconButton label={`Phát ${track.title} tiếp theo`} onClick={onPlayNext}>
            <ListPlus size={15} />
          </IconButton>
        )}
        <IconButton label={`Xóa ${track.title} khỏi hàng đợi`} onClick={onRemove}>
          <X size={15} />
        </IconButton>
      </div>
    </article>
  )
}
