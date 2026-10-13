import { ListMusic, Trash2, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCallback, useEffect } from 'react'
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
  const panelRef = usePlayerPanelFocus(open, close)

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
      <div className="queue-panel-header">
        <div>
          <span className="caption">Playback</span>
          <h2>Queue</h2>
        </div>
        <IconButton label="Close queue" onClick={() => setOpen(false)}>
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
  )
}
