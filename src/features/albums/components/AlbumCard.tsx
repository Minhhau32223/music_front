import { Link } from 'react-router-dom'
import { Artwork } from '@/components/shared/Artwork'
import type { AlbumSummary } from '../types/album.types'
import { queryClient } from '@/lib/query-client'
import { albumDetailQuery, albumTracksQuery } from '../queries/album.queries'
import { useIntentPrefetch } from '@/hooks/useIntentPrefetch'

export function AlbumCard({ album }: { album: AlbumSummary }) {
  const intent = useIntentPrefetch(() => {
    void queryClient.prefetchQuery(albumDetailQuery(album.id))
    void queryClient.prefetchQuery(albumTracksQuery(album.id))
  })
  return (
    <article
      className="music-card"
      onPointerEnter={(event) => event.pointerType !== 'touch' && intent.schedule()}
      onPointerLeave={intent.cancel}
      onFocus={intent.schedule}
      onBlur={intent.cancel}
    >
      <Link className="card-art-link" to={`/album/${album.id}`} aria-label={album.title}>
        <Artwork src={album.artworkUrl} alt={`${album.title} album cover`} />
      </Link>
      <Link className="card-title" to={`/album/${album.id}`} title={album.title}>
        {album.title}
      </Link>
      <div className="card-subtitle">{album.artistName || 'Album'}</div>
    </article>
  )
}
