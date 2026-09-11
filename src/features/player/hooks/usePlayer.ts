import { useMemo } from 'react'
import { usePlayerStore } from '../store/player.store'

export function usePlayer() {
  const playTrack = usePlayerStore((state) => state.playTrack)
  const playQueue = usePlayerStore((state) => state.playQueue)
  const togglePlay = usePlayerStore((state) => state.togglePlay)
  const addToQueue = usePlayerStore((state) => state.addToQueue)
  const playNext = usePlayerStore((state) => state.playNext)

  return useMemo(
    () => ({ playTrack, playQueue, togglePlay, addToQueue, playNext }),
    [addToQueue, playNext, playQueue, playTrack, togglePlay],
  )
}

export const playerCommands = {
  playTrack: (...args: Parameters<ReturnType<typeof usePlayer>['playTrack']>) =>
    usePlayerStore.getState().playTrack(...args),
  playQueue: (...args: Parameters<ReturnType<typeof usePlayer>['playQueue']>) =>
    usePlayerStore.getState().playQueue(...args),
  togglePlay: () => usePlayerStore.getState().togglePlay(),
  addToQueue: (...args: Parameters<ReturnType<typeof usePlayer>['addToQueue']>) =>
    usePlayerStore.getState().addToQueue(...args),
  playNext: (...args: Parameters<ReturnType<typeof usePlayer>['playNext']>) =>
    usePlayerStore.getState().playNext(...args),
}
