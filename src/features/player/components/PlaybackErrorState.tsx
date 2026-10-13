import { AlertCircle, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import { usePlayerStore } from '../store/player.store'

export function PlaybackErrorState() {
  const error = usePlayerStore((state) => state.error)
  const retry = usePlayerStore((state) => state.retry)
  if (!error) return null
  return (
    <div className="playback-error" role="alert">
      <AlertCircle size={15} />
      <span>{error.message}</span>
      <motion.button type="button" onClick={retry} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <RotateCcw size={13} /> Try again
      </motion.button>
    </div>
  )
}
