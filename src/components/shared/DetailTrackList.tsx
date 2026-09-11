import { AudioLines, LoaderCircle, Pause, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { selectCurrentTrack, usePlayer, usePlayerStore } from '@/features/player'
import { formatDuration } from '@/lib/format/duration'
import type { Song } from '@/features/songs/types/song.types'
import { toPlayableTrack } from '@/features/songs/types/song.types'
import { Artwork } from './Artwork'
import { SongContextMenu } from './SongContextMenu'
import { LikeButton } from '@/features/favorites/components/LikeButton'

type DetailTrackListProps = {
  songs: Song[]
  context: 'artist' | 'album' | 'playlist' | 'liked-songs'
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
        <span>Tiêu đề</span>
        <span>{context === 'album' ? 'Lượt nghe' : 'Album'}</span>
        <span>Thời lượng</span>
        <span />
      </div>
      {songs.map((song, index) => {
        const active = currentTrack?.id === song.id && currentTrack.audioUrl === song.audioUrl
        const playing = active && playbackStatus === 'playing'
        const busy = active && (playbackStatus === 'loading' || playbackStatus === 'buffering')
        return (
          <article
            className={`detail-track-row${active ? ' active-track' : ''}`}
            role="listitem"
            aria-current={active ? 'true' : undefined}
            key={song.id}
          >
            <button
              className="detail-track-play"
              type="button"
              aria-label={playing || busy ? `Tạm dừng ${song.title}` : `Phát ${song.title}`}
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
          </article>
        )
      })}
    </div>
  )
}
