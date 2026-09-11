import { LoaderCircle, Pause, Play } from 'lucide-react'
import { Artwork } from '@/components/shared/Artwork'
import type { PlayableTrack } from '../types/song.types'
import { formatDuration } from '@/lib/format/duration'
import type { Song } from '../types/song.types'
import { Link } from 'react-router-dom'

type PopularSongListProps = {
  songs: Song[]
  currentTrack: PlayableTrack | null
  playbackStatus: 'idle' | 'loading' | 'playing' | 'paused' | 'buffering' | 'error'
  onPlay: (index: number) => void
}

export function PopularSongList({
  songs,
  currentTrack,
  playbackStatus,
  onPlay,
}: PopularSongListProps) {
  return (
    <div className="popular-song-list" role="list">
      {songs.map((song, index) => {
        const active = currentTrack?.id === song.id && currentTrack.audioUrl === song.audioUrl
        const playing = active && playbackStatus === 'playing'
        const loading = active && (playbackStatus === 'loading' || playbackStatus === 'buffering')
        return (
          <article
            className={`popular-song-row${active ? ' active-track' : ''}`}
            role="listitem"
            key={song.id}
          >
            <button
              className="popular-play-button"
              type="button"
              aria-label={playing || loading ? `Tạm dừng ${song.title}` : `Phát ${song.title}`}
              onClick={() => onPlay(index)}
            >
              <span className="popular-rank">{String(index + 1).padStart(2, '0')}</span>
              {loading ? (
                <LoaderCircle className="popular-play-icon player-spinner" size={15} />
              ) : playing ? (
                <Pause className="popular-play-icon" size={15} fill="currentColor" />
              ) : (
                <Play className="popular-play-icon" size={15} fill="currentColor" />
              )}
            </button>
            <div className="popular-art">
              <Artwork
                src={song.artworkUrl ?? song.album?.artworkUrl}
                alt={`${song.title} artwork`}
              />
            </div>
            <div className="popular-copy">
              <strong title={song.title}>
                <Link to={`/song/${song.id}`}>{song.title}</Link>
              </strong>
              <Link to={`/artist/${song.artist.id}`}>{song.artist.name}</Link>
            </div>
            <span className="popular-album">
              {song.album ? (
                <Link to={`/album/${song.album.id}`}>{song.album.title}</Link>
              ) : (
                'Single'
              )}
            </span>
            <span className="popular-duration">{formatDuration(song.durationMs)}</span>
          </article>
        )
      })}
    </div>
  )
}

export function SongListSkeleton() {
  return (
    <div className="popular-song-list" aria-label="Loading songs">
      {Array.from({ length: 5 }, (_, index) => (
        <div className="popular-song-row" key={index}>
          <div className="skeleton skeleton-line" />
          <div className="skeleton popular-art" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line short" />
        </div>
      ))}
    </div>
  )
}
