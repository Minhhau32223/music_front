export function parseDurationToMs(value: string | null | undefined): number {
  if (!value) return 0
  if (/^\d+$/.test(value)) return Number(value) * 1000
  const parts = value.split(':').map(Number)
  return parts.some(Number.isNaN) ? 0 : parts.reduce((total, part) => total * 60 + part, 0) * 1000
}

export function formatDuration(durationMs: number): string {
  const seconds = Math.max(0, Math.floor(durationMs / 1000))
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}
