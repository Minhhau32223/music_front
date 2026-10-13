import { ListMusic } from 'lucide-react'
import { motion } from 'framer-motion'
import { IconButton } from '@/components/ui/IconButton'
import { selectCurrentTrack, usePlayerStore } from '../store/player.store'
import { PlaybackControls } from './PlaybackControls'
import { PlaybackErrorState } from './PlaybackErrorState'
import { ProgressBar } from './ProgressBar'
import { TrackInfo } from './TrackInfo'
import { VolumeControl } from './VolumeControl'
import { PlayerLikeButton } from './PlayerLikeButton'
import { useLyricsStore } from '../store/lyrics.store'

export function PlayerBar() {
  const track = usePlayerStore(selectCurrentTrack)
  const queueOpen = usePlayerStore((state) => state.isQueueOpen)
  const setQueueOpen = usePlayerStore((state) => state.setQueueOpen)
  return (
    <footer className="global-player" aria-label="Music player">
      <TrackInfo track={track} />
      <div className="player-main-controls">
        <PlaybackControls />
        <ProgressBar />
        <PlaybackErrorState />
      </div>
      <div className="player-utilities">
        <PlayerLikeButton track={track} />
        <motion.button
          type="button"
          className="song-more-trigger"
          disabled={!track}
          onClick={() => useLyricsStore.getState().open('current')}
          whileHover={{ scale: track ? 1.05 : 1 }}
          whileTap={{ scale: track ? 0.95 : 1 }}
        >
          Lyrics
        </motion.button>
        <IconButton
          label={queueOpen ? 'Close queue' : 'Open queue'}
          active={queueOpen}
          aria-pressed={queueOpen}
          onClick={() => setQueueOpen(!queueOpen)}
        >
          <ListMusic size={18} />
        </IconButton>
        <VolumeControl />
      </div>
    </footer>
  )
}
