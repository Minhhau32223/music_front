import { useEffect } from 'react'
import { audioEngine } from '../engine/audio-engine'
import { selectCurrentTrack, usePlayerStore } from '../store/player.store'

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.isContentEditable ||
    target.matches('input, textarea, select, button, a, [role="slider"]')
  )
}

export function useAudioEvents() {
  useEffect(() => {
    const unsubscribe = audioEngine.subscribe((event) =>
      usePlayerStore.getState().handleAudioEvent(event),
    )
    usePlayerStore.getState().initializeEngine()

    const persist = () => usePlayerStore.getState().persistNow()
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || event.repeat || isEditableTarget(event.target)) return
      if (!selectCurrentTrack(usePlayerStore.getState())) return
      event.preventDefault()
      usePlayerStore.getState().togglePlay()
    }

    window.addEventListener('beforeunload', persist)
    document.addEventListener('keydown', handleKeyboard)
    return () => {
      persist()
      unsubscribe()
      window.removeEventListener('beforeunload', persist)
      document.removeEventListener('keydown', handleKeyboard)
    }
  }, [])
}
