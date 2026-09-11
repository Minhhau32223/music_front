import { Play } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
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
import { useAlbumDetail, useAlbumTracks } from '@/features/albums/hooks/useAlbumDetail'
import { usePlayer } from '@/features/player'
import { toPlayableTrack } from '@/features/songs/types/song.types'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { isApiError } from '@/lib/api/api-error'
import { formatDuration } from '@/lib/format/duration'
import { parseEntityId } from '@/lib/route-params'

export function AlbumDetailPage() {
  const albumId = parseEntityId(useParams().albumId)
  const album = useAlbumDetail(albumId)
  const tracks = useAlbumTracks(albumId)
  const { playQueue } = usePlayer()
  const playableTracks = useMemo(() => tracks.data?.map(toPlayableTrack) ?? [], [tracks.data])
  const artist = tracks.data?.[0]?.artist
  const totalDuration = tracks.data?.reduce((total, song) => total + song.durationMs, 0) ?? 0
  useDocumentTitle(album.data?.title ?? 'Album')

  if (
    albumId === null ||
    (album.isError && isApiError(album.error) && album.error.status === 404)
  ) {
    return <DetailNotFoundState entity="album" />
  }
  if (album.isLoading) return <DetailPageSkeleton />
  if (album.isError || !album.data) {
    return <DetailErrorState error={album.error} onRetry={() => void album.refetch()} />
  }

  return (
    <div className="page detail-page">
      <DynamicBackdrop
        artworkUrl={album.data.artworkUrl}
        fallbackColor={album.data.backgroundColor}
        className="album-detail-hero"
      >
        <div className="detail-cover">
          <Artwork
            src={album.data.artworkUrl}
            alt={`Bìa album ${album.data.title}`}
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div className="detail-hero-copy">
          <span className="caption detail-eyebrow">Album</span>
          <h1>{album.data.title}</h1>
          <p className="detail-meta">
            {artist && <Link to={`/artist/${artist.id}`}>{artist.name}</Link>}
            {artist && tracks.data?.length ? <span aria-hidden="true"> · </span> : null}
            {tracks.data?.length ? <span>{tracks.data.length} bài hát</span> : null}
            {totalDuration > 0 ? (
              <>
                <span aria-hidden="true"> · </span>
                <span>{formatDuration(totalDuration)}</span>
              </>
            ) : null}
          </p>
          <div className="hero-actions">
            <Button
              size="lg"
              disabled={!playableTracks.length}
              onClick={() => playQueue(playableTracks, 0)}
            >
              <Play size={17} fill="currentColor" /> Phát
            </Button>
          </div>
        </div>
      </DynamicBackdrop>

      <section className="section detail-section" aria-labelledby="album-tracks-heading">
        <div className="section-heading">
          <div className="section-title-wrap">
            <span className="caption section-kicker">01 // Danh sách phát</span>
            <h2 id="album-tracks-heading">Bài hát</h2>
          </div>
        </div>
        <DetailSectionState
          loading={tracks.isLoading}
          error={tracks.isError}
          empty={!tracks.data?.length}
          emptyMessage="Album này chưa có bài hát."
          onRetry={() => void tracks.refetch()}
        />
        {tracks.data?.length ? <DetailTrackList songs={tracks.data} context="album" /> : null}
      </section>

      {album.data.description && (
        <section className="section detail-section" aria-labelledby="album-about-heading">
          <div className="section-heading">
            <div className="section-title-wrap">
              <span className="caption section-kicker">02 // Thông tin</span>
              <h2 id="album-about-heading">Giới thiệu album</h2>
            </div>
          </div>
          <div className="detail-description-card">
            <p>{album.data.description}</p>
          </div>
        </section>
      )}
    </div>
  )
}
