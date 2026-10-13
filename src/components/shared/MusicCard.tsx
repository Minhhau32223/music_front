import { Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { MusicItem } from '@/types/music'
import { Artwork } from './Artwork'
import { Badge } from '@/components/ui/Badge'
import { motion } from 'framer-motion'

type MusicCardProps = MusicItem & { onPlay?: () => void }

export function MusicCard({
  image,
  title,
  subtitle,
  shape = 'album',
  badge,
  onPlay,
}: MusicCardProps) {
  const detailPath =
    title === 'After Hours'
      ? '/album/after-hours'
      : title === 'The Weeknd'
        ? '/artist/the-weeknd'
        : undefined
  return (
    <motion.article 
      className={shape === 'artist' ? 'music-card artist-card' : 'music-card'}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Artwork src={image} alt={title} shape={shape}>
        {badge && (
          <Badge accent className="artwork-badge">
            {badge}
          </Badge>
        )}
        {shape !== 'artist' && (
          <motion.button 
            type="button" 
            className="card-play" 
            aria-label={`Play ${title}`} 
            onClick={onPlay}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Play size={19} fill="currentColor" />
          </motion.button>
        )}
      </Artwork>
      {detailPath ? (
        <Link className="card-title" title={title} to={detailPath}>
          {title}
        </Link>
      ) : (
        <div className="card-title" title={title}>
          {title}
        </div>
      )}
      <div className="card-subtitle">{subtitle}</div>
    </motion.article>
  )
}
