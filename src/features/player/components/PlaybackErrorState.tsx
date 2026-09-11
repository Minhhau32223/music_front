import { AlertCircle, RotateCcw } from 'lucide-react'
import { usePlayerStore } from '../store/player.store'

export function PlaybackErrorState() {
  const error = usePlayerStore((state) => state.error)
  const retry = usePlayerStore((state) => state.retry)
  if (!error) return null
  return (
    <div className="playback-error" role="alert">
      <AlertCircle size={15} />
      <span>{error.message}</span>
      <button type="button" onClick={retry}>
        <RotateCcw size={13} /> Thử lại
      </button>
    </div>
  )
}
