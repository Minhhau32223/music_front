import { Pencil, Play, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Artwork } from '@/components/shared/Artwork'
import { DetailTrackList } from '@/components/shared/DetailTrackList'
import {
  DetailErrorState,
  DetailNotFoundState,
  DetailPageSkeleton,
  DetailSectionState,
  DetailTrackListSkeleton,
} from '@/components/shared/DetailStates'
import { DynamicBackdrop } from '@/components/shared/DynamicBackdrop'
import { Button } from '@/components/ui/Button'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { usePlayer } from '@/features/player'
import { DeletePlaylistDialog } from '@/features/playlists/components/DeletePlaylistDialog'
import { PlaylistFormDialog } from '@/features/playlists/components/PlaylistFormDialog'
import { useRemoveSongFromPlaylist } from '@/features/playlists/hooks/usePlaylistMutations'
import { usePlaylistDetail, usePlaylistTracks } from '@/features/playlists/hooks/usePlaylists'
import { canEditPlaylist } from '@/features/playlists/types/playlist.types'
import { toPlayableTrack } from '@/features/songs/types/song.types'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { isApiError } from '@/lib/api/api-error'
import { parseEntityId } from '@/lib/route-params'
import { motion } from 'framer-motion'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export function PlaylistPage() {
  const playlistId = parseEntityId(useParams().playlistId)
  const playlist = usePlaylistDetail(playlistId)
  const tracks = usePlaylistTracks(playlistId)
  const currentUser = useCurrentUser()
  const removeSong = useRemoveSongFromPlaylist(playlistId ?? 0)
  const { playQueue } = usePlayer()
  const navigate = useNavigate()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const songs = useMemo(() => tracks.data?.map((item) => item.song) ?? [], [tracks.data])
  useDocumentTitle(playlist.data?.name ?? 'Playlist')

  if (
    playlistId === null ||
    (playlist.isError && isApiError(playlist.error) && playlist.error.status === 404)
  ) {
    return <DetailNotFoundState entity="playlist" />
  }
  if (playlist.isLoading || currentUser.isLoading) return <DetailPageSkeleton />
  if (playlist.isError || !playlist.data || currentUser.isError) {
    return <DetailErrorState error={playlist.error} onRetry={() => void playlist.refetch()} />
  }

  const editable = canEditPlaylist(playlist.data, currentUser.data?.id)

  return (
    <motion.div className="page detail-page playlist-detail-page" variants={pageVariants} initial="initial" animate="animate">
      <DynamicBackdrop artworkUrl={playlist.data.artworkUrl} className="detail-hero playlist-hero">
        <div className="detail-cover">
          <Artwork
            src={playlist.data.artworkUrl}
            alt={`${playlist.data.name} playlist artwork`}
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div className="detail-hero-copy">
          <span className="caption detail-eyebrow">Playlist</span>
          <h1>{playlist.data.name}</h1>
          <p className="detail-meta">{songs.length} songs</p>
          <div className="hero-actions">
            <Button
              size="lg"
              disabled={!songs.length}
              onClick={() => playQueue(songs.map(toPlayableTrack), 0)}
            >
              <Play size={17} fill="currentColor" /> Play
            </Button>
            {editable && (
              <>
                <Button variant="secondary" size="lg" onClick={() => setEditOpen(true)}>
                  <Pencil size={17} /> Rename
                </Button>
                <Button variant="ghost" size="lg" onClick={() => setDeleteOpen(true)}>
                  <Trash2 size={17} /> Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </DynamicBackdrop>

      <section className="section detail-section" aria-labelledby="playlist-tracks-heading">
        <div className="section-heading">
          <div className="section-title-wrap">
            <span className="caption section-kicker">01 // Tracklist</span>
            <h2 id="playlist-tracks-heading">Songs</h2>
          </div>
        </div>
        {tracks.isLoading ? (
          <DetailTrackListSkeleton />
        ) : (
          <>
            <DetailSectionState
              loading={false}
              error={tracks.isError}
              empty={!songs.length}
              emptyMessage={
                editable
                  ? 'This playlist is empty. Use a song menu to add tracks here.'
                  : 'This playlist has no songs yet.'
              }
              onRetry={() => void tracks.refetch()}
            />
            {songs.length ? (
              <DetailTrackList
                songs={songs}
                context="playlist"
                playlistContext={{
                  canEdit: editable,
                  removingSongId: removeSong.variables,
                  onRemoveSong: (songId) => removeSong.mutate(songId),
                }}
              />
            ) : null}
          </>
        )}
      </section>

      <PlaylistFormDialog
        open={editOpen}
        playlist={playlist.data}
        onClose={() => setEditOpen(false)}
      />
      <DeletePlaylistDialog
        open={deleteOpen}
        playlist={playlist.data}
        onClose={() => setDeleteOpen(false)}
        onDeleted={() => navigate('/library?type=playlists', { replace: true })}
      />
    </motion.div>
  )
}
