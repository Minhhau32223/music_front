import type { PlayableTrack } from '@/features/songs/types/song.types'
import type { PlayerError, RepeatMode } from '../types/player.types'

export function clamp(value: number, minimum: number, maximum: number) {
  if (!Number.isFinite(value)) return minimum
  return Math.min(maximum, Math.max(minimum, value))
}

export function safeDurationMs(value: number) {
  return Number.isFinite(value) && value > 0 ? Math.round(value) : 0
}

export function isPlayableTrack(value: unknown): value is PlayableTrack {
  if (!value || typeof value !== 'object') return false
  const track = value as Partial<PlayableTrack>
  return (
    typeof track.id === 'number' &&
    Number.isFinite(track.id) &&
    typeof track.title === 'string' &&
    track.title.trim().length > 0 &&
    typeof track.artistId === 'number' &&
    Number.isFinite(track.artistId) &&
    typeof track.artistName === 'string' &&
    typeof track.audioUrl === 'string' &&
    track.audioUrl.trim().length > 0 &&
    typeof track.durationMs === 'number' &&
    Number.isFinite(track.durationMs) &&
    track.durationMs >= 0
  )
}

export function isSameTrack(left?: PlayableTrack | null, right?: PlayableTrack | null) {
  return Boolean(left && right && left.id === right.id && left.audioUrl === right.audioUrl)
}

export function areQueuesEqual(left: PlayableTrack[], right: PlayableTrack[]) {
  return (
    left.length === right.length && left.every((track, index) => isSameTrack(track, right[index]))
  )
}

export function isRepeatMode(value: unknown): value is RepeatMode {
  return value === 'off' || value === 'all' || value === 'one'
}

export function normalizePlaybackError(
  error: unknown,
  trackId?: number,
  fallbackCode: PlayerError['code'] = 'UNKNOWN',
): PlayerError {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return { code: 'NETWORK_ERROR', message: 'Không có kết nối mạng.', trackId }
  }
  const message = error instanceof Error ? error.message.toLowerCase() : ''
  if (message.includes('not supported') || message.includes('format')) {
    return {
      code: 'UNSUPPORTED_FORMAT',
      message: 'Định dạng âm thanh này không được hỗ trợ.',
      trackId,
    }
  }
  return {
    code: fallbackCode,
    message: 'Không thể phát bài hát này.',
    trackId,
  }
}

export function normalizeMediaError(code: number | undefined, trackId?: number): PlayerError {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return { code: 'NETWORK_ERROR', message: 'Không có kết nối mạng.', trackId }
  }
  if (code === 4) {
    return {
      code: 'UNSUPPORTED_FORMAT',
      message: 'Định dạng âm thanh này không được hỗ trợ.',
      trackId,
    }
  }
  if (code === 2) {
    return { code: 'NETWORK_ERROR', message: 'Kết nối âm thanh bị gián đoạn.', trackId }
  }
  if (code === 3) {
    return { code: 'AUDIO_LOAD_FAILED', message: 'Không thể đọc tệp âm thanh.', trackId }
  }
  return { code: 'AUDIO_LOAD_FAILED', message: 'Không thể tải bài hát này.', trackId }
}
