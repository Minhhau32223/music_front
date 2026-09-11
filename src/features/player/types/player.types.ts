import type { PlayableTrack } from '@/features/songs/types/song.types'

export type RepeatMode = 'off' | 'all' | 'one'

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'buffering' | 'error'

export type PlayerErrorCode =
  | 'AUDIO_LOAD_FAILED'
  | 'AUDIO_PLAY_FAILED'
  | 'AUDIO_SOURCE_UNAVAILABLE'
  | 'NETWORK_ERROR'
  | 'UNSUPPORTED_FORMAT'
  | 'UNKNOWN'

export type PlayerError = {
  code: PlayerErrorCode
  message: string
  trackId?: number
}

export type PlayerState = {
  queue: PlayableTrack[]
  currentIndex: number
  playbackStatus: PlaybackStatus
  currentTimeMs: number
  durationMs: number
  volume: number
  previousVolume: number
  isMuted: boolean
  shuffleEnabled: boolean
  shuffleOrder: number[]
  shufflePosition: number
  repeatMode: RepeatMode
  error: PlayerError | null
}

export type AudioEngineEventType =
  | 'loadstart'
  | 'loadedmetadata'
  | 'canplay'
  | 'play'
  | 'playing'
  | 'pause'
  | 'waiting'
  | 'stalled'
  | 'timeupdate'
  | 'durationchange'
  | 'volumechange'
  | 'ended'
  | 'error'

export type AudioEngineEvent = {
  type: AudioEngineEventType
  generation: number
  sourceUrl: string
  currentTimeMs: number
  durationMs: number
  volume: number
  muted: boolean
  ended: boolean
  mediaErrorCode?: number
}
