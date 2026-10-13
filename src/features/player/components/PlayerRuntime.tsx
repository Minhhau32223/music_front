import { useAudioEvents } from '../hooks/useAudioEvents'
import { useMediaSession } from '../hooks/useMediaSession'
import { usePlaybackTracking } from '@/features/history/hooks/usePlaybackTracking'

export function PlayerRuntime() {
  useAudioEvents()
  useMediaSession()
  usePlaybackTracking()
  return null
}
