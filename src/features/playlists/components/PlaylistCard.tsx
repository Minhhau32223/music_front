import { Link } from 'react-router-dom'
import { Artwork } from '@/components/shared/Artwork'
import type { PlaylistSummary } from '../types/playlist.types'

export function PlaylistCard({ playlist }: { playlist: PlaylistSummary }) {
  return (
    <article className="music-card playlist-card">
      <Link
        className="card-art-link playlist-art-link"
        to={`/playlist/${playlist.id}`}
        aria-label={playlist.name}
      >
        <Artwork src={playlist.artworkUrl} alt={`Ảnh playlist ${playlist.name}`} />
      </Link>
      <Link className="card-title" to={`/playlist/${playlist.id}`} title={playlist.name}>
        {playlist.name}
      </Link>
      <div className="card-subtitle">
        {playlist.trackCount === undefined ? 'Playlist' : `${playlist.trackCount} bài hát`}
      </div>
    </article>
  )
}
