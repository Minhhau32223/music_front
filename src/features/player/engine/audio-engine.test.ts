import { describe, expect, it, vi } from 'vitest'
import { AudioEngine } from './audio-engine'

class FakeAudio extends EventTarget {
  preload = ''
  src = ''
  currentTime = 0
  duration = 120
  volume = 1
  muted = false
  ended = false
  error: MediaError | null = null
  load = vi.fn()
  play = vi.fn(() => Promise.resolve())
  pause = vi.fn()
  removeAttribute = vi.fn((name: string) => {
    if (name === 'src') this.src = ''
  })
}

describe('AudioEngine', () => {
  it('creates one audio element and reuses it for every source', () => {
    const audio = new FakeAudio()
    const factory = vi.fn(() => audio as unknown as HTMLAudioElement)
    const engine = new AudioEngine(factory)
    engine.loadSource('a.mp3')
    engine.loadSource('b.mp3')
    expect(factory).toHaveBeenCalledTimes(1)
    expect(audio.src).toBe('b.mp3')
    expect(audio.load).toHaveBeenCalledTimes(2)
    expect(engine.getGeneration()).toBe(2)
  })

  it('maps native events to millisecond snapshots', () => {
    const audio = new FakeAudio()
    const engine = new AudioEngine(() => audio as unknown as HTMLAudioElement)
    const listener = vi.fn()
    engine.subscribe(listener)
    engine.loadSource('track.mp3')
    audio.currentTime = 12.5
    audio.dispatchEvent(new Event('timeupdate'))
    expect(listener).toHaveBeenLastCalledWith(
      expect.objectContaining({
        type: 'timeupdate',
        currentTimeMs: 12_500,
        durationMs: 120_000,
        sourceUrl: 'track.mp3',
      }),
    )
  })

  it('delegates playback, seek, volume and mute to the shared element', async () => {
    const audio = new FakeAudio()
    const engine = new AudioEngine(() => audio as unknown as HTMLAudioElement)
    engine.loadSource('track.mp3')
    await engine.play()
    engine.seek(240_000)
    engine.setVolume(2)
    engine.setMuted(true)
    engine.pause()
    expect(audio.play).toHaveBeenCalledOnce()
    expect(audio.currentTime).toBe(120)
    expect(audio.volume).toBe(1)
    expect(audio.muted).toBe(true)
    expect(audio.pause).toHaveBeenCalledOnce()
  })
})
