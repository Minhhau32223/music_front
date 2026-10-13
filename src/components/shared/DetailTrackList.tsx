import { AudioLines, LoaderCircle, Pause, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { selectCurrentTrack, usePlayer, usePlayerStore } from '@/features/player'
import { formatDuration } from '@/lib/format/duration'
import type { Song } from '@/features/songs/types/song.types'
import { toPlayableTrack } from '@/features/songs/types/song.types'
import { Artwork } from './Artwork'
import { SongContextMenu } from './SongContextMenu'
import { LikeButton } from '@/features/favorites/components/LikeButton'
import { motion, AnimatePresence } from 'framer-motion'

type DetailTrackListProps = {
  songs: Song[]
  context: 'artist' | 'album' | 'playlist' | 'liked-songs' | 'search'
  playlistContext?: {
    canEdit: boolean
    onRemoveSong: (songId: number) => void
    removingSongId?: number
  }
}

const formatPlayCount = (value: number) => new Intl.NumberFormat('vi-VN').format(value)

export function DetailTrackList({ songs, context, playlistContext }: DetailTrackListProps) {
  const { playQueue } = usePlayer()
  const currentTrack = usePlayerStore(selectCurrentTrack)
  const playbackStatus = usePlayerStore((state) => state.playbackStatus)
  const queue = songs.map(toPlayableTrack)
  const playAt = (index: number) => playQueue(queue, index)

  return (
    <div className={`detail-track-list ${context}-tracks`} role="list">
      <div className="detail-track-head" aria-hidden="true">
        <span>#</span>
        <span>Title</span>
        <span>{context === 'album' ? 'Plays' : 'Album'}</span>
        <span>Duration</span>
        <span />
      </div>
      <AnimatePresence>
      {songs.map((song, index) => {
        const active = currentTrack?.id === song.id && currentTrack.playbackUrl === song.audioUrl
        const playing = active && playbackStatus === 'playing'
        const busy = active && (playbackStatus === 'loading' || playbackStatus === 'buffering')
        return (
          <motion.article
            data-song-surface
            className={`detail-track-row${active ? ' active-track' : ''}`}
            role="listitem"
            aria-current={active ? 'true' : undefined}
            key={song.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, delay: index * 0.02 }}
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <button
              className="detail-track-play"
              type="button"
              aria-label={playing || busy ? `Pause ${song.title}` : `Play ${song.title}`}
              onClick={() => playAt(index)}
            >
              <span className="detail-track-index">{index + 1}</span>
              {busy ? (
                <LoaderCircle className="detail-track-play-icon player-spinner" size={16} />
              ) : playing ? (
                <AudioLines className="detail-track-play-icon playing-bars" size={16} />
              ) : active ? (
                <Pause className="detail-track-play-icon" size={16} fill="currentColor" />
              ) : (
                <Play className="detail-track-play-icon" size={16} fill="currentColor" />
              )}
            </button>
            <div className="detail-track-title-cell">
              <div className="detail-track-art">
                <Artwork
                  src={song.artworkUrl ?? song.album?.artworkUrl}
                  alt={`${song.title} artwork`}
                  size="xs"
                />
              </div>
              <div>
                <Link className="detail-track-title" to={`/song/${song.id}`} title={song.title}>
                  {song.title}
                </Link>
                <Link className="detail-track-artist" to={`/artist/${song.artist.id}`}>
                  {song.artist.name}
                </Link>
              </div>
            </div>
            <div className="detail-track-context">
              {context !== 'album' ? (
                song.album ? (
                  <Link to={`/album/${song.album.id}`}>{song.album.title}</Link>
                ) : (
                  <span>Single</span>
                )
              ) : (
                <span>{formatPlayCount(song.playCount)}</span>
              )}
            </div>
            <span className="detail-track-duration">{formatDuration(song.durationMs)}</span>
            <div className="detail-track-actions">
              <LikeButton song={song} />
              <SongContextMenu
                context={context}
                song={song}
                onPlayNow={() => playAt(index)}
                playlistContext={
                  playlistContext
                    ? {
                        canEdit: playlistContext.canEdit,
                        removing: playlistContext.removingSongId === song.id,
                        onRemove: () => playlistContext.onRemoveSong(song.id),
                      }
                    : undefined
                }
              />
            </div>
          </motion.article>
        )
      })}
      </AnimatePresence>
    </div>
  )
}
