import type { PlayableTrack } from '@/features/songs/types/song.types'
import { env } from '@/app/config/env'
import {
  DEFAULT_VOLUME,
  PLAYER_STORAGE_KEY,
  PLAYER_STORAGE_VERSION,
} from '../constants/player.constants'
import type { RepeatMode } from '../types/player.types'
import { clamp, isPlayableTrack, isRepeatMode } from '../utils/playback.utils'
import { isValidShuffleOrder } from '../utils/shuffle.utils'

export type PersistedPlayerState = {
  version: number
  queue: PlayableTrack[]
  currentIndex: number
  positionMs: number
  volume: number
  previousVolume: number
  isMuted: boolean
  repeatMode: RepeatMode
  shuffleEnabled: boolean
  shuffleOrder: number[]
  shufflePosition: number
}

export function readPersistedPlayerState(): PersistedPlayerState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(PLAYER_STORAGE_KEY)
    if (!raw) return null
    const value = JSON.parse(raw) as Partial<PersistedPlayerState>
    if (value.version !== PLAYER_STORAGE_VERSION || !Array.isArray(value.queue)) return null
    const queue = value.queue.filter(isPlayableTrack).map((track) => ({
      ...track,
      queueItemId: crypto.randomUUID(),
      playbackUrl: `${env.apiBaseUrl.replace(/\/$/, '')}/stream/song/${track.id}/play`,
    }))
    const currentIndex =
      queue.length === 0
        ? -1
        : Math.min(queue.length - 1, Math.max(0, Math.trunc(Number(value.currentIndex) || 0)))
    const shuffleOrder = Array.isArray(value.shuffleOrder) ? value.shuffleOrder.map(Number) : []
    const shuffleEnabled =
      value.shuffleEnabled === true && isValidShuffleOrder(shuffleOrder, queue.length)
    const shufflePosition = shuffleEnabled ? Math.max(0, shuffleOrder.indexOf(currentIndex)) : -1
    return {
      version: PLAYER_STORAGE_VERSION,
      queue,
      currentIndex,
      positionMs: Math.max(0, Number(value.positionMs) || 0),
      volume: clamp(Number(value.volume ?? DEFAULT_VOLUME), 0, 1),
      previousVolume: clamp(Number(value.previousVolume ?? DEFAULT_VOLUME), 0, 1),
      isMuted: value.isMuted === true,
      repeatMode: isRepeatMode(value.repeatMode) ? value.repeatMode : 'off',
      shuffleEnabled,
      shuffleOrder: shuffleEnabled ? shuffleOrder : [],
      shufflePosition,
    }
  } catch {
    window.localStorage.removeItem(PLAYER_STORAGE_KEY)
    return null
  }
}

export function writePersistedPlayerState(value: PersistedPlayerState) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(value))
  } catch {
    // Playback must keep working when storage is unavailable or full.
  }
}
