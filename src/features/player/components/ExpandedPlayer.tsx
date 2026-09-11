import { ChevronDown, ListMusic } from 'lucide-react'
import { useEffect } from 'react'
import { Artwork } from '@/components/shared/Artwork'
import { IconButton } from '@/components/ui/IconButton'
import { selectCurrentTrack, usePlayerStore } from '../store/player.store'
import { PlaybackControls } from './PlaybackControls'
import { PlaybackErrorState } from './PlaybackErrorState'
import { ProgressBar } from './ProgressBar'
import { Link } from 'react-router-dom'
import { PlayerLikeButton } from './PlayerLikeButton'

export function ExpandedPlayer() {
  const open = usePlayerStore((state) => state.isExpanded)
  const track = usePlayerStore(selectCurrentTrack)
  const setExpanded = usePlayerStore((state) => state.setExpanded)
  const setQueueOpen = usePlayerStore((state) => state.setQueueOpen)

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpanded(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [open, setExpanded])

  if (!open || !track) return null

  return (
    <section className="expanded-player" role="dialog" aria-modal="true" aria-label="Đang phát">
      <header className="expanded-player-header">
        <IconButton label="Thu gọn trình phát" tooltip={false} onClick={() => setExpanded(false)}>
          <ChevronDown size={24} />
        </IconButton>
        <span className="caption">Đang phát</span>
        <span aria-hidden="true" />
      </header>
      <div className="expanded-player-body">
        <div className="expanded-player-art">
          <Artwork src={track.artworkUrl} alt={`${track.title} artwork`} />
        </div>
        <div className="expanded-player-copy">
          <h2>
            <Link to={`/song/${track.id}`} onClick={() => setExpanded(false)}>
              {track.title}
            </Link>
          </h2>
          <p>
            <Link to={`/artist/${track.artistId}`} onClick={() => setExpanded(false)}>
              {track.artistName}
            </Link>
            {track.albumId && track.albumTitle ? (
              <>
                {' · '}
                <Link to={`/album/${track.albumId}`} onClick={() => setExpanded(false)}>
                  {track.albumTitle}
                </Link>
              </>
            ) : null}
          </p>
        </div>
        <PlayerLikeButton track={track} showLabel />
        <ProgressBar expanded />
        <PlaybackControls />
        <PlaybackErrorState />
        <button className="expanded-queue-button" type="button" onClick={() => setQueueOpen(true)}>
          <ListMusic size={19} />
          Hàng đợi
        </button>
      </div>
    </section>
  )
}
