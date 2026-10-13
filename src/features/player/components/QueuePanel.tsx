import { ListMusic, Trash2, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef } from 'react'
import { usePlayerPanelFocus } from '@/hooks/usePlayerPanelFocus'
import { IconButton } from '@/components/ui/IconButton'
import { selectCurrentTrack, usePlayerStore } from '../store/player.store'
import { QueueItem } from './QueueItem'

export function QueuePanel() {
  const open = usePlayerStore((state) => state.isQueueOpen)
  const queue = usePlayerStore((state) => state.queue)
  const currentIndex = usePlayerStore((state) => state.currentIndex)
  const shuffleEnabled = usePlayerStore((state) => state.shuffleEnabled)
  const shuffleOrder = usePlayerStore((state) => state.shuffleOrder)
  const shufflePosition = usePlayerStore((state) => state.shufflePosition)
  const track = usePlayerStore(selectCurrentTrack)
  const setOpen = usePlayerStore((state) => state.setQueueOpen)
  const playIndex = usePlayerStore((state) => state.playIndex)
  const moveToNext = usePlayerStore((state) => state.moveToNext)
  const remove = usePlayerStore((state) => state.removeFromQueue)
  const clearUpcoming = usePlayerStore((state) => state.clearUpcoming)
  const close = useCallback(() => setOpen(false), [setOpen])
  const dragStartY = useRef<number | null>(null)
  const queueHistoryEntry = useRef(false)

  useEffect(() => {
    if (!open || typeof window === 'undefined') {
      queueHistoryEntry.current = false
      return
    }

    if (!queueHistoryEntry.current) {
      const marker = { ...(window.history.state ?? {}), nocturneQueue: true }
      window.history.pushState(marker, '', window.location.href)
      queueHistoryEntry.current = true
    }

    const closeFromBrowserBack = () => {
      queueHistoryEntry.current = false
      usePlayerStore.getState().setQueueOpen(false)
    }
    window.addEventListener('popstate', closeFromBrowserBack)
    return () => window.removeEventListener('popstate', closeFromBrowserBack)
  }, [open])

  const dismiss = useCallback(() => {
    if (queueHistoryEntry.current && window.history.state?.nocturneQueue) {
      window.history.back()
      return
    }
    close()
  }, [close])
  const panelRef = usePlayerPanelFocus(open, dismiss)

  const beginSheetDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'touch') return
    dragStartY.current = event.clientY
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const finishSheetDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartY.current !== null && event.clientY - dragStartY.current >= 88) dismiss()
    dragStartY.current = null
  }

  useEffect(() => {
    if (!open) return
    document.body.dataset.queueOpen = 'true'
    return () => {
      delete document.body.dataset.queueOpen
    }
  }, [open])

  const upcomingIndices = shuffleEnabled
    ? shuffleOrder.slice(shufflePosition + 1)
    : queue.map((_, index) => index).slice(currentIndex + 1)

  return (
    <>
      <button
        type="button"
        className="queue-panel-backdrop"
        aria-label="Close queue"
        tabIndex={open ? 0 : -1}
        onClick={dismiss}
        data-open={open}
      />
      <aside
        ref={panelRef}
        inert={!open}
        role="dialog"
        aria-modal={open}
        className="player-queue-panel"
        data-open={open}
        aria-label="Music queue"
        aria-hidden={!open}
      >
      <div
        className="queue-drag-region"
        aria-hidden="true"
        onPointerDown={beginSheetDrag}
        onPointerUp={finishSheetDrag}
        onPointerCancel={() => {
          dragStartY.current = null
        }}
      >
        <span className="queue-drag-handle" />
      </div>
      <div className="queue-panel-header">
        <div>
          <span className="caption">Playback</span>
          <h2>Queue</h2>
        </div>
        <IconButton label="Close queue" onClick={dismiss}>
          <X size={18} />
        </IconButton>
      </div>

      <div className="queue-panel-scroll">
        {track ? (
          <>
            <section className="queue-group" aria-labelledby="now-playing-heading">
              <div className="queue-section-heading">
                <h3 id="now-playing-heading">Now playing</h3>
              </div>
              <QueueItem track={track} current onRemove={() => remove(currentIndex)} />
            </section>

            <section className="queue-group" aria-labelledby="next-up-heading">
              <div className="queue-section-heading">
                <h3 id="next-up-heading">Next up</h3>
                {upcomingIndices.length > 0 && (
                  <motion.button className="queue-clear-button" type="button" onClick={clearUpcoming} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Trash2 size={14} /> Clear queue
                  </motion.button>
                )}
              </div>
              {upcomingIndices.length > 0 ? (
                <div className="queue-list">
                  {upcomingIndices.map((index) => {
                    const item = queue[index]
                    return (
                      <QueueItem
                        key={item.queueItemId ?? `${index}-${item.id}`}
                        track={item}
                        onPlay={() => playIndex(index)}
                        onPlayNext={() => moveToNext(index)}
                        onRemove={() => remove(index)}
                      />
                    )
                  })}
                </div>
              ) : (
                <p className="queue-empty-copy">There are no more songs in the queue.</p>
              )}
            </section>
          </>
        ) : (
          <div className="queue-empty-state">
            <ListMusic size={32} />
            <h3>Your queue is empty</h3>
            <p>Choose a song on Home to start listening.</p>
          </div>
        )}
      </div>
      </aside>
    </>
  )
}
