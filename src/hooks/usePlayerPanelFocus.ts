import { useEffect, useRef } from 'react'

export function usePlayerPanelFocus(open: boolean, close: () => void) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!open || !ref.current) return
    const panel = ref.current
    const previous = document.activeElement as HTMLElement | null
    const items = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled)'),
      ).filter((item) => item.getClientRects().length > 0)
    items()[0]?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (document.querySelector('.song-menu-backdrop, .modal-backdrop')) return
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
      }
      if (event.key !== 'Tab') return
      const all = items()
      const first = all[0]
      const last = all.at(-1)
      if (!first) {
        event.preventDefault()
        return
      }
      if (
        event.shiftKey &&
        (document.activeElement === first || !panel.contains(document.activeElement))
      ) {
        event.preventDefault()
        last?.focus()
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || !panel.contains(document.activeElement))
      ) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (previous?.isConnected) previous.focus({ preventScroll: true })
    }
  }, [open, close])
  return ref
}
