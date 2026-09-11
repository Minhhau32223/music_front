import { ListEnd, ListMusic, ListPlus, MoreHorizontal, Play, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { LikeButton } from '@/features/favorites/components/LikeButton'
import { AddToPlaylistDialog } from '@/features/playlists/components/AddToPlaylistDialog'
import type { Song } from '@/features/songs/types/song.types'
import { toPlayableTrack } from '@/features/songs/types/song.types'
import { usePlayer } from '@/features/player'

type SongContextMenuProps = {
  song: Song
  onPlayNow: () => void
  playlistContext?: {
    canEdit: boolean
    onRemove: () => void
    removing?: boolean
  }
}

export function SongContextMenu({ song, onPlayNow, playlistContext }: SongContextMenuProps) {
  const details = useRef<HTMLDetailsElement>(null)
  const [playlistPickerOpen, setPlaylistPickerOpen] = useState(false)
  const { playNext, addToQueue } = usePlayer()
  const track = toPlayableTrack(song)
  const run = (action: () => void) => {
    details.current?.removeAttribute('open')
    action()
  }

  return (
    <>
      <details
        ref={details}
        className="song-context-menu"
        onClick={(event) => event.stopPropagation()}
      >
        <summary aria-label={`Tùy chọn cho ${song.title}`}>
          <MoreHorizontal size={18} />
        </summary>
        <div className="song-context-popover" aria-label={`Tác vụ cho ${song.title}`}>
          <button type="button" onClick={() => run(onPlayNow)}>
            <Play size={15} /> Phát ngay
          </button>
          <button type="button" onClick={() => run(() => playNext(track))}>
            <ListEnd size={15} /> Phát tiếp theo
          </button>
          <button type="button" onClick={() => run(() => addToQueue(track))}>
            <ListPlus size={15} /> Thêm vào hàng đợi
          </button>
          <LikeButton
            song={song}
            showLabel
            onToggled={() => details.current?.removeAttribute('open')}
          />
          <button
            type="button"
            onClick={() =>
              run(() => {
                setPlaylistPickerOpen(true)
              })
            }
          >
            <ListMusic size={15} /> Thêm vào playlist
          </button>
          {playlistContext?.canEdit && (
            <button
              type="button"
              className="danger-menu-item"
              disabled={playlistContext.removing}
              onClick={() => run(playlistContext.onRemove)}
            >
              <Trash2 size={15} /> Xóa khỏi playlist
            </button>
          )}
          <span className="song-context-separator" />
          <Link
            to={`/artist/${song.artist.id}`}
            onClick={() => details.current?.removeAttribute('open')}
          >
            Đi tới nghệ sĩ
          </Link>
          {song.album && (
            <Link
              to={`/album/${song.album.id}`}
              onClick={() => details.current?.removeAttribute('open')}
            >
              Đi tới album
            </Link>
          )}
        </div>
      </details>
      <AddToPlaylistDialog
        open={playlistPickerOpen}
        song={song}
        onClose={() => setPlaylistPickerOpen(false)}
      />
    </>
  )
}
