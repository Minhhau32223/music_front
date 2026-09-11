import { Artwork } from '@/components/shared/Artwork'
import type { PlayableTrack } from '@/features/songs/types/song.types'
import { Link } from 'react-router-dom'

export function TrackInfo({ track }: { track: PlayableTrack | null }) {
  return (
    <div className="player-track-info">
      <div className="player-track-art">
        <Artwork src={track?.artworkUrl} alt={track ? `${track.title} artwork` : ''} />
      </div>
      <div className="player-track-copy">
        {track ? (
          <>
            <strong title={track.title}>
              <Link to={`/song/${track.id}`}>{track.title}</Link>
            </strong>
            <span title={track.artistName}>
              <Link to={`/artist/${track.artistId}`}>{track.artistName}</Link>
              {track.albumId && track.albumTitle ? (
                <>
                  {' · '}
                  <Link to={`/album/${track.albumId}`}>{track.albumTitle}</Link>
                </>
              ) : null}
            </span>
          </>
        ) : (
          <>
            <strong>Chọn một bài hát</strong>
            <span>NOCTURNE</span>
          </>
        )}
      </div>
    </div>
  )
}
