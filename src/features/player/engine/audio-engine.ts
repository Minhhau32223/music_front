import type { AudioEngineEvent, AudioEngineEventType } from '../types/player.types'

type AudioFactory = () => HTMLAudioElement
type AudioListener = (event: AudioEngineEvent) => void

const EVENTS: AudioEngineEventType[] = [
  'loadstart',
  'loadedmetadata',
  'canplay',
  'play',
  'playing',
  'pause',
  'waiting',
  'stalled',
  'timeupdate',
  'durationchange',
  'volumechange',
  'ended',
  'error',
]

function toMilliseconds(seconds: number) {
  return Number.isFinite(seconds) && seconds >= 0 ? Math.round(seconds * 1000) : 0
}

export class AudioEngine {
  private audio: HTMLAudioElement | null = null
  private generation = 0
  private sourceUrl = ''
  private readonly listeners = new Set<AudioListener>()
  private readonly createAudio: AudioFactory

  constructor(createAudio: AudioFactory = () => document.createElement('audio')) {
    this.createAudio = createAudio
  }

  private getAudio() {
    if (!this.audio) {
      this.audio = this.createAudio()
      this.audio.preload = 'metadata'
      for (const eventName of EVENTS) {
        this.audio.addEventListener(eventName, () => this.emit(eventName))
      }
    }
    return this.audio
  }

  private emit(type: AudioEngineEventType) {
    const audio = this.getAudio()
    const event: AudioEngineEvent = {
      type,
      generation: this.generation,
      sourceUrl: this.sourceUrl,
      currentTimeMs: toMilliseconds(audio.currentTime),
      durationMs: toMilliseconds(audio.duration),
      volume: audio.volume,
      muted: audio.muted,
      ended: audio.ended,
      mediaErrorCode: audio.error?.code,
    }
    for (const listener of this.listeners) listener(event)
  }

  subscribe(listener: AudioListener) {
    this.getAudio()
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  loadSource(sourceUrl: string) {
    if (!sourceUrl.trim()) throw new Error('Audio source is unavailable')
    const audio = this.getAudio()
    this.generation += 1
    this.sourceUrl = sourceUrl
    audio.src = sourceUrl
    audio.preload = 'metadata'
    audio.load()
    return this.generation
  }

  clearSource() {
    const audio = this.getAudio()
    this.generation += 1
    this.sourceUrl = ''
    audio.pause()
    audio.removeAttribute('src')
    audio.load()
    return this.generation
  }

  play() {
    if (!this.sourceUrl) return Promise.reject(new Error('Audio source is unavailable'))
    return this.getAudio().play()
  }

  pause() {
    this.getAudio().pause()
  }

  seek(positionMs: number) {
    const audio = this.getAudio()
    if (!Number.isFinite(positionMs) || positionMs < 0) return
    const durationMs = toMilliseconds(audio.duration)
    audio.currentTime = (durationMs > 0 ? Math.min(positionMs, durationMs) : positionMs) / 1000
  }

  setVolume(volume: number) {
    this.getAudio().volume = Math.min(1, Math.max(0, volume))
  }

  setMuted(muted: boolean) {
    this.getAudio().muted = muted
  }

  getSourceUrl() {
    return this.sourceUrl
  }

  getGeneration() {
    return this.generation
  }
}

export const audioEngine = new AudioEngine()
