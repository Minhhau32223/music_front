import { useEffect } from 'react'
import {
  installMediaSessionHandlers,
  setMediaMetadata,
  setMediaPlaybackState,
  setMediaPosition,
} from '../engine/media-session'
import { selectCurrentTrack, usePlayerStore } from '../store/player.store'

export function useMediaSession() {
  const track = usePlayerStore(selectCurrentTrack)
  const status = usePlayerStore((state) => state.playbackStatus)
  const currentTimeMs = usePlayerStore((state) => state.currentTimeMs)
  const durationMs = usePlayerStore((state) => state.durationMs)

  useEffect(() => {
    setMediaMetadata(track)
  }, [track])

  useEffect(() => {
    setMediaPlaybackState(status)
  }, [status])

  useEffect(() => {
    if (!track) return
    setMediaPosition(currentTimeMs, durationMs)
  }, [currentTimeMs, durationMs, track])

  useEffect(() => {
    const handlers: Partial<Record<MediaSessionAction, MediaSessionActionHandler>> = {
      play: () => usePlayerStore.getState().resume(),
      pause: () => usePlayerStore.getState().pause(),
      previoustrack: () => usePlayerStore.getState().previous(),
      nexttrack: () => usePlayerStore.getState().next(),
      seekto: (details) => {
        if (details.seekTime != null) usePlayerStore.getState().seek(details.seekTime * 1000)
      },
    }
    return installMediaSessionHandlers(handlers)
  }, [])
}
