import { Heart, Library, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { DetailTrackList } from '@/components/shared/DetailTrackList'
import { Button } from '@/components/ui/Button'
import { ArtistCard } from '@/features/artists/components/ArtistCard'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useLikedSongs } from '@/features/favorites/hooks/useLikedSongs'
import { useFollowedArtists } from '@/features/library/hooks/useFollowedArtists'
import { useRecentlyPlayed } from '@/features/history/hooks/useRecentlyPlayed'
import { PlaylistCard } from '@/features/playlists/components/PlaylistCard'
import { PlaylistFormDialog } from '@/features/playlists/components/PlaylistFormDialog'
import { usePlaylists } from '@/features/playlists/hooks/usePlaylists'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const libraryTypes = ['all', 'playlists', 'liked', 'artists'] as const
type LibraryType = (typeof libraryTypes)[number]

const typeLabels: Record<LibraryType, string> = {
  all: 'All',
  playlists: 'Playlist',
  liked: 'Liked songs',
  artists: 'Artists',
}

export function LibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [createOpen, setCreateOpen] = useState(false)
  const currentUser = useCurrentUser()
  const playlists = usePlaylists()
  const likedSongs = useLikedSongs()
  const followedArtists = useFollowedArtists()
  const recentlyPlayed = useRecentlyPlayed()
  const requestedType = searchParams.get('type')
  const type: LibraryType = libraryTypes.includes(requestedType as LibraryType)
    ? (requestedType as LibraryType)
    : 'all'
  const sort = searchParams.get('sort') === 'az' ? 'az' : 'default'
  useDocumentTitle('Your library')

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
          <span className="caption section-kicker">Personal collection</span>
          <h1>Your library</h1>
          <p>Playlists, liked songs, and followed artists.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={17} /> Create playlist
        </Button>
      </header>

      <div className="library-toolbar">
        <div className="library-tabs" role="tablist" aria-label="Content type">
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
          <span>Sort</span>
          <select value={sort} onChange={(event) => setParam('sort', event.target.value)}>
            <option value="default">Default</option>
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
                title="No playlists yet"
                message="Create your first playlist to organize your music."
                action={<Button onClick={() => setCreateOpen(true)}>Create playlist</Button>}
              />
            )}
          </section>
        )}

        {(type === 'all' || type === 'liked') && (
          <section className="section library-section" aria-labelledby="library-liked">
            <div className="section-heading">
              <div className="section-title-wrap">
                <span className="caption section-kicker">02</span>
                <h2 id="library-liked">Liked songs</h2>
              </div>
              {type === 'all' && songs.length > 0 && <Link to="/liked-songs">View all</Link>}
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
                title="No liked songs yet"
                message="Press the heart icon on a song to save it here."
                action={
                  <Link className="button primary" to="/search">
                    Explore
                  </Link>
                }
              />
            )}
          </section>
        )}

        {type === 'all' && (
          <section className="section library-section" aria-labelledby="library-recent">
            <div className="section-heading">
              <div className="section-title-wrap">
                <span className="caption section-kicker">04</span>
                <h2 id="library-recent">Recently played</h2>
              </div>
            </div>
            {recentlyPlayed.isLoading ? (
              <LibraryLoading />
            ) : recentlyPlayed.isError ? (
              <LibraryError onRetry={() => void recentlyPlayed.refetch()} />
            ) : recentlyPlayed.data?.length ? (
              <ul className="detail-track-list">
                {recentlyPlayed.data.slice(0, 5).map((item) => (
                  <li key={`${item.songId}-${item.playedAt}`}>
                    <Link to={`/song/${item.songId}`}>{item.songName}</Link>
                    <span>{item.artistName ?? 'Unknown artist'}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <LibraryEmpty
                icon={<Library size={28} />}
                title="No listening history yet"
                message="Songs you play will appear here."
              />
            )}
          </section>
        )}
        {(type === 'all' || type === 'artists') && (
          <section className="section library-section" aria-labelledby="library-artists">
            <div className="section-heading">
              <div className="section-title-wrap">
                <span className="caption section-kicker">03</span>
                <h2 id="library-artists">Followed artists</h2>
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
                title="No followed artists yet"
                message="Follow artists to find them faster."
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
      Loading…
    </div>
  )
}

function LibraryError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="library-empty" role="alert">
      <h3>Unable to load your library</h3>
      <p>Check your connection to NOCTURNE and try again.</p>
      <Button variant="secondary" onClick={onRetry}>
        Try again
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
