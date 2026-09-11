import { ListMusic } from 'lucide-react'
import { IconButton } from '@/components/ui/IconButton'
import { selectCurrentTrack, usePlayerStore } from '../store/player.store'
import { PlaybackControls } from './PlaybackControls'
import { PlaybackErrorState } from './PlaybackErrorState'
import { ProgressBar } from './ProgressBar'
import { TrackInfo } from './TrackInfo'
import { VolumeControl } from './VolumeControl'
import { PlayerLikeButton } from './PlayerLikeButton'

export function PlayerBar() {
  const track = usePlayerStore(selectCurrentTrack)
  const queueOpen = usePlayerStore((state) => state.isQueueOpen)
  const setQueueOpen = usePlayerStore((state) => state.setQueueOpen)
  return (
    <footer className="global-player" aria-label="Trình phát nhạc">
      <TrackInfo track={track} />
      <div className="player-main-controls">
        <PlaybackControls />
        <ProgressBar />
        <PlaybackErrorState />
      </div>
      <div className="player-utilities">
        <PlayerLikeButton track={track} />
        <IconButton
          label={queueOpen ? 'Đóng hàng đợi' : 'Mở hàng đợi'}
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
