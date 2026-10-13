import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PlayableTrack } from '@/features/songs/types/song.types'
import { audioEngine } from '../engine/audio-engine'
import { EMPTY_PLAYER_STATE, usePlayerStore } from './player.store'

const track = (id: number): PlayableTrack => ({
  id,
  title: `Track ${id}`,
  artistId: id,
  artistName: `Artist ${id}`,
  playbackUrl: `https://audio.test/${id}.mp3`,
  durationMs: 180_000,
})

let generation = 0

function engineEvent(
  type: 'playing' | 'ended' | 'timeupdate',
  eventGeneration: number,
  sourceUrl: string,
) {
  return {
    type,
    generation: eventGeneration,
    sourceUrl,
    currentTimeMs: type === 'timeupdate' ? 12_000 : 0,
    durationMs: 180_000,
    volume: 0.7,
    muted: false,
    ended: type === 'ended',
  } as const
}

describe('player store', () => {
  it('handles autoplay rejection without a retry loop', async () => {
    vi.mocked(audioEngine.play).mockRejectedValueOnce(
      new DOMException('Blocked', 'NotAllowedError'),
    )
    usePlayerStore.getState().playTrack(track(1))
    await Promise.resolve()
    expect(usePlayerStore.getState()).toMatchObject({ playbackStatus: 'error', shouldPlay: false })
    expect(audioEngine.play).toHaveBeenCalledTimes(1)
  })
  it('recovers offline playback only through an explicit retry', () => {
    const online = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    usePlayerStore.getState().playTrack(track(1))
    expect(audioEngine.loadSource).not.toHaveBeenCalled()
    expect(usePlayerStore.getState().error?.code).toBe('NETWORK_ERROR')
    online.mockReturnValue(true)
    usePlayerStore.getState().retry()
    expect(audioEngine.loadSource).toHaveBeenCalledTimes(1)
    expect(usePlayerStore.getState().shouldPlay).toBe(true)
    online.mockRestore()
  })
  it('retains queue on failed media and does not repeatedly reload', () => {
    usePlayerStore.getState().playQueue([track(1), track(2)])
    const state = usePlayerStore.getState()
    state.handleAudioEvent({
      ...engineEvent('playing', state.activeGeneration, track(1).playbackUrl),
      type: 'error',
      mediaErrorCode: 4,
    })
    expect(usePlayerStore.getState().playbackStatus).toBe('error')
    expect(usePlayerStore.getState().queue).toHaveLength(2)
    expect(audioEngine.loadSource).toHaveBeenCalledTimes(1)
  })
  it('defers seek until metadata and clamps it to the real duration', () => {
    usePlayerStore.getState().playTrack(track(1))
    usePlayerStore.getState().seek(999_000)
    expect(audioEngine.seek).not.toHaveBeenCalled()
    expect(usePlayerStore.getState().pendingSeekMs).toBe(999_000)
    const activeGeneration = usePlayerStore.getState().activeGeneration
    usePlayerStore.getState().handleAudioEvent({
      ...engineEvent('timeupdate', activeGeneration, track(1).playbackUrl),
      type: 'loadedmetadata',
      durationMs: 120_000,
    })
    expect(audioEngine.seek).toHaveBeenLastCalledWith(120_000)
    expect(usePlayerStore.getState().pendingSeekMs).toBeNull()
  })
  beforeEach(() => {
    generation = 0
    window.localStorage.clear()
    usePlayerStore.setState({ ...EMPTY_PLAYER_STATE, initialized: true })
    vi.spyOn(audioEngine, 'loadSource').mockImplementation(() => {
      generation += 1
      return generation
    })
    vi.spyOn(audioEngine, 'play').mockResolvedValue()
    vi.spyOn(audioEngine, 'pause').mockImplementation(() => undefined)
    vi.spyOn(audioEngine, 'seek').mockImplementation(() => undefined)
    vi.spyOn(audioEngine, 'setVolume').mockImplementation(() => undefined)
    vi.spyOn(audioEngine, 'setMuted').mockImplementation(() => undefined)
    vi.spyOn(audioEngine, 'clearSource').mockImplementation(() => {
      generation += 1
      return generation
    })
  })

  it('creates a context-aware queue and trusts playing only after the engine event', () => {
    usePlayerStore.getState().playQueue([track(1), track(2), track(3)], 1)
    expect(usePlayerStore.getState()).toMatchObject({
      currentIndex: 1,
      playbackStatus: 'loading',
      shouldPlay: true,
    })
    usePlayerStore.getState().handleAudioEvent(engineEvent('playing', 1, track(2).playbackUrl))
    expect(usePlayerStore.getState().playbackStatus).toBe('playing')
  })

  it('keeps queue invariants when removing before and at current', () => {
    usePlayerStore.getState().playQueue([track(1), track(2), track(3)], 1)
    usePlayerStore.getState().removeFromQueue(0)
    expect(usePlayerStore.getState()).toMatchObject({ currentIndex: 0 })
    expect(usePlayerStore.getState().queue.map((item) => item.id)).toEqual([2, 3])
    usePlayerStore.getState().removeFromQueue(0)
    expect(usePlayerStore.getState()).toMatchObject({ currentIndex: 0 })
    expect(usePlayerStore.getState().queue.map((item) => item.id)).toEqual([3])
  })

  it('inserts play-next immediately after the current track', () => {
    usePlayerStore.getState().playQueue([track(1), track(2), track(3)], 1)
    usePlayerStore.getState().playNext(track(9))
    expect(usePlayerStore.getState().queue.map((item) => item.id)).toEqual([1, 2, 9, 3])
    expect(usePlayerStore.getState().currentIndex).toBe(1)
  })

  it('keeps canonical queue and current track stable while toggling shuffle', () => {
    usePlayerStore.getState().playQueue([track(1), track(2), track(3), track(4)], 2)
    usePlayerStore.getState().toggleShuffle()
    const shuffled = usePlayerStore.getState()
    expect(shuffled.queue.map((item) => item.id)).toEqual([1, 2, 3, 4])
    expect(shuffled.currentIndex).toBe(2)
    expect(shuffled.shuffleOrder[0]).toBe(2)
    expect(new Set(shuffled.shuffleOrder)).toEqual(new Set([0, 1, 2, 3]))
    usePlayerStore.getState().toggleShuffle()
    expect(usePlayerStore.getState()).toMatchObject({
      currentIndex: 2,
      shuffleEnabled: false,
      shuffleOrder: [],
    })
  })

  it('implements repeat all and repeat one ended behavior', () => {
    usePlayerStore.getState().playQueue([track(1), track(2)], 1)
    usePlayerStore.getState().setRepeatMode('all')
    usePlayerStore.getState().handleAudioEvent(engineEvent('ended', 1, track(2).playbackUrl))
    expect(usePlayerStore.getState().currentIndex).toBe(0)

    usePlayerStore.getState().setRepeatMode('one')
    const activeGeneration = usePlayerStore.getState().activeGeneration
    usePlayerStore
      .getState()
      .handleAudioEvent(engineEvent('ended', activeGeneration, track(1).playbackUrl))
    expect(audioEngine.seek).toHaveBeenLastCalledWith(0)
    expect(usePlayerStore.getState()).toMatchObject({ currentIndex: 0, shouldPlay: true })
  })

  it('restarts previous after three seconds and otherwise selects the previous item', () => {
    usePlayerStore.getState().playQueue([track(1), track(2)], 1)
    usePlayerStore.setState({
      currentTimeMs: 3_001,
      durationMs: 180_000,
      playbackStatus: 'playing',
    })
    usePlayerStore.getState().previous()
    expect(audioEngine.seek).toHaveBeenLastCalledWith(0)
    expect(usePlayerStore.getState().currentIndex).toBe(1)

    usePlayerStore.setState({ currentTimeMs: 2_000 })
    usePlayerStore.getState().previous()
    expect(usePlayerStore.getState().currentIndex).toBe(0)
  })

  it('ignores stale events during rapid next actions', () => {
    usePlayerStore.getState().playQueue([track(1), track(2), track(3)], 0)
    usePlayerStore.getState().next()
    usePlayerStore.getState().next()
    expect(usePlayerStore.getState()).toMatchObject({ currentIndex: 2, activeGeneration: 3 })
    usePlayerStore.getState().handleAudioEvent(engineEvent('playing', 1, track(1).playbackUrl))
    expect(usePlayerStore.getState().playbackStatus).toBe('loading')
    usePlayerStore.getState().handleAudioEvent(engineEvent('playing', 3, track(3).playbackUrl))
    expect(usePlayerStore.getState().playbackStatus).toBe('playing')
  })

  it('restores queue and position without persisting an autoplay state', () => {
    usePlayerStore.getState().playQueue([track(1)], 0)
    usePlayerStore.setState({ currentTimeMs: 42_000, playbackStatus: 'playing' })
    usePlayerStore.getState().persistNow()
    const persisted = JSON.parse(window.localStorage.getItem('nocturne-player-v1') ?? '{}')
    expect(persisted.positionMs).toBe(42_000)
    expect(persisted.playbackStatus).toBeUndefined()
    expect(persisted.shouldPlay).toBeUndefined()
  })

  it('prioritizes Play Next under shuffle and preserves playback while appending and clearing upcoming', () => {
    usePlayerStore.getState().playQueue([track(1), track(2), track(3)])
    usePlayerStore.setState({ currentTimeMs: 15000, playbackStatus: 'playing' })
    usePlayerStore.getState().addToQueue(track(1))
    expect(usePlayerStore.getState()).toMatchObject({
      currentIndex: 0,
      currentTimeMs: 15000,
      playbackStatus: 'playing',
    })
    usePlayerStore.getState().toggleShuffle()
    usePlayerStore.getState().playNext(track(8))
    const state = usePlayerStore.getState()
    expect(state.queue[state.shuffleOrder[state.shufflePosition + 1]].id).toBe(8)
    const current = state.queue[0]
    usePlayerStore.getState().clearUpcoming()
    expect(usePlayerStore.getState().queue).toEqual([current])
    expect(usePlayerStore.getState()).toMatchObject({
      currentTimeMs: 15000,
      playbackStatus: 'playing',
    })
    expect(audioEngine.loadSource).toHaveBeenCalledTimes(1)
  })

  it('takes runtime duration from metadata even when imported duration is zero', () => {
    usePlayerStore.getState().playTrack({ ...track(1), durationMs: 0 })
    expect(usePlayerStore.getState().durationMs).toBe(0)
    usePlayerStore.getState().handleAudioEvent({
      ...engineEvent('playing', generation, track(1).playbackUrl),
      type: 'loadedmetadata',
      durationMs: 231000,
    })
    expect(usePlayerStore.getState().durationMs).toBe(231000)
  })

  it('stops at the end with repeat off and permits manual next with repeat one', () => {
    usePlayerStore.getState().playQueue([track(1), track(2)])
    usePlayerStore.getState().setRepeatMode('one')
    usePlayerStore.getState().next()
    expect(usePlayerStore.getState().currentIndex).toBe(1)
    usePlayerStore.getState().setRepeatMode('off')
    usePlayerStore
      .getState()
      .handleAudioEvent(engineEvent('ended', generation, track(2).playbackUrl))
    expect(usePlayerStore.getState()).toMatchObject({
      shouldPlay: false,
      playbackStatus: 'paused',
      currentIndex: 1,
    })
  })
})
