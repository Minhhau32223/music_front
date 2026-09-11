import { ListMusic, Trash2, X } from 'lucide-react'
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

  const upcomingIndices = shuffleEnabled
    ? shuffleOrder.slice(shufflePosition + 1)
    : queue.map((_, index) => index).slice(currentIndex + 1)

  return (
    <aside
      className="player-queue-panel"
      data-open={open}
      aria-label="Hàng đợi phát nhạc"
      aria-hidden={!open}
    >
      <div className="queue-panel-header">
        <div>
          <span className="caption">Playback</span>
          <h2>Hàng đợi</h2>
        </div>
        <IconButton label="Đóng hàng đợi" onClick={() => setOpen(false)}>
          <X size={18} />
        </IconButton>
      </div>

      <div className="queue-panel-scroll">
        {track ? (
          <>
            <section className="queue-group" aria-labelledby="now-playing-heading">
              <div className="queue-section-heading">
                <h3 id="now-playing-heading">Đang phát</h3>
              </div>
              <QueueItem track={track} current onRemove={() => remove(currentIndex)} />
            </section>

            <section className="queue-group" aria-labelledby="next-up-heading">
              <div className="queue-section-heading">
                <h3 id="next-up-heading">Tiếp theo</h3>
                {upcomingIndices.length > 0 && (
                  <button className="queue-clear-button" type="button" onClick={clearUpcoming}>
                    <Trash2 size={14} /> Xóa danh sách chờ
                  </button>
                )}
              </div>
              {upcomingIndices.length > 0 ? (
                <div className="queue-list">
                  {upcomingIndices.map((index) => {
                    const item = queue[index]
                    return (
                      <QueueItem
                        key={`${index}-${item.id}-${item.audioUrl}`}
                        track={item}
                        onPlay={() => playIndex(index)}
                        onPlayNext={() => moveToNext(index)}
                        onRemove={() => remove(index)}
                      />
                    )
                  })}
                </div>
              ) : (
                <p className="queue-empty-copy">Không còn bài hát nào trong hàng đợi.</p>
              )}
            </section>
          </>
        ) : (
          <div className="queue-empty-state">
            <ListMusic size={32} />
            <h3>Hàng đợi đang trống</h3>
            <p>Chọn một bài hát trên Home để bắt đầu nghe.</p>
          </div>
        )}
      </div>
    </aside>
  )
}
