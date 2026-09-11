import { usePlayerStore } from '../store/player.store'

export function usePlaybackProgress() {
  const currentTimeMs = usePlayerStore((state) => state.currentTimeMs)
  const durationMs = usePlayerStore((state) => state.durationMs)
  const seek = usePlayerStore((state) => state.seek)
  return { currentTimeMs, durationMs, seek }
}
