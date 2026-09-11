import { create } from 'zustand'
import type { PlayableTrack } from '@/features/songs/types/song.types'
import {
  DEFAULT_VOLUME,
  PLAYER_STORAGE_VERSION,
  PREVIOUS_RESTART_THRESHOLD_MS,
  PROGRESS_PERSIST_INTERVAL_MS,
} from '../constants/player.constants'
import { audioEngine } from '../engine/audio-engine'
import type {
  AudioEngineEvent,
  PlaybackStatus,
  PlayerError,
  PlayerState,
  RepeatMode,
} from '../types/player.types'
import {
  clampQueueIndex,
  insertAfterCurrent,
  removeQueueIndex,
  sanitizeQueue,
} from '../utils/queue.utils'
import {
  clamp,
  isPlayableTrack,
  isSameTrack,
  normalizeMediaError,
  normalizePlaybackError,
  safeDurationMs,
} from '../utils/playback.utils'
import {
  createShuffleOrder,
  insertIntoShuffleOrder,
  removeFromShuffleOrder,
} from '../utils/shuffle.utils'
import {
  readPersistedPlayerState,
  writePersistedPlayerState,
  type PersistedPlayerState,
} from './player.persistence'

type PlayerUiState = {
  isQueueOpen: boolean
  isExpanded: boolean
}

type PlayerRuntimeState = {
  initialized: boolean
  shouldPlay: boolean
  activeGeneration: number
  pendingSeekMs: number | null
}

export type PlayerStore = PlayerState &
  PlayerUiState &
  PlayerRuntimeState & {
    initializeEngine: () => void
    playTrack: (track: PlayableTrack) => void
    playQueue: (tracks: PlayableTrack[], startIndex?: number) => void
    playIndex: (index: number) => void
    pause: () => void
    resume: () => void
    togglePlay: () => void
    next: () => void
    previous: () => void
    seek: (positionMs: number) => void
    setVolume: (volume: number) => void
    toggleMute: () => void
    setRepeatMode: (mode: RepeatMode) => void
    cycleRepeatMode: () => void
    toggleShuffle: () => void
    addToQueue: (track: PlayableTrack) => void
    playNext: (track: PlayableTrack) => void
    moveToNext: (index: number) => void
    removeFromQueue: (index: number) => void
    clearUpcoming: () => void
    clearAll: () => void
    retry: () => void
    setQueueOpen: (open: boolean) => void
    setExpanded: (open: boolean) => void
    setPlaybackStatus: (status: PlaybackStatus) => void
    setProgress: (positionMs: number) => void
    setDuration: (durationMs: number) => void
    setError: (error: PlayerError | null) => void
    handleAudioEvent: (event: AudioEngineEvent) => void
    persistNow: () => void
  }

const restored = readPersistedPlayerState()

export const EMPTY_PLAYER_STATE: PlayerState & PlayerUiState & PlayerRuntimeState = {
  queue: [],
  currentIndex: -1,
  playbackStatus: 'idle',
  currentTimeMs: 0,
  durationMs: 0,
  volume: DEFAULT_VOLUME,
  previousVolume: DEFAULT_VOLUME,
  isMuted: false,
  shuffleEnabled: false,
  shuffleOrder: [],
  shufflePosition: -1,
  repeatMode: 'off',
  error: null,
  isQueueOpen: false,
  isExpanded: false,
  initialized: false,
  shouldPlay: false,
  activeGeneration: 0,
  pendingSeekMs: null,
}

const initialState: PlayerState & PlayerUiState & PlayerRuntimeState = restored
  ? {
      ...EMPTY_PLAYER_STATE,
      queue: restored.queue,
      currentIndex: restored.currentIndex,
      playbackStatus: restored.queue.length ? 'paused' : 'idle',
      currentTimeMs: restored.positionMs,
      durationMs:
        restored.currentIndex >= 0
          ? safeDurationMs(restored.queue[restored.currentIndex]?.durationMs ?? 0)
          : 0,
      volume: restored.volume,
      previousVolume: restored.previousVolume,
      isMuted: restored.isMuted,
      shuffleEnabled: restored.shuffleEnabled,
      shuffleOrder: restored.shuffleOrder,
      shufflePosition: restored.shufflePosition,
      repeatMode: restored.repeatMode,
      pendingSeekMs: restored.positionMs > 0 ? restored.positionMs : null,
    }
  : EMPTY_PLAYER_STATE

let lastProgressPersistedAt = 0

function currentTrack(state: PlayerStore) {
  return state.currentIndex >= 0 ? (state.queue[state.currentIndex] ?? null) : null
}

function toPersistedState(state: PlayerStore): PersistedPlayerState {
  return {
    version: PLAYER_STORAGE_VERSION,
    queue: state.queue,
    currentIndex: state.currentIndex,
    positionMs: state.currentTimeMs,
    volume: state.volume,
    previousVolume: state.previousVolume,
    isMuted: state.isMuted,
    repeatMode: state.repeatMode,
    shuffleEnabled: state.shuffleEnabled,
    shuffleOrder: state.shuffleOrder,
    shufflePosition: state.shufflePosition,
  }
}

function emitPlaybackEvent(name: string, track: PlayableTrack | null) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent('nocturne:playback', {
      detail: { name, trackId: track?.id },
    }),
  )
}

export const usePlayerStore = create<PlayerStore>((set, get) => {
  const persist = () => writePersistedPlayerState(toPersistedState(get()))

  const rejectPlay = (error: unknown, generation: number, trackId: number) => {
    const state = get()
    if (state.activeGeneration !== generation || !state.shouldPlay) return
    const normalized = normalizePlaybackError(error, trackId, 'AUDIO_PLAY_FAILED')
    set({ playbackStatus: 'error', error: normalized, shouldPlay: false })
    emitPlaybackEvent('playback_error', currentTrack(get()))
    persist()
  }

  const requestPlay = (generation: number, trackId: number) => {
    try {
      void audioEngine.play().catch((error) => rejectPlay(error, generation, trackId))
    } catch (error) {
      rejectPlay(error, generation, trackId)
    }
  }

  const activateIndex = (index: number, autoplay: boolean, positionMs = 0) => {
    const state = get()
    const safeIndex = clampQueueIndex(state.queue.length, index)
    const track = safeIndex >= 0 ? state.queue[safeIndex] : undefined
    if (!track) return

    const safePosition = Math.max(0, positionMs)
    set({
      currentIndex: safeIndex,
      currentTimeMs: safePosition,
      durationMs: safeDurationMs(track.durationMs),
      playbackStatus: autoplay ? 'loading' : 'paused',
      error: null,
      shouldPlay: autoplay,
      pendingSeekMs: safePosition > 0 ? safePosition : null,
      shufflePosition: get().shuffleEnabled
        ? Math.max(0, get().shuffleOrder.indexOf(safeIndex))
        : -1,
    })

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      try {
        audioEngine.pause()
      } catch {
        // The source is intentionally not changed while offline.
      }
      set({
        playbackStatus: 'error',
        error: { code: 'NETWORK_ERROR', message: 'Không có kết nối mạng.', trackId: track.id },
        shouldPlay: false,
      })
      persist()
      return
    }

    try {
      const generation = audioEngine.loadSource(track.audioUrl)
      audioEngine.setVolume(get().volume)
      audioEngine.setMuted(get().isMuted)
      set({ activeGeneration: generation })
      if (autoplay) requestPlay(generation, track.id)
    } catch (error) {
      set({
        playbackStatus: 'error',
        error: normalizePlaybackError(error, track.id, 'AUDIO_LOAD_FAILED'),
        shouldPlay: false,
      })
    }
    persist()
  }

  const stopAtQueueEnd = () => {
    const state = get()
    try {
      audioEngine.pause()
    } catch {
      // The ended event already represents a stopped element in most browsers.
    }
    set({
      shouldPlay: false,
      playbackStatus: state.queue.length ? 'paused' : 'idle',
      currentTimeMs: state.durationMs,
    })
    persist()
  }

  const advance = (autoplay: boolean) => {
    const state = get()
    if (state.currentIndex < 0 || state.queue.length === 0) return

    if (state.shuffleEnabled) {
      const nextPosition = state.shufflePosition + 1
      if (nextPosition < state.shuffleOrder.length) {
        activateIndex(state.shuffleOrder[nextPosition], autoplay)
        return
      }
      if (state.repeatMode === 'all' && state.shuffleOrder.length > 0) {
        activateIndex(state.shuffleOrder[0], autoplay)
        return
      }
      stopAtQueueEnd()
      return
    }

    if (state.currentIndex + 1 < state.queue.length) {
      activateIndex(state.currentIndex + 1, autoplay)
      return
    }
    if (state.repeatMode === 'all') {
      activateIndex(0, autoplay)
      return
    }
    stopAtQueueEnd()
  }

  return {
    ...initialState,

    initializeEngine: () => {
      if (get().initialized) return
      set({ initialized: true })
      audioEngine.setVolume(get().volume)
      audioEngine.setMuted(get().isMuted)
      const track = currentTrack(get())
      if (!track) return
      try {
        const generation = audioEngine.loadSource(track.audioUrl)
        set({
          activeGeneration: generation,
          playbackStatus: 'paused',
          shouldPlay: false,
          pendingSeekMs: get().currentTimeMs > 0 ? get().currentTimeMs : null,
        })
      } catch (error) {
        set({
          playbackStatus: 'error',
          error: normalizePlaybackError(error, track.id, 'AUDIO_LOAD_FAILED'),
        })
      }
    },

    playTrack: (track) => {
      if (!isPlayableTrack(track)) {
        set({
          playbackStatus: 'error',
          error: { code: 'AUDIO_SOURCE_UNAVAILABLE', message: 'Bài hát chưa có nguồn âm thanh.' },
        })
        return
      }
      const state = get()
      if (isSameTrack(currentTrack(state), track)) {
        state.togglePlay()
        return
      }
      set({
        queue: [track],
        currentIndex: 0,
        shuffleOrder: state.shuffleEnabled ? [0] : [],
        shufflePosition: state.shuffleEnabled ? 0 : -1,
      })
      activateIndex(0, true)
    },

    playQueue: (tracks, requestedIndex = 0) => {
      const queue = sanitizeQueue(tracks)
      if (queue.length === 0) {
        get().clearAll()
        return
      }
      const index = clampQueueIndex(queue.length, requestedIndex)
      const state = get()
      if (isSameTrack(currentTrack(state), queue[index])) {
        state.togglePlay()
        return
      }
      const shuffleOrder = state.shuffleEnabled ? createShuffleOrder(queue.length, index) : []
      set({
        queue,
        currentIndex: index,
        shuffleOrder,
        shufflePosition: state.shuffleEnabled ? 0 : -1,
      })
      activateIndex(index, true)
    },

    playIndex: (index) => {
      const safeIndex = clampQueueIndex(get().queue.length, index)
      if (safeIndex < 0) return
      if (safeIndex === get().currentIndex) {
        get().togglePlay()
        return
      }
      activateIndex(safeIndex, true)
    },

    pause: () => {
      const state = get()
      if (!currentTrack(state)) return
      set({
        shouldPlay: false,
        playbackStatus:
          state.playbackStatus === 'loading' || state.playbackStatus === 'buffering'
            ? 'paused'
            : state.playbackStatus,
      })
      try {
        audioEngine.pause()
      } catch {
        set({ playbackStatus: 'paused' })
      }
      persist()
    },

    resume: () => {
      const state = get()
      const track = currentTrack(state)
      if (!track) return
      if (state.playbackStatus === 'error') {
        state.retry()
        return
      }
      if (state.currentTimeMs >= state.durationMs && state.durationMs > 0) {
        audioEngine.seek(0)
        set({ currentTimeMs: 0 })
      }
      if (audioEngine.getSourceUrl() !== track.audioUrl) {
        activateIndex(state.currentIndex, true, get().currentTimeMs)
        return
      }
      set({ shouldPlay: true, playbackStatus: 'loading', error: null })
      requestPlay(state.activeGeneration, track.id)
    },

    togglePlay: () => {
      const status = get().playbackStatus
      if (status === 'playing' || status === 'loading' || status === 'buffering') {
        get().pause()
      } else {
        get().resume()
      }
    },

    next: () => {
      const status = get().playbackStatus
      emitPlaybackEvent('track_skipped', currentTrack(get()))
      advance(status === 'playing' || status === 'loading' || status === 'buffering')
    },

    previous: () => {
      const state = get()
      if (!currentTrack(state)) return
      if (state.currentTimeMs > PREVIOUS_RESTART_THRESHOLD_MS) {
        get().seek(0)
        return
      }
      const autoplay =
        state.playbackStatus === 'playing' ||
        state.playbackStatus === 'loading' ||
        state.playbackStatus === 'buffering'
      if (state.shuffleEnabled && state.shufflePosition > 0) {
        emitPlaybackEvent('track_skipped', currentTrack(state))
        activateIndex(state.shuffleOrder[state.shufflePosition - 1], autoplay)
        return
      }
      if (!state.shuffleEnabled && state.currentIndex > 0) {
        emitPlaybackEvent('track_skipped', currentTrack(state))
        activateIndex(state.currentIndex - 1, autoplay)
        return
      }
      get().seek(0)
    },

    seek: (positionMs) => {
      const state = get()
      if (!currentTrack(state)) return
      const maximum = state.durationMs > 0 ? state.durationMs : Math.max(0, positionMs)
      const position = clamp(positionMs, 0, maximum)
      audioEngine.seek(position)
      set({ currentTimeMs: position, pendingSeekMs: null })
      persist()
    },

    setVolume: (volume) => {
      const normalized = clamp(volume, 0, 1)
      audioEngine.setVolume(normalized)
      set({
        volume: normalized,
        previousVolume: normalized > 0 ? normalized : get().previousVolume,
      })
      persist()
    },

    toggleMute: () => {
      const muted = !get().isMuted
      audioEngine.setMuted(muted)
      set({ isMuted: muted })
      persist()
    },

    setRepeatMode: (repeatMode) => {
      set({ repeatMode })
      persist()
    },

    cycleRepeatMode: () => {
      const nextMode: Record<RepeatMode, RepeatMode> = { off: 'all', all: 'one', one: 'off' }
      get().setRepeatMode(nextMode[get().repeatMode])
    },

    toggleShuffle: () => {
      const state = get()
      if (state.shuffleEnabled) {
        set({ shuffleEnabled: false, shuffleOrder: [], shufflePosition: -1 })
      } else if (state.currentIndex >= 0) {
        set({
          shuffleEnabled: true,
          shuffleOrder: createShuffleOrder(state.queue.length, state.currentIndex),
          shufflePosition: 0,
        })
      } else {
        set({ shuffleEnabled: true, shuffleOrder: [], shufflePosition: -1 })
      }
      persist()
    },

    addToQueue: (track) => {
      if (!isPlayableTrack(track)) return
      const state = get()
      if (state.queue.length === 0) {
        set({ queue: [track], currentIndex: 0, playbackStatus: 'paused' })
        if (state.shuffleEnabled) set({ shuffleOrder: [0], shufflePosition: 0 })
        activateIndex(0, false)
        return
      }
      const newIndex = state.queue.length
      set({
        queue: [...state.queue, track],
        shuffleOrder: state.shuffleEnabled ? [...state.shuffleOrder, newIndex] : state.shuffleOrder,
      })
      persist()
    },

    playNext: (track) => {
      if (!isPlayableTrack(track)) return
      const state = get()
      if (state.queue.length === 0) {
        get().addToQueue(track)
        return
      }
      const inserted = insertAfterCurrent(state.queue, state.currentIndex, track)
      set({
        queue: inserted.queue,
        shuffleOrder: state.shuffleEnabled
          ? insertIntoShuffleOrder(
              state.shuffleOrder,
              inserted.insertIndex,
              state.shufflePosition + 1,
            )
          : state.shuffleOrder,
      })
      persist()
    },

    moveToNext: (index) => {
      const state = get()
      if (index < 0 || index >= state.queue.length || index === state.currentIndex) return
      const track = state.queue[index]
      const without = removeQueueIndex(state.queue, index)
      const adjustedCurrent = state.currentIndex - (index < state.currentIndex ? 1 : 0)
      const inserted = insertAfterCurrent(without, adjustedCurrent, track)
      let shuffleOrder = state.shuffleOrder
      let shufflePosition = state.shufflePosition
      if (state.shuffleEnabled) {
        const removedOrder = removeFromShuffleOrder(state.shuffleOrder, index)
        shufflePosition = removedOrder.indexOf(adjustedCurrent)
        shuffleOrder = insertIntoShuffleOrder(
          removedOrder,
          inserted.insertIndex,
          shufflePosition + 1,
        )
      }
      set({
        queue: inserted.queue,
        currentIndex: adjustedCurrent,
        shuffleOrder,
        shufflePosition,
      })
      persist()
    },

    removeFromQueue: (index) => {
      const state = get()
      if (index < 0 || index >= state.queue.length) return
      const queue = removeQueueIndex(state.queue, index)
      if (queue.length === 0) {
        get().clearAll()
        return
      }

      const removedCurrent = index === state.currentIndex
      const shuffleOrder = state.shuffleEnabled
        ? removeFromShuffleOrder(state.shuffleOrder, index)
        : []
      if (!removedCurrent) {
        const nextCurrentIndex = state.currentIndex - (index < state.currentIndex ? 1 : 0)
        set({
          queue,
          currentIndex: nextCurrentIndex,
          shuffleOrder,
          shufflePosition: state.shuffleEnabled ? shuffleOrder.indexOf(nextCurrentIndex) : -1,
        })
        persist()
        return
      }

      const autoplay =
        state.playbackStatus === 'playing' ||
        state.playbackStatus === 'loading' ||
        state.playbackStatus === 'buffering'
      const nextPosition = state.shuffleEnabled
        ? Math.min(state.shufflePosition, shuffleOrder.length - 1)
        : -1
      const nextCurrentIndex = state.shuffleEnabled
        ? shuffleOrder[nextPosition]
        : Math.min(index, queue.length - 1)
      set({ queue, shuffleOrder, shufflePosition: nextPosition })
      activateIndex(nextCurrentIndex, autoplay)
    },

    clearUpcoming: () => {
      const track = currentTrack(get())
      if (!track) return
      set({
        queue: [track],
        currentIndex: 0,
        shuffleOrder: get().shuffleEnabled ? [0] : [],
        shufflePosition: get().shuffleEnabled ? 0 : -1,
      })
      persist()
    },

    clearAll: () => {
      let generation = get().activeGeneration
      try {
        generation = audioEngine.clearSource()
      } catch {
        // Clearing state is still valid if the platform media API is unavailable.
      }
      set({
        queue: [],
        currentIndex: -1,
        playbackStatus: 'idle',
        currentTimeMs: 0,
        durationMs: 0,
        shuffleOrder: [],
        shufflePosition: -1,
        error: null,
        shouldPlay: false,
        activeGeneration: generation,
        pendingSeekMs: null,
        isExpanded: false,
      })
      persist()
    },

    retry: () => {
      const state = get()
      if (!currentTrack(state)) return
      activateIndex(state.currentIndex, true, state.currentTimeMs)
    },

    setQueueOpen: (isQueueOpen) => set({ isQueueOpen }),
    setExpanded: (isExpanded) => set({ isExpanded }),
    setPlaybackStatus: (playbackStatus) => set({ playbackStatus }),

    setProgress: (positionMs) => {
      const duration = get().durationMs
      set({ currentTimeMs: clamp(positionMs, 0, duration > 0 ? duration : positionMs) })
      const now = Date.now()
      if (now - lastProgressPersistedAt >= PROGRESS_PERSIST_INTERVAL_MS) {
        lastProgressPersistedAt = now
        persist()
      }
    },

    setDuration: (durationMs) => set({ durationMs: safeDurationMs(durationMs) }),

    setError: (error) =>
      set({
        error,
        playbackStatus: error ? 'error' : currentTrack(get()) ? 'paused' : 'idle',
        shouldPlay: error ? false : get().shouldPlay,
      }),

    handleAudioEvent: (event) => {
      const state = get()
      const track = currentTrack(state)
      if (
        !track ||
        event.generation !== state.activeGeneration ||
        event.sourceUrl !== track.audioUrl
      ) {
        return
      }

      switch (event.type) {
        case 'loadstart':
          if (state.shouldPlay) set({ playbackStatus: 'loading', error: null })
          break
        case 'loadedmetadata':
        case 'durationchange': {
          const duration = safeDurationMs(event.durationMs) || safeDurationMs(track.durationMs)
          set({ durationMs: duration })
          const pendingSeek = get().pendingSeekMs
          if (pendingSeek != null) {
            const position = duration > 0 ? clamp(pendingSeek, 0, duration) : pendingSeek
            audioEngine.seek(position)
            set({ currentTimeMs: position, pendingSeekMs: null })
          }
          break
        }
        case 'playing':
          if (!get().shouldPlay) {
            audioEngine.pause()
            break
          }
          set({ playbackStatus: 'playing', error: null })
          emitPlaybackEvent(get().currentTimeMs > 0 ? 'track_resumed' : 'track_started', track)
          break
        case 'pause':
          if (!event.ended && get().playbackStatus !== 'error') {
            set({ playbackStatus: 'paused', shouldPlay: false })
            emitPlaybackEvent('track_paused', track)
            persist()
          }
          break
        case 'waiting':
        case 'stalled':
          if (get().shouldPlay) set({ playbackStatus: 'buffering' })
          break
        case 'timeupdate':
          get().setProgress(event.currentTimeMs)
          break
        case 'volumechange':
          set({
            volume: clamp(event.volume, 0, 1),
            isMuted: event.muted,
            previousVolume: event.volume > 0 ? event.volume : get().previousVolume,
          })
          break
        case 'ended':
          emitPlaybackEvent('track_completed', track)
          if (get().repeatMode === 'one') {
            audioEngine.seek(0)
            set({ currentTimeMs: 0, shouldPlay: true, playbackStatus: 'loading' })
            requestPlay(get().activeGeneration, track.id)
          } else {
            advance(true)
          }
          break
        case 'error': {
          const playerError = normalizeMediaError(event.mediaErrorCode, track.id)
          set({ playbackStatus: 'error', error: playerError, shouldPlay: false })
          emitPlaybackEvent('playback_error', track)
          persist()
          break
        }
        case 'canplay':
        case 'play':
          break
      }
    },

    persistNow: persist,
  }
})

export const selectCurrentTrack = (state: PlayerStore) => currentTrack(state)
export const selectIsPlaying = (state: PlayerStore) => state.playbackStatus === 'playing'
export const selectIsBusy = (state: PlayerStore) =>
  state.playbackStatus === 'loading' || state.playbackStatus === 'buffering'
