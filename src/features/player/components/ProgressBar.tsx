import { useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { formatDuration } from '@/lib/format/duration'
import { usePlaybackProgress } from '../hooks/usePlaybackProgress'

export function ProgressBar({ expanded = false }: { expanded?: boolean }) {
  const { currentTimeMs, durationMs, seek } = usePlaybackProgress()
  const [previewMs, setPreviewMs] = useState<number | null>(null)
  const scrubbing = useRef(false)
  const shownTime = previewMs ?? currentTimeMs
  const maximum = Math.max(1, durationMs)
  const percent = Math.min(100, Math.max(0, (shownTime / maximum) * 100))

  const finishScrub = (event: PointerEvent<HTMLInputElement>) => {
    if (!scrubbing.current) return
    scrubbing.current = false
    event.currentTarget.releasePointerCapture?.(event.pointerId)
    const position = previewMs ?? Number(event.currentTarget.value)
    seek(position)
    setPreviewMs(null)
  }

  return (
    <div className={`player-progress${expanded ? ' expanded' : ''}`}>
      <span>{formatDuration(shownTime)}</span>
      <input
        className="player-range progress-range"
        type="range"
        min={0}
        max={maximum}
        step={1000}
        value={Math.min(shownTime, maximum)}
        disabled={durationMs <= 0}
        aria-label="Tiến độ bài hát"
        aria-valuetext={`${formatDuration(shownTime)} trên ${formatDuration(durationMs)}`}
        style={{ '--range-progress': `${percent}%` } as CSSProperties}
        onPointerDown={(event) => {
          scrubbing.current = true
          event.currentTarget.setPointerCapture?.(event.pointerId)
        }}
        onChange={(event) => {
          const position = Number(event.currentTarget.value)
          if (scrubbing.current) setPreviewMs(position)
          else seek(position)
        }}
        onPointerUp={finishScrub}
        onPointerCancel={() => {
          scrubbing.current = false
          setPreviewMs(null)
        }}
      />
      <span>{formatDuration(durationMs)}</span>
    </div>
  )
}
