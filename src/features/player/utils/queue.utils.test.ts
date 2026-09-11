import { describe, expect, it } from 'vitest'
import type { PlayableTrack } from '@/features/songs/types/song.types'
import { clampQueueIndex, insertAfterCurrent, removeQueueIndex, sanitizeQueue } from './queue.utils'

const track = (id: number): PlayableTrack => ({
  id,
  title: `Track ${id}`,
  artistId: 1,
  artistName: 'Nocturne',
  audioUrl: `https://audio.test/${id}.mp3`,
  durationMs: 180_000,
})

describe('queue utilities', () => {
  it('clamps queue indices and keeps the empty invariant', () => {
    expect(clampQueueIndex(0, 8)).toBe(-1)
    expect(clampQueueIndex(3, -4)).toBe(0)
    expect(clampQueueIndex(3, 9)).toBe(2)
  })

  it('inserts directly after current and preserves duplicate tracks', () => {
    const duplicate = track(2)
    const result = insertAfterCurrent([track(1), track(2), track(3)], 1, duplicate)
    expect(result.insertIndex).toBe(2)
    expect(result.queue.map((item) => item.id)).toEqual([1, 2, 2, 3])
  })

  it('removes exactly one canonical queue position', () => {
    expect(removeQueueIndex([track(1), track(2), track(2)], 1).map((item) => item.id)).toEqual([
      1, 2,
    ])
  })

  it('discards invalid persisted or external tracks', () => {
    expect(sanitizeQueue([track(1), { ...track(2), audioUrl: '' }])).toEqual([track(1)])
  })
})
