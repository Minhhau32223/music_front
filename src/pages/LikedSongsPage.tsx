import { Heart, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DetailTrackList } from '@/components/shared/DetailTrackList'
import { DetailErrorState, DetailPageSkeleton } from '@/components/shared/DetailStates'
import { Button } from '@/components/ui/Button'
import { useLikedSongs } from '@/features/favorites/hooks/useLikedSongs'
import { usePlayer } from '@/features/player'
import { toPlayableTrack } from '@/features/songs/types/song.types'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function LikedSongsPage() {
  const likedSongs = useLikedSongs()
  const { playQueue } = usePlayer()
  useDocumentTitle('Bài hát đã thích')

  if (likedSongs.isLoading) return <DetailPageSkeleton />
  if (likedSongs.isError) {
    return <DetailErrorState error={likedSongs.error} onRetry={() => void likedSongs.refetch()} />
  }

  const songs = likedSongs.data ?? []
  return (
    <div className="page detail-page liked-songs-page">
      <header className="liked-songs-hero">
        <div className="liked-songs-art" aria-hidden="true">
          <Heart size={72} fill="currentColor" />
        </div>
        <div className="detail-hero-copy">
          <span className="caption detail-eyebrow">Playlist cá nhân</span>
          <h1>Bài hát đã thích</h1>
          <p className="detail-meta">{songs.length} bài hát</p>
          <div className="hero-actions">
            <Button
              size="lg"
              disabled={!songs.length}
              onClick={() => playQueue(songs.map(toPlayableTrack), 0)}
            >
              <Play size={17} fill="currentColor" /> Phát tất cả
            </Button>
          </div>
        </div>
      </header>

      <section className="section detail-section" aria-labelledby="liked-list-heading">
        <h2 id="liked-list-heading" className="sr-only">
          Danh sách bài hát đã thích
        </h2>
        {songs.length ? (
          <DetailTrackList songs={songs} context="liked-songs" />
        ) : (
          <div className="library-empty">
            <Heart size={30} />
            <h3>Danh sách này đang trống</h3>
            <p>Nhấn biểu tượng trái tim ở bài hát bạn muốn lưu.</p>
            <Link className="button primary" to="/search">
              Khám phá âm nhạc
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
