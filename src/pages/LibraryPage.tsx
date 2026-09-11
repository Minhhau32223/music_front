import { Heart, Library, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { DetailTrackList } from '@/components/shared/DetailTrackList'
import { Button } from '@/components/ui/Button'
import { ArtistCard } from '@/features/artists/components/ArtistCard'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useLikedSongs } from '@/features/favorites/hooks/useLikedSongs'
import { useFollowedArtists } from '@/features/library/hooks/useFollowedArtists'
import { PlaylistCard } from '@/features/playlists/components/PlaylistCard'
import { PlaylistFormDialog } from '@/features/playlists/components/PlaylistFormDialog'
import { usePlaylists } from '@/features/playlists/hooks/usePlaylists'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const libraryTypes = ['all', 'playlists', 'liked', 'artists'] as const
type LibraryType = (typeof libraryTypes)[number]

const typeLabels: Record<LibraryType, string> = {
  all: 'Tất cả',
  playlists: 'Playlist',
  liked: 'Bài hát đã thích',
  artists: 'Nghệ sĩ',
}

export function LibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [createOpen, setCreateOpen] = useState(false)
  const currentUser = useCurrentUser()
  const playlists = usePlaylists()
  const likedSongs = useLikedSongs()
  const followedArtists = useFollowedArtists()
  const requestedType = searchParams.get('type')
  const type: LibraryType = libraryTypes.includes(requestedType as LibraryType)
    ? (requestedType as LibraryType)
    : 'all'
  const sort = searchParams.get('sort') === 'az' ? 'az' : 'default'
  useDocumentTitle('Thư viện')

  const ownPlaylists = useMemo(() => {
    const items =
      playlists.data?.filter((playlist) => playlist.ownerId === currentUser.data?.id) ?? []
    return sort === 'az' ? [...items].sort((a, b) => a.name.localeCompare(b.name, 'vi')) : items
  }, [currentUser.data?.id, playlists.data, sort])
  const songs = useMemo(
    () =>
      sort === 'az'
        ? [...(likedSongs.data ?? [])].sort((a, b) => a.title.localeCompare(b.title, 'vi'))
        : (likedSongs.data ?? []),
    [likedSongs.data, sort],
  )
  const artists = useMemo(
    () =>
      sort === 'az'
        ? [...(followedArtists.data ?? [])].sort((a, b) => a.name.localeCompare(b.name, 'vi'))
        : (followedArtists.data ?? []),
    [followedArtists.data, sort],
  )

  const setParam = (key: 'type' | 'sort', value: string) => {
    const next = new URLSearchParams(searchParams)
    if ((key === 'type' && value === 'all') || (key === 'sort' && value === 'default')) {
      next.delete(key)
    } else next.set(key, value)
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="page library-page">
      <header className="library-header">
        <div>
          <span className="caption section-kicker">Bộ sưu tập cá nhân</span>
          <h1>Thư viện của bạn</h1>
          <p>Playlist, bài hát yêu thích và nghệ sĩ bạn đang theo dõi.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={17} /> Tạo playlist
        </Button>
      </header>

      <div className="library-toolbar">
        <div className="library-tabs" role="tablist" aria-label="Loại nội dung">
          {libraryTypes.map((item) => (
            <button
              type="button"
              role="tab"
              aria-selected={type === item}
              className={type === item ? 'active' : undefined}
              onClick={() => setParam('type', item)}
              key={item}
            >
              {typeLabels[item]}
            </button>
          ))}
        </div>
        <label className="library-sort">
          <span>Sắp xếp</span>
          <select value={sort} onChange={(event) => setParam('sort', event.target.value)}>
            <option value="default">Mặc định</option>
            <option value="az">A–Z</option>
          </select>
        </label>
      </div>

      <>
        {(type === 'all' || type === 'playlists') && (
          <section className="section library-section" aria-labelledby="library-playlists">
            <div className="section-heading">
              <div className="section-title-wrap">
                <span className="caption section-kicker">01</span>
                <h2 id="library-playlists">Playlist</h2>
              </div>
            </div>
            {currentUser.isLoading || playlists.isLoading ? (
              <LibraryLoading />
            ) : currentUser.isError || playlists.isError ? (
              <LibraryError
                onRetry={() => {
                  void currentUser.refetch()
                  void playlists.refetch()
                }}
              />
            ) : ownPlaylists.length ? (
              <div className="card-grid">
                {ownPlaylists.map((playlist) => (
                  <PlaylistCard playlist={playlist} key={playlist.id} />
                ))}
              </div>
            ) : (
              <LibraryEmpty
                icon={<Library size={28} />}
                title="Chưa có playlist"
                message="Tạo playlist đầu tiên để bắt đầu sắp xếp âm nhạc."
                action={<Button onClick={() => setCreateOpen(true)}>Tạo playlist</Button>}
              />
            )}
          </section>
        )}

        {(type === 'all' || type === 'liked') && (
          <section className="section library-section" aria-labelledby="library-liked">
            <div className="section-heading">
              <div className="section-title-wrap">
                <span className="caption section-kicker">02</span>
                <h2 id="library-liked">Bài hát đã thích</h2>
              </div>
              {type === 'all' && songs.length > 0 && <Link to="/liked-songs">Xem tất cả</Link>}
            </div>
            {likedSongs.isLoading ? (
              <LibraryLoading />
            ) : likedSongs.isError ? (
              <LibraryError onRetry={() => void likedSongs.refetch()} />
            ) : songs.length ? (
              <DetailTrackList
                songs={type === 'all' ? songs.slice(0, 5) : songs}
                context="liked-songs"
              />
            ) : (
              <LibraryEmpty
                icon={<Heart size={28} />}
                title="Chưa có bài hát yêu thích"
                message="Nhấn biểu tượng trái tim ở một bài hát để lưu tại đây."
                action={
                  <Link className="button primary" to="/search">
                    Khám phá
                  </Link>
                }
              />
            )}
          </section>
        )}

        {(type === 'all' || type === 'artists') && (
          <section className="section library-section" aria-labelledby="library-artists">
            <div className="section-heading">
              <div className="section-title-wrap">
                <span className="caption section-kicker">03</span>
                <h2 id="library-artists">Nghệ sĩ đang theo dõi</h2>
              </div>
            </div>
            {followedArtists.isLoading ? (
              <LibraryLoading />
            ) : followedArtists.isError ? (
              <LibraryError onRetry={() => void followedArtists.refetch()} />
            ) : artists.length ? (
              <div className="card-grid">
                {artists.map((artist) => (
                  <ArtistCard artist={artist} key={artist.id} />
                ))}
              </div>
            ) : (
              <LibraryEmpty
                icon={<Library size={28} />}
                title="Chưa theo dõi nghệ sĩ"
                message="Theo dõi nghệ sĩ để tìm lại họ nhanh hơn."
              />
            )}
          </section>
        )}
      </>
      <PlaylistFormDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}

function LibraryLoading() {
  return (
    <div className="library-loading" role="status">
      Đang tải…
    </div>
  )
}

function LibraryError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="library-empty" role="alert">
      <h3>Không thể tải nội dung</h3>
      <p>Kiểm tra kết nối tới NOCTURNE rồi thử lại.</p>
      <Button variant="secondary" onClick={onRetry}>
        Thử lại
      </Button>
    </div>
  )
}

function LibraryEmpty({
  icon,
  title,
  message,
  action,
}: {
  icon: React.ReactNode
  title: string
  message: string
  action?: React.ReactNode
}) {
  return (
    <div className="library-empty">
      {icon}
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  )
}
