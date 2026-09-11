import type { PlayableTrack } from '@/features/songs/types/song.types'
import type { PlaybackStatus } from '../types/player.types'

export function hasMediaSession() {
  return typeof navigator !== 'undefined' && 'mediaSession' in navigator
}

export function setMediaMetadata(track: PlayableTrack | null) {
  if (!hasMediaSession()) return
  if (!track) {
    navigator.mediaSession.metadata = null
    return
  }
  if (typeof MediaMetadata === 'undefined') return
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artistName,
      album: track.albumTitle,
      artwork: track.artworkUrl
        ? [{ src: track.artworkUrl, sizes: '512x512', type: 'image/jpeg' }]
        : undefined,
    })
  } catch {
    // Media metadata is a progressive enhancement.
  }
}

export function setMediaPlaybackState(status: PlaybackStatus) {
  if (!hasMediaSession()) return
  navigator.mediaSession.playbackState = status === 'playing' ? 'playing' : 'paused'
}

export function setMediaPosition(currentTimeMs: number, durationMs: number) {
  if (!hasMediaSession() || durationMs <= 0) return
  try {
    navigator.mediaSession.setPositionState({
      duration: durationMs / 1000,
      position: Math.min(Math.max(0, currentTimeMs), Math.max(0, durationMs - 1)) / 1000,
      playbackRate: 1,
    })
  } catch {
    // Position state is optional and varies across browsers.
  }
}

export function installMediaSessionHandlers(
  handlers: Partial<Record<MediaSessionAction, MediaSessionActionHandler>>,
) {
  if (!hasMediaSession()) return () => undefined
  for (const [action, handler] of Object.entries(handlers)) {
    try {
      navigator.mediaSession.setActionHandler(action as MediaSessionAction, handler ?? null)
    } catch {
      // Unsupported actions should not affect playback.
    }
  }
  return () => {
    for (const action of Object.keys(handlers)) {
      try {
        navigator.mediaSession.setActionHandler(action as MediaSessionAction, null)
      } catch {
        // Ignore browser-specific cleanup failures.
      }
    }
  }
}
