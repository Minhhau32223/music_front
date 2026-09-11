import { useCallback, useEffect, useRef } from 'react'

export function useIntentPrefetch(prefetch: () => void, delayMs = 150) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestPrefetch = useRef(prefetch)

  useEffect(() => {
    latestPrefetch.current = prefetch
  }, [prefetch])

  const cancel = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
  }, [])

  const schedule = useCallback(() => {
    cancel()
    timer.current = setTimeout(() => {
      timer.current = null
      latestPrefetch.current()
    }, delayMs)
  }, [cancel, delayMs])

  useEffect(() => cancel, [cancel])

  return { schedule, cancel }
}
