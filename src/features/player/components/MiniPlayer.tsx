import { LoaderCircle, Pause, Play, SkipForward } from 'lucide-react'
import { Artwork } from '@/components/shared/Artwork'
import { IconButton } from '@/components/ui/IconButton'
import {
  selectCurrentTrack,
  selectIsBusy,
  selectIsPlaying,
  usePlayerStore,
} from '../store/player.store'

export function MiniPlayer() {
  const track = usePlayerStore(selectCurrentTrack)
  const playing = usePlayerStore(selectIsPlaying)
  const busy = usePlayerStore(selectIsBusy)
  const currentTimeMs = usePlayerStore((state) => state.currentTimeMs)
  const durationMs = usePlayerStore((state) => state.durationMs)
  const togglePlay = usePlayerStore((state) => state.togglePlay)
  const next = usePlayerStore((state) => state.next)
  const setExpanded = usePlayerStore((state) => state.setExpanded)
  const progress = durationMs > 0 ? Math.min(100, (currentTimeMs / durationMs) * 100) : 0

  return (
    <div
      className="mobile-mini-player"
      role="group"
      aria-label="Trình phát thu gọn"
      onClick={() => track && setExpanded(true)}
    >
      <span className="mini-player-progress" style={{ width: `${progress}%` }} />
      <div className="mini-player-art">
        <Artwork src={track?.artworkUrl} alt={track ? `${track.title} artwork` : ''} />
      </div>
      <div className="mini-player-copy">
        <strong>{track?.title ?? 'Chọn một bài hát'}</strong>
        <span>{track?.artistName ?? 'NOCTURNE'}</span>
      </div>
      <IconButton
        label={playing || busy ? 'Tạm dừng' : 'Phát'}
        disabled={!track}
        tooltip={false}
        onClick={(event) => {
          event.stopPropagation()
          togglePlay()
        }}
      >
        {busy ? (
          <LoaderCircle className="player-spinner" size={21} />
        ) : playing ? (
          <Pause size={21} fill="currentColor" />
        ) : (
          <Play size={21} fill="currentColor" />
        )}
      </IconButton>
      <IconButton
        label="Bài tiếp"
        disabled={!track}
        tooltip={false}
        onClick={(event) => {
          event.stopPropagation()
          next()
        }}
      >
        <SkipForward size={20} fill="currentColor" />
      </IconButton>
    </div>
  )
}
