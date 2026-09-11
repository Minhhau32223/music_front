import { useAudioEvents } from '../hooks/useAudioEvents'
import { useMediaSession } from '../hooks/useMediaSession'

export function PlayerRuntime() {
  useAudioEvents()
  useMediaSession()
  return null
}
