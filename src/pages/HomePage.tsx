import { AlbumCard } from '@/features/albums/components/AlbumCard'
import { useAlbums } from '@/features/albums/hooks/useAlbums'
import { useMemo } from 'react'
import { ArtistCard } from '@/features/artists/components/ArtistCard'
import { useArtists } from '@/features/artists/hooks/useArtists'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { CardGridSkeleton, CatalogSection } from '@/features/catalog/components/CatalogSection'
import { PopularSongList, SongListSkeleton } from '@/features/songs/components/PopularSongList'
import { SongCard } from '@/features/songs/components/SongCard'
import { useLatestSongs } from '@/features/songs/hooks/useLatestSongs'
import { usePopularSongs } from '@/features/songs/hooks/usePopularSongs'
import { useNewReleaseSongs } from '@/features/songs/hooks/useNewReleaseSongs'
import { selectCurrentTrack, usePlayerStore } from '@/features/player'
import { toPlayableTrack } from '@/features/songs/types/song.types'
import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/Skeleton'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, staggerChildren: 0.1 } },
}

const sectionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function HomePage() {
  const user = useCurrentUser()
  const latest = useLatestSongs(6)
  const releases = useNewReleaseSongs(6)
  const artists = useArtists()
  const albums = useAlbums()
  const popular = usePopularSongs(8)
  const currentTrack = usePlayerStore(selectCurrentTrack)
  const playbackStatus = usePlayerStore((state) => state.playbackStatus)
  const playQueue = usePlayerStore((state) => state.playQueue)
  const latestTracks = useMemo(
    () => latest.data?.items.map(toPlayableTrack) ?? [],
    [latest.data?.items],
  )
  const popularTracks = useMemo(() => popular.data?.map(toPlayableTrack) ?? [], [popular.data])
  const releaseTracks = useMemo(() => releases.data?.map(toPlayableTrack) ?? [], [releases.data])
  return (
    <motion.div className="page" variants={pageVariants} initial="initial" animate="animate">
      <motion.div className="home-intro" variants={sectionVariants}>
        <div>
          <h1 className="home-title">
            Welcome,
            <br />
            {user.isLoading ? <Skeleton className="skeleton-line" /> : user.data?.username ?? 'Listener'}
          </h1>
        </div>
      </motion.div>
      <motion.div variants={sectionVariants}>
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
              const active =
                currentTrack?.id === song.id && currentTrack.playbackUrl === song.audioUrl
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
      </motion.div>
      <motion.div variants={sectionVariants}>
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
            {releases.data?.map((song, index) => {
              const active =
                currentTrack?.id === song.id && currentTrack.playbackUrl === song.audioUrl
              return (
                <SongCard
                  song={song}
                  key={song.id}
                  active={active}
                  playing={active && playbackStatus === 'playing'}
                  loading={active && (playbackStatus === 'loading' || playbackStatus === 'buffering')}
                  onPlay={() => playQueue(releaseTracks, index)}
                />
              )
            })}
          </div>
        </CatalogSection>
      </motion.div>
      <motion.div variants={sectionVariants}>
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
            {artists.data?.map((artist) => (
              <ArtistCard artist={artist} key={artist.id} />
            ))}
          </div>
        </CatalogSection>
      </motion.div>
      <motion.div variants={sectionVariants}>
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
      </motion.div>
      <motion.div variants={sectionVariants}>
        <CatalogSection
          index="05"
          kicker="Albums"
          title="Albums"
          loading={albums.isLoading}
          error={albums.isError}
          empty={!albums.data?.length}
          emptyMessage="No albums yet."
          onRetry={() => void albums.refetch()}
          skeleton={<CardGridSkeleton />}
        >
          <div className="card-grid">
            {albums.data?.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </CatalogSection>
      </motion.div>
    </motion.div>
  )
}
