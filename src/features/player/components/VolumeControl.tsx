import { Volume, Volume1, Volume2, VolumeOff } from 'lucide-react'
import type { CSSProperties } from 'react'
import { IconButton } from '@/components/ui/IconButton'
import { usePlayerStore } from '../store/player.store'

export function VolumeControl() {
  const volume = usePlayerStore((state) => state.volume)
  const isMuted = usePlayerStore((state) => state.isMuted)
  const setVolume = usePlayerStore((state) => state.setVolume)
  const toggleMute = usePlayerStore((state) => state.toggleMute)
  const displayVolume = isMuted ? 0 : Math.round(volume * 100)
  const icon =
    isMuted || volume === 0 ? (
      <VolumeOff size={18} />
    ) : volume < 0.34 ? (
      <Volume size={18} />
    ) : volume < 0.67 ? (
      <Volume1 size={18} />
    ) : (
      <Volume2 size={18} />
    )

  return (
    <div className="volume-control">
      <IconButton label={isMuted ? 'Unmute' : 'Mute'} onClick={toggleMute}>
        {icon}
      </IconButton>
      <input
        className="player-range volume-range"
        type="range"
        min={0}
        max={100}
        value={Math.round(volume * 100)}
        aria-label="Volume"
        aria-valuetext={`Volume ${displayVolume}%`}
        style={{ '--range-progress': `${displayVolume}%` } as CSSProperties}
        onChange={(event) => setVolume(Number(event.currentTarget.value) / 100)}
      />
    </div>
  )
}
