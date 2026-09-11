import { Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { MusicItem } from '@/types/music'
import { Artwork } from './Artwork'
import { Badge } from '@/components/ui/Badge'

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
    <article className={shape === 'artist' ? 'music-card artist-card' : 'music-card'}>
      <Artwork src={image} alt={title} shape={shape}>
        {badge && (
          <Badge accent className="artwork-badge">
            {badge}
          </Badge>
        )}
        {shape !== 'artist' && (
          <button type="button" className="card-play" aria-label={`Phát ${title}`} onClick={onPlay}>
            <Play size={19} fill="currentColor" />
          </button>
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
    </article>
  )
}
