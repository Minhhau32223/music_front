import { Modal } from '@/components/ui/Modal'
import { motion } from 'framer-motion'
import { useSongDetail } from '@/features/songs/hooks/useSongDetail'
import { useLyricsStore } from '../store/lyrics.store'
import { selectCurrentTrack, usePlayerStore } from '../store/player.store'
export function LyricsPanel() {
  const target = useLyricsStore((state) => state.target)
  const close = useLyricsStore((state) => state.close)
  const track = usePlayerStore(selectCurrentTrack)
  const id = target === 'current' ? (track?.id ?? null) : target
  const song = useSongDetail(id)
  return (
    <Modal
      open={target !== null}
      title={song.data?.title ?? 'Lyrics'}
      description={song.data?.artist.name}
      onClose={close}
    >
      <div className="lyrics-content" aria-live="polite">
        {id === null ? (
          <p>Select a song to view its lyrics.</p>
        ) : song.isLoading ? (
          <div role="status" aria-label="Loading lyrics">
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line" />
          </div>
        ) : song.isError ? (
          <div role="alert">
            <p>Unable to load lyrics.</p>
            <motion.button type="button" onClick={() => void song.refetch()} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Try again
            </motion.button>
          </div>
        ) : song.data?.lyrics?.trim() ? (
          <p className="lyrics-text">{song.data.lyrics}</p>
        ) : (
          <p>This song has no lyrics yet.</p>
        )}
      </div>
    </Modal>
  )
}
