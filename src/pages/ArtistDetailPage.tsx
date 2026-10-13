import { Play } from 'lucide-react'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Artwork } from '@/components/shared/Artwork'
import { DetailTrackList } from '@/components/shared/DetailTrackList'
import {
  DetailErrorState,
  DetailNotFoundState,
  DetailPageSkeleton,
  DetailSectionState,
} from '@/components/shared/DetailStates'
import { DynamicBackdrop } from '@/components/shared/DynamicBackdrop'
import { Button } from '@/components/ui/Button'
import { AlbumCard } from '@/features/albums/components/AlbumCard'
import {
  useArtistDetail,
  useArtistReleases,
  useArtistTracks,
} from '@/features/artists/hooks/useArtistDetail'
import { usePlayer } from '@/features/player'
import { FollowButton } from '@/features/library/components/FollowButton'
import { toPlayableTrack } from '@/features/songs/types/song.types'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { isApiError } from '@/lib/api/api-error'
import { parseEntityId } from '@/lib/route-params'

export function ArtistDetailPage() {
  const artistId = parseEntityId(useParams().artistId)
  const artist = useArtistDetail(artistId)
  const tracks = useArtistTracks(artistId)
  const releases = useArtistReleases(artistId)
  const { playQueue } = usePlayer()
  const playableTracks = useMemo(() => tracks.data?.map(toPlayableTrack) ?? [], [tracks.data])
  useDocumentTitle(artist.data?.name ?? 'Artist')

  if (
    artistId === null ||
    (artist.isError && isApiError(artist.error) && artist.error.status === 404)
  ) {
    return <DetailNotFoundState entity="artist" />
  }
  if (artist.isLoading) return <DetailPageSkeleton />
  if (artist.isError || !artist.data) {
    return <DetailErrorState error={artist.error} onRetry={() => void artist.refetch()} />
  }

  return (
    <div className="page detail-page">
      <DynamicBackdrop artworkUrl={artist.data.imageUrl} className="artist-detail-hero">
        {artist.data.imageUrl && (
          <img
            className="artist-detail-background"
            src={artist.data.imageUrl}
            alt=""
            aria-hidden="true"
            loading="eager"
            fetchPriority="high"
          />
        )}
        <div className="artist-detail-portrait">
          <Artwork
            src={artist.data.imageUrl}
            alt={`${artist.data.name} portrait`}
            shape="artist"
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div className="detail-hero-copy">
          <span className="caption detail-eyebrow">Artist</span>
          <h1>{artist.data.name}</h1>
          <div className="hero-actions">
            <Button
              size="lg"
              disabled={!playableTracks.length}
              onClick={() => playQueue(playableTracks, 0)}
            >
              <Play size={17} fill="currentColor" /> Play
            </Button>
            <FollowButton artist={artist.data} />
          </div>
        </div>
      </DynamicBackdrop>

      <section className="section detail-section" aria-labelledby="artist-popular-heading">
        <div className="section-heading">
          <div className="section-title-wrap">
            <span className="caption section-kicker">01 // Most played</span>
            <h2 id="artist-popular-heading">Popular</h2>
          </div>
        </div>
        <DetailSectionState
          loading={tracks.isLoading}
          error={tracks.isError}
          empty={!tracks.data?.length}
          emptyMessage="This artist has no songs yet."
          onRetry={() => void tracks.refetch()}
        />
        {tracks.data?.length ? <DetailTrackList songs={tracks.data} context="artist" /> : null}
      </section>

      <section className="section detail-section" aria-labelledby="artist-releases-heading">
        <div className="section-heading">
          <div className="section-title-wrap">
            <span className="caption section-kicker">02 // Releases</span>
            <h2 id="artist-releases-heading">Albums from uploaded songs</h2>
          </div>
        </div>
        <DetailSectionState
          loading={releases.isLoading}
          error={releases.isError}
          empty={!releases.data?.length}
          emptyMessage="No albums found in uploaded songs."
          onRetry={() => void releases.refetch()}
        />
        {releases.data?.length ? (
          <div className="card-grid detail-release-grid">
            {releases.data.map((album) => (
              <AlbumCard album={album} key={album.id} />
            ))}
          </div>
        ) : null}
      </section>

      {artist.data.bio && (
        <section className="section detail-section" aria-labelledby="artist-about-heading">
          <div className="section-heading">
            <div className="section-title-wrap">
              <span className="caption section-kicker">03 // Profile</span>
              <h2 id="artist-about-heading">About</h2>
            </div>
          </div>
          <div className="detail-description-card">
            <p>{artist.data.bio}</p>
          </div>
        </section>
      )}
    </div>
  )
}
