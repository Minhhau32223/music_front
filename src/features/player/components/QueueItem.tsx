import { ListPlus, Play, X } from 'lucide-react'
import { IconButton } from '@/components/ui/IconButton'
import type { PlayableTrack } from '@/features/songs/types/song.types'
import { Artwork } from '@/components/shared/Artwork'
import { TrackActions } from './TrackActions'

type QueueItemProps = {
  track: PlayableTrack
  current?: boolean
  onPlay?: () => void
  onPlayNext?: () => void
  onRemove: () => void
}

export function QueueItem({ track, current, onPlay, onPlayNext, onRemove }: QueueItemProps) {
  return (
    <article data-song-surface className={`player-queue-item${current ? ' current' : ''}`}>
      <div className="queue-item-art">
        <Artwork src={track.artworkUrl} alt={`${track.title} artwork`} />
      </div>
      <div className="queue-item-copy">
        <strong title={track.title}>{track.title}</strong>
        <span title={track.artistName}>{track.artistName}</span>
      </div>
      <div className="queue-item-actions">
        <TrackActions track={track} context="queue" onPlay={onPlay} onPlayNext={onPlayNext} />
        {onPlay && (
          <IconButton label={`Play ${track.title} now`} onClick={onPlay}>
            <Play size={15} fill="currentColor" />
          </IconButton>
        )}
        {onPlayNext && (
          <IconButton label={`Play ${track.title} next`} onClick={onPlayNext}>
            <ListPlus size={15} />
          </IconButton>
        )}
        <IconButton label={`Remove ${track.title} from queue`} onClick={onRemove}>
          <X size={15} />
        </IconButton>
      </div>
    </article>
  )
}
