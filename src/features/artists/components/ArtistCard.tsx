import { Link } from 'react-router-dom'
import { Artwork } from '@/components/shared/Artwork'
import type { ArtistSummary } from '../types/artist.types'
import { queryClient } from '@/lib/query-client'
import { artistDetailQuery, artistTracksQuery } from '../queries/artist.queries'
import { useIntentPrefetch } from '@/hooks/useIntentPrefetch'

export function ArtistCard({ artist }: { artist: ArtistSummary }) {
  const intent = useIntentPrefetch(() => {
    void queryClient.prefetchQuery(artistDetailQuery(artist.id))
    void queryClient.prefetchQuery(artistTracksQuery(artist.id))
  })
  return (
    <article
      className="music-card artist-card"
      onPointerEnter={(event) => event.pointerType !== 'touch' && intent.schedule()}
      onPointerLeave={intent.cancel}
      onFocus={intent.schedule}
      onBlur={intent.cancel}
    >
      <Link className="card-art-link" to={`/artist/${artist.id}`} aria-label={artist.name}>
        <Artwork src={artist.imageUrl} alt={`${artist.name} portrait`} shape="artist" />
      </Link>
      <Link className="card-title" to={`/artist/${artist.id}`} title={artist.name}>
        {artist.name}
      </Link>
      <div className="card-subtitle">Artist</div>
    </article>
  )
}
