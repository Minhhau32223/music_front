import { LoaderCircle, Pause, Play, Repeat2, Shuffle, SkipBack, SkipForward } from 'lucide-react'
import { motion } from 'framer-motion'
import { IconButton } from '@/components/ui/IconButton'
import { selectCurrentTrack, selectIsBusy, usePlayerStore } from '../store/player.store'

export function PlaybackControls({ compact = false }: { compact?: boolean }) {
  const track = usePlayerStore(selectCurrentTrack)
  const status = usePlayerStore((state) => state.playbackStatus)
  const busy = usePlayerStore(selectIsBusy)
  const shuffleEnabled = usePlayerStore((state) => state.shuffleEnabled)
  const repeatMode = usePlayerStore((state) => state.repeatMode)
  const togglePlay = usePlayerStore((state) => state.togglePlay)
  const next = usePlayerStore((state) => state.next)
  const previous = usePlayerStore((state) => state.previous)
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle)
  const cycleRepeatMode = usePlayerStore((state) => state.cycleRepeatMode)
  const disabled = !track
  const playing = status === 'playing'

  return (
    <div className={`playback-controls${compact ? ' compact' : ''}`}>
      {!compact && (
        <IconButton
          label={shuffleEnabled ? 'Disable shuffle' : 'Enable shuffle'}
          active={shuffleEnabled}
          aria-pressed={shuffleEnabled}
          disabled={disabled}
          onClick={toggleShuffle}
        >
          <Shuffle size={17} />
        </IconButton>
      )}
      <IconButton label="Previous song" disabled={disabled} onClick={previous}>
        <SkipBack size={compact ? 22 : 18} fill="currentColor" />
      </IconButton>
      <motion.button
        className="player-play-button"
        type="button"
        aria-label={playing || busy ? 'Pause' : 'Play'}
        disabled={disabled}
        onClick={togglePlay}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        {busy ? (
          <LoaderCircle className="player-spinner" size={compact ? 24 : 20} />
        ) : playing ? (
          <Pause size={compact ? 24 : 20} fill="currentColor" />
        ) : (
          <Play size={compact ? 24 : 20} fill="currentColor" />
        )}
      </motion.button>
      <IconButton label="Next song" disabled={disabled} onClick={next}>
        <SkipForward size={compact ? 22 : 18} fill="currentColor" />
      </IconButton>
      {!compact && (
        <div className="repeat-control">
          <IconButton
            label={`Repeat mode: ${repeatMode === 'off' ? 'off' : repeatMode === 'all' ? 'all' : 'one'}`}
            active={repeatMode !== 'off'}
            aria-pressed={repeatMode !== 'off'}
            disabled={disabled}
            onClick={cycleRepeatMode}
          >
            <Repeat2 size={17} />
          </IconButton>
          {repeatMode === 'one' && <span aria-hidden="true">1</span>}
        </div>
      )}
    </div>
  )
}
