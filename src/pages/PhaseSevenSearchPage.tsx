import { Clock3, Search, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DetailTrackList } from '@/components/shared/DetailTrackList'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { SearchInput } from '@/components/ui/SearchInput'
import { ArtistCard } from '@/features/artists/components/ArtistCard'
import type { ArtistSummary } from '@/features/artists/types/artist.types'
import { AlbumCard } from '@/features/albums/components/AlbumCard'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { CardGridSkeleton, CatalogSection } from '@/features/catalog/components/CatalogSection'
import { FollowButton } from '@/features/library/components/FollowButton'
import { selectCurrentTrack, usePlayerStore } from '@/features/player'
import {
  MIN_SEARCH_LENGTH,
  normalizeSearchQuery,
  useDebouncedValue,
  useRecentSearches,
  useSearch,
} from '@/features/search'
import { SongCard } from '@/features/songs/components/SongCard'
import { useNewReleaseSongs } from '@/features/songs/hooks/useNewReleaseSongs'
import { usePersonalizedSongs } from '@/features/songs/hooks/usePersonalizedSongs'
import { usePopularSongs } from '@/features/songs/hooks/usePopularSongs'
import type { Song } from '@/features/songs/types/song.types'
import { toPlayableTrack } from '@/features/songs/types/song.types'
import { isApiError } from '@/lib/api/api-error'

const SEARCH_DELAY_MS = 350

type DiscoverySongSectionProps = {
  index: string
  kicker: string
  title: string
  songs?: Song[]
  loading: boolean
  error: boolean
  emptyMessage: string
  onRetry: () => void
}

function DiscoverySongSection(props: DiscoverySongSectionProps) {
  const currentTrack = usePlayerStore(selectCurrentTrack)
  const playbackStatus = usePlayerStore((state) => state.playbackStatus)
  const playQueue = usePlayerStore((state) => state.playQueue)
  const tracks = useMemo(() => props.songs?.map(toPlayableTrack) ?? [], [props.songs])

  return (
    <CatalogSection
      index={props.index}
      kicker={props.kicker}
      title={props.title}
      loading={props.loading}
      error={props.error}
      empty={!props.songs?.length}
      emptyMessage={props.emptyMessage}
      onRetry={props.onRetry}
      skeleton={<CardGridSkeleton />}
    >
      <div className="card-grid">
        {props.songs?.map((song, index) => {
          const active = currentTrack?.id === song.id && currentTrack.playbackUrl === song.audioUrl
          return (
            <SongCard
              key={song.id}
              song={song}
              active={active}
              playing={active && playbackStatus === 'playing'}
              loading={active && (playbackStatus === 'loading' || playbackStatus === 'buffering')}
              onPlay={() => playQueue(tracks, index)}
            />
          )
        })}
      </div>
    </CatalogSection>
  )
}

function SearchArtistCard({ artist }: { artist: ArtistSummary }) {
  return (
    <div className="search-artist-card">
      <ArtistCard artist={artist} />
      <FollowButton artist={artist} />
    </div>
  )
}

function SearchPageContent({
  initialQuery,
  discover = false,
}: {
  initialQuery: string
  discover?: boolean
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlQuery = initialQuery
  const [draft, setDraft] = useState(urlQuery)
  const debouncedDraft = useDebouncedValue(draft, SEARCH_DELAY_MS)
  const normalizedDraft = normalizeSearchQuery(debouncedDraft)
  const normalizedUrlQuery = normalizeSearchQuery(urlQuery)
  const isDiscovery = normalizedUrlQuery.length === 0
  const search = useSearch(normalizedUrlQuery)
  const {
    items: recentItems,
    add: addRecent,
    remove: removeRecent,
    clear: clearRecent,
  } = useRecentSearches()
  const currentUser = useCurrentUser()
  const topSongs = usePopularSongs(6, isDiscovery)
  const newReleases = useNewReleaseSongs(6, isDiscovery)
  const personalized = usePersonalizedSongs(currentUser.data?.id, 6, isDiscovery)
  const hasValidQuery = normalizedUrlQuery.length >= MIN_SEARCH_LENGTH

  useEffect(() => {
    if (normalizedDraft === normalizedUrlQuery) return
    const next = new URLSearchParams(searchParams)
    if (normalizedDraft) next.set('q', normalizedDraft)
    else next.delete('q')
    setSearchParams(next, { replace: true })
  }, [normalizedDraft, normalizedUrlQuery, searchParams, setSearchParams])

  useEffect(() => {
    if (hasValidQuery && search.isSuccess) addRecent(normalizedUrlQuery)
  }, [addRecent, hasValidQuery, normalizedUrlQuery, search.isSuccess])

  const applyQuery = (value: string) => {
    const normalized = normalizeSearchQuery(value)
    setDraft(normalized)
    const next = new URLSearchParams(searchParams)
    if (normalized) next.set('q', normalized)
    else next.delete('q')
    setSearchParams(next, { replace: true })
  }

  const clearQuery = () => applyQuery('')
  const result = search.data
  const errorMessage = isApiError(search.error)
    ? search.error.message
    : 'Search is unavailable right now. Please try again.'

  return (
    <div className="page search-page phase-seven-search">
      <header className="search-header">
        <h1>{discover ? 'Discover' : 'Search NOCTURNE'}</h1>
        {!discover && (
          <>
            <SearchInput
              value={draft}
              autoFocus
              loading={
                hasValidQuery && (search.isFetching || normalizedDraft !== normalizedUrlQuery)
              }
              aria-label="Search songs, artists, or albums"
              placeholder="Songs, artists, or albums"
              autoComplete="off"
              onChange={(event) => setDraft(event.target.value)}
              onClear={clearQuery}
              onKeyDown={(event) => {
                if (event.key === 'Escape') clearQuery()
              }}
            />
            {draft.trim().length === 1 && (
              <p className="search-help secondary">
                Enter at least {MIN_SEARCH_LENGTH - 1} more characters to search.
              </p>
            )}
          </>
        )}
      </header>

      {!normalizedUrlQuery ? (
        <div className="search-discovery">
          {!discover && recentItems.length > 0 && (
            <section className="section recent-searches" aria-labelledby="recent-searches-title">
              <div className="section-heading">
                <div className="section-title-wrap">
                  <h2 id="recent-searches-title">Recent searches</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={clearRecent}>
                  <Trash2 size={15} /> Clear all
                </Button>
              </div>
              <div className="recent-search-list">
                {recentItems.map((item) => (
                  <div className="recent-search-item" key={item}>
                    <button type="button" onClick={() => applyQuery(item)}>
                      <Clock3 size={16} />
                      <span>{item}</span>
                    </button>
                    <IconButton
                      label={`Remove ${item} from recent searches`}
                      tooltip={false}
                      onClick={() => removeRecent(item)}
                    >
                      <X size={15} />
                    </IconButton>
                  </div>
                ))}
              </div>
            </section>
          )}
          <DiscoverySongSection
            index="01"
            kicker="Most played"
            title="Top songs"
            songs={topSongs.data}
            loading={topSongs.isLoading}
            error={topSongs.isError}
            emptyMessage="No listening data yet."
            onRetry={() => void topSongs.refetch()}
          />
          <DiscoverySongSection
            index="02"
            kicker="Fresh pressings"
            title="New releases"
            songs={newReleases.data}
            loading={newReleases.isLoading}
            error={newReleases.isError}
            emptyMessage="No new releases yet."
            onRetry={() => void newReleases.refetch()}
          />
          {Boolean(currentUser.data?.id) && (
            <DiscoverySongSection
              index="03"
              kicker="For your session"
              title="Made for you"
              songs={personalized.data}
              loading={personalized.isLoading || currentUser.isLoading}
              error={personalized.isError || currentUser.isError}
              emptyMessage="Play a few songs to shape your recommendations."
              onRetry={() => void personalized.refetch()}
            />
          )}
        </div>
      ) : !hasValidQuery ? (
        <div className="search-message" role="status">
          <Search size={28} />
          <h2>Keep typing</h2>
          <p>Search starts at {MIN_SEARCH_LENGTH} characters.</p>
        </div>
      ) : search.isLoading ? (
        <div className="search-results-loading" aria-label="Searching" role="status">
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-search-block" />
          <div className="skeleton skeleton-search-block" />
        </div>
      ) : search.isError ? (
        <div className="search-message" role="alert">
          <h2>Couldn't complete this search</h2>
          <p>{errorMessage}</p>
          <Button variant="secondary" onClick={() => void search.refetch()}>
            Try again
          </Button>
        </div>
      ) : result?.totalCount === 0 ? (
        <div className="search-message" role="status">
          <Search size={28} />
          <h2>No results for “{normalizedUrlQuery}”</h2>
          <p>Try another song, artist, or album name.</p>
        </div>
      ) : (
        <div className="search-results">
          <p className="caption search-result-count" aria-live="polite">
            {result?.totalCount ?? 0} results for “{normalizedUrlQuery}”
          </p>
          {Boolean(result?.songs.length) && (
            <section className="section" aria-labelledby="search-songs-title">
              <div className="section-heading">
                <div className="section-title-wrap">
                  <h2 id="search-songs-title">Songs</h2>
                </div>
              </div>
              <DetailTrackList songs={result?.songs ?? []} context="search" />
            </section>
          )}
          {Boolean(result?.artists.length) && (
            <section className="section" aria-labelledby="search-artists-title">
              <div className="section-heading">
                <div className="section-title-wrap">
                  <h2 id="search-artists-title">Artists</h2>
                </div>
              </div>
              <div className="card-grid">
                {result?.artists.map((artist) => (
                  <SearchArtistCard artist={artist} key={artist.id} />
                ))}
              </div>
            </section>
          )}
          {Boolean(result?.albums.length) && (
            <section className="section" aria-labelledby="search-albums-title">
              <div className="section-heading">
                <div className="section-title-wrap">
                  <h2 id="search-albums-title">Albums</h2>
                </div>
              </div>
              <div className="card-grid">
                {result?.albums.map((album) => (
                  <AlbumCard album={album} key={album.id} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  return <SearchPageContent key={query} initialQuery={query} />
}

export function DiscoverPage() {
  return <SearchPageContent initialQuery="" discover />
}
