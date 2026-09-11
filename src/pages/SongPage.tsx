import { ListEnd, ListMusic, ListPlus, Pause, Play } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Artwork } from '@/components/shared/Artwork'
import {
  DetailErrorState,
  DetailNotFoundState,
  DetailPageSkeleton,
} from '@/components/shared/DetailStates'
import { DynamicBackdrop } from '@/components/shared/DynamicBackdrop'
import { Button } from '@/components/ui/Button'
import { LikeButton } from '@/features/favorites/components/LikeButton'
import { selectCurrentTrack, usePlayer, usePlayerStore } from '@/features/player'
import { AddToPlaylistDialog } from '@/features/playlists/components/AddToPlaylistDialog'
import { useSongDetail } from '@/features/songs/hooks/useSongDetail'
import { toPlayableTrack } from '@/features/songs/types/song.types'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { isApiError } from '@/lib/api/api-error'
import { formatDuration } from '@/lib/format/duration'
import { parseEntityId } from '@/lib/route-params'

export function SongPage() {
  const [playlistPickerOpen, setPlaylistPickerOpen] = useState(false)
  const songId = parseEntityId(useParams().songId)
  const song = useSongDetail(songId)
  const currentTrack = usePlayerStore(selectCurrentTrack)
  const status = usePlayerStore((state) => state.playbackStatus)
  const { playTrack, playNext, addToQueue } = usePlayer()
  const active =
    Boolean(song.data) &&
    currentTrack?.id === song.data?.id &&
    currentTrack?.audioUrl === song.data?.audioUrl
  const playing = active && (status === 'playing' || status === 'loading' || status === 'buffering')
  useDocumentTitle(song.data?.title ?? 'Bài hát')

  if (songId === null || (song.isError && isApiError(song.error) && song.error.status === 404)) {
    return <DetailNotFoundState entity="bài hát" />
  }
  if (song.isLoading) return <DetailPageSkeleton />
  if (song.isError || !song.data) {
    return <DetailErrorState error={song.error} onRetry={() => void song.refetch()} />
  }

  const track = toPlayableTrack(song.data)
  return (
    <div className="page detail-page song-detail-page">
      <DynamicBackdrop
        artworkUrl={song.data.artworkUrl ?? song.data.album?.artworkUrl}
        className="song-detail-hero"
      >
        <div className="detail-cover song-detail-cover">
          <Artwork
            src={song.data.artworkUrl ?? song.data.album?.artworkUrl}
            alt={`Ảnh bài hát ${song.data.title}`}
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div className="detail-hero-copy">
          <span className="caption detail-eyebrow">Bài hát</span>
          <h1>{song.data.title}</h1>
          <p className="detail-meta">
            <Link to={`/artist/${song.data.artist.id}`}>{song.data.artist.name}</Link>
            {song.data.album && (
              <>
                <span aria-hidden="true"> · </span>
                <Link to={`/album/${song.data.album.id}`}>{song.data.album.title}</Link>
              </>
            )}
            <span aria-hidden="true"> · </span>
            <span>{formatDuration(song.data.durationMs)}</span>
          </p>
          <div className="hero-actions song-detail-actions">
            <Button size="lg" onClick={() => playTrack(track)}>
              {playing ? (
                <Pause size={17} fill="currentColor" />
              ) : (
                <Play size={17} fill="currentColor" />
              )}
              {playing ? 'Tạm dừng' : 'Phát'}
            </Button>
            <Button variant="secondary" size="lg" onClick={() => playNext(track)}>
              <ListEnd size={17} /> <span>Phát tiếp theo</span>
            </Button>
            <Button variant="ghost" size="lg" onClick={() => addToQueue(track)}>
              <ListPlus size={17} /> <span>Thêm vào hàng đợi</span>
            </Button>
            <LikeButton song={song.data} showLabel className="song-page-like" />
            <Button variant="ghost" size="lg" onClick={() => setPlaylistPickerOpen(true)}>
              <ListMusic size={17} /> <span>Thêm vào playlist</span>
            </Button>
          </div>
        </div>
      </DynamicBackdrop>

      <section className="section detail-section" aria-labelledby="song-info-heading">
        <div className="section-heading">
          <div className="section-title-wrap">
            <span className="caption section-kicker">01 // Metadata</span>
            <h2 id="song-info-heading">Thông tin bài hát</h2>
          </div>
        </div>
        <dl className="song-metadata-grid">
          <div>
            <dt>Nghệ sĩ</dt>
            <dd>
              <Link to={`/artist/${song.data.artist.id}`}>{song.data.artist.name}</Link>
            </dd>
          </div>
          {song.data.album && (
            <div>
              <dt>Album</dt>
              <dd>
                <Link to={`/album/${song.data.album.id}`}>{song.data.album.title}</Link>
              </dd>
            </div>
          )}
          <div>
            <dt>Thời lượng</dt>
            <dd>{formatDuration(song.data.durationMs)}</dd>
          </div>
          <div>
            <dt>Lượt nghe</dt>
            <dd>{new Intl.NumberFormat('vi-VN').format(song.data.playCount)}</dd>
          </div>
        </dl>
      </section>
      <AddToPlaylistDialog
        open={playlistPickerOpen}
        song={song.data}
        onClose={() => setPlaylistPickerOpen(false)}
      />
    </div>
  )
}
