import { SlidersHorizontal } from 'lucide-react'
import { useMemo } from 'react'
import { AlbumCard } from '@/features/albums/components/AlbumCard'
import { useNewReleases } from '@/features/albums/hooks/useNewReleases'
import { ArtistCard } from '@/features/artists/components/ArtistCard'
import { useArtists } from '@/features/artists/hooks/useArtists'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { CardGridSkeleton, CatalogSection } from '@/features/catalog/components/CatalogSection'
import { PopularSongList, SongListSkeleton } from '@/features/songs/components/PopularSongList'
import { SongCard } from '@/features/songs/components/SongCard'
import { useLatestSongs } from '@/features/songs/hooks/useLatestSongs'
import { usePopularSongs } from '@/features/songs/hooks/usePopularSongs'
import { selectCurrentTrack, usePlayerStore } from '@/features/player'
import { toPlayableTrack } from '@/features/songs/types/song.types'

export function HomePage() {
  const user = useCurrentUser()
  const latest = useLatestSongs(6)
  const releases = useNewReleases(6)
  const artists = useArtists()
  const popular = usePopularSongs(8)
  const currentTrack = usePlayerStore(selectCurrentTrack)
  const playbackStatus = usePlayerStore((state) => state.playbackStatus)
  const playQueue = usePlayerStore((state) => state.playQueue)
  const latestTracks = useMemo(
    () => latest.data?.items.map(toPlayableTrack) ?? [],
    [latest.data?.items],
  )
  const popularTracks = useMemo(() => popular.data?.map(toPlayableTrack) ?? [], [popular.data])
  return (
    <div className="page">
      <div className="home-intro">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            <span className="caption">Acoustic session active&nbsp; / &nbsp;01:42 AM JST</span>
          </div>
          <h1 className="home-title">
            Good evening,
            <br />
            {user.data?.username ?? 'Listener'}
          </h1>
        </div>
        <div className="dynamic-card">
          <div>
            <span className="caption muted">Dynamic flow</span>
            <p>94.2 Hz · Low Velocity</p>
          </div>
          <div className="equalizer" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <SlidersHorizontal size={17} color="var(--text-muted)" />
        </div>
      </div>
      <CatalogSection
        index="01"
        kicker="Recently added"
        title="Latest songs"
        loading={latest.isLoading}
        error={latest.isError}
        empty={!latest.data?.items.length}
        emptyMessage="No songs have been added yet."
        onRetry={() => latest.refetch()}
        skeleton={<CardGridSkeleton />}
      >
        <div className="card-grid">
          {latest.data?.items.map((song, index) => {
            const active = currentTrack?.id === song.id && currentTrack.audioUrl === song.audioUrl
            return (
              <SongCard
                song={song}
                key={song.id}
                active={active}
                playing={active && playbackStatus === 'playing'}
                loading={active && (playbackStatus === 'loading' || playbackStatus === 'buffering')}
                onPlay={() => playQueue(latestTracks, index)}
              />
            )
          })}
        </div>
      </CatalogSection>
      <CatalogSection
        index="02"
        kicker="Fresh pressings"
        title="New releases"
        loading={releases.isLoading}
        error={releases.isError}
        empty={!releases.data?.length}
        emptyMessage="No new releases yet."
        onRetry={() => releases.refetch()}
        skeleton={<CardGridSkeleton />}
      >
        <div className="card-grid">
          {releases.data?.map((album) => (
            <AlbumCard album={album} key={album.id} />
          ))}
        </div>
      </CatalogSection>
      <CatalogSection
        index="03"
        kicker="Catalog"
        title="Artists"
        loading={artists.isLoading}
        error={artists.isError}
        empty={!artists.data?.length}
        emptyMessage="No artists yet."
        onRetry={() => artists.refetch()}
        skeleton={<CardGridSkeleton round />}
      >
        <div className="card-grid">
          {artists.data?.slice(0, 6).map((artist) => (
            <ArtistCard artist={artist} key={artist.id} />
          ))}
        </div>
      </CatalogSection>
      <CatalogSection
        index="04"
        kicker="Most played"
        title="Popular songs"
        loading={popular.isLoading}
        error={popular.isError}
        empty={!popular.data?.length}
        emptyMessage="No listening data yet."
        onRetry={() => popular.refetch()}
        skeleton={<SongListSkeleton />}
      >
        <PopularSongList
          songs={popular.data ?? []}
          currentTrack={currentTrack}
          playbackStatus={playbackStatus}
          onPlay={(index) => playQueue(popularTracks, index)}
        />
      </CatalogSection>
    </div>
  )
}
