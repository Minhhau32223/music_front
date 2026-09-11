import { LoaderCircle, Pause, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Artwork } from '@/components/shared/Artwork'
import type { Song } from '../types/song.types'
import { queryClient } from '@/lib/query-client'
import { songDetailQuery } from '../queries/song.queries'
import { useIntentPrefetch } from '@/hooks/useIntentPrefetch'

type SongCardProps = {
  song: Song
  active?: boolean
  playing?: boolean
  loading?: boolean
  onPlay: () => void
}

export function SongCard({ song, active, playing, loading, onPlay }: SongCardProps) {
  const intent = useIntentPrefetch(() => {
    void queryClient.prefetchQuery(songDetailQuery(song.id))
  })
  return (
    <article
      className={`music-card${active ? ' active-track' : ''}`}
      onPointerEnter={(event) => event.pointerType !== 'touch' && intent.schedule()}
      onPointerLeave={intent.cancel}
      onFocus={intent.schedule}
      onBlur={intent.cancel}
    >
      <Artwork src={song.artworkUrl ?? song.album?.artworkUrl} alt={`${song.title} artwork`}>
        <button
          type="button"
          className={`card-play${active ? ' active' : ''}`}
          aria-label={playing || loading ? `Tạm dừng ${song.title}` : `Phát ${song.title}`}
          onClick={onPlay}
        >
          {loading ? (
            <LoaderCircle className="player-spinner" size={19} />
          ) : playing ? (
            <Pause size={19} fill="currentColor" />
          ) : (
            <Play size={19} fill="currentColor" />
          )}
        </button>
      </Artwork>
      <Link className="card-title" to={`/song/${song.id}`} title={song.title}>
        {song.title}
      </Link>
      <Link className="card-subtitle" to={`/artist/${song.artist.id}`}>
        {song.artist.name}
      </Link>
    </article>
  )
}
