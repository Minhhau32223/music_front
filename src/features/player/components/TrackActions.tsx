import { SongContextMenu } from '@/components/shared/SongContextMenu'
import type { PlayableTrack, Song } from '@/features/songs/types/song.types'
import { usePlayerStore } from '../store/player.store'
export function TrackActions({
  track,
  context = 'player',
  onPlay,
  onPlayNext,
}: {
  track: PlayableTrack
  context?: 'player' | 'queue'
  onPlay?: () => void
  onPlayNext?: () => void
}) {
  const song: Song = {
    id: track.id,
    title: track.title,
    artist: { id: track.artistId, name: track.artistName },
    album: track.albumId ? { id: track.albumId, title: track.albumTitle ?? 'Album' } : undefined,
    artworkUrl: track.artworkUrl,
    audioUrl: track.playbackUrl,
    durationMs: track.durationMs,
    playCount: 0,
  }
  return (
    <SongContextMenu
      song={song}
      context={context}
      onPlayNow={onPlay ?? (() => usePlayerStore.getState().resume())}
      onPlayNext={onPlayNext}
    />
  )
}
