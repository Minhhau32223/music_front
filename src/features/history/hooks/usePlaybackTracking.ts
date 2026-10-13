import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { historyKey } from './useRecentlyPlayed'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { historyApi } from '../api/history.api'
import { selectCurrentTrack, usePlayerStore } from '@/features/player/store/player.store'

/** Records one playback event per loaded track after the browser has started audio. */
let recordedGeneration = -1
export function usePlaybackTracking() {
  const client = useQueryClient()
  useEffect(
    () =>
      usePlayerStore.subscribe((state) => {
        const track = selectCurrentTrack(state)
        if (
          state.playbackStatus !== 'playing' ||
          !state.shouldPlay ||
          !track ||
          recordedGeneration === state.activeGeneration
        )
          return
        if (useAuthStore.getState().status !== 'authenticated') return
        recordedGeneration = state.activeGeneration
        const token = useAuthStore.getState().accessToken
        void historyApi
          .record(track.id)
          .then(() => {
            if (useAuthStore.getState().accessToken === token)
              void client.invalidateQueries({ queryKey: historyKey })
          })
          .catch(() => undefined)
      }),
    [client],
  )
}
