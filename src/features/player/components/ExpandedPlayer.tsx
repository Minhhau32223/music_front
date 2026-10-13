import { ChevronDown, ListMusic } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCallback, useEffect } from 'react'
import { usePlayerPanelFocus } from '@/hooks/usePlayerPanelFocus'
import { Artwork } from '@/components/shared/Artwork'
import { IconButton } from '@/components/ui/IconButton'
import { selectCurrentTrack, usePlayerStore } from '../store/player.store'
import { PlaybackControls } from './PlaybackControls'
import { PlaybackErrorState } from './PlaybackErrorState'
import { ProgressBar } from './ProgressBar'
import { Link } from 'react-router-dom'
import { PlayerLikeButton } from './PlayerLikeButton'
import { TrackActions } from './TrackActions'
import { useLyricsStore } from '../store/lyrics.store'

export function ExpandedPlayer() {
  const open = usePlayerStore((state) => state.isExpanded)
  const track = usePlayerStore(selectCurrentTrack)
  const setExpanded = usePlayerStore((state) => state.setExpanded)
  const setQueueOpen = usePlayerStore((state) => state.setQueueOpen)
  const queueOpen = usePlayerStore((state) => state.isQueueOpen)
  const close = useCallback(() => setExpanded(false), [setExpanded])
  const panelRef = usePlayerPanelFocus(open && !queueOpen, close)

  useEffect(() => {
    if (!open) return
    document.body.dataset.playerExpanded = 'true'
    return () => {
      delete document.body.dataset.playerExpanded
    }
  }, [open])

  if (!open || !track) return null

  return (
    <section
      ref={panelRef}
      className="expanded-player"
      role="dialog"
      aria-modal="true"
      aria-label="Now playing"
    >
      <header className="expanded-player-header">
        <IconButton label="Collapse player" tooltip={false} onClick={() => setExpanded(false)}>
          <ChevronDown size={24} />
        </IconButton>
        <span className="caption">Now playing</span>
        <TrackActions track={track} />
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
        <motion.button
          type="button"
          className="expanded-queue-button"
          onClick={() => useLyricsStore.getState().open('current')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Lyrics
        </motion.button>
        <ProgressBar expanded />
        <PlaybackControls />
        <PlaybackErrorState />
        <motion.button className="expanded-queue-button" type="button" onClick={() => setQueueOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ListMusic size={19} />
          Queue
        </motion.button>
      </div>
    </section>
  )
}
