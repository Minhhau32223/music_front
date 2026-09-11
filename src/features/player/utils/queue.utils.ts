import type { PlayableTrack } from '@/features/songs/types/song.types'
import { isPlayableTrack } from './playback.utils'

export function sanitizeQueue(tracks: PlayableTrack[]) {
  return tracks.filter(isPlayableTrack)
}

export function clampQueueIndex(length: number, requestedIndex = 0) {
  if (length <= 0) return -1
  if (!Number.isFinite(requestedIndex)) return 0
  return Math.min(length - 1, Math.max(0, Math.trunc(requestedIndex)))
}

export function insertAfterCurrent(
  queue: PlayableTrack[],
  currentIndex: number,
  track: PlayableTrack,
) {
  const insertIndex = Math.min(queue.length, Math.max(0, currentIndex + 1))
  return {
    insertIndex,
    queue: [...queue.slice(0, insertIndex), track, ...queue.slice(insertIndex)],
  }
}

export function removeQueueIndex(queue: PlayableTrack[], index: number) {
  if (index < 0 || index >= queue.length) return queue
  return [...queue.slice(0, index), ...queue.slice(index + 1)]
}
