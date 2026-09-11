import { ListMusic } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import type { Song } from '@/features/songs/types/song.types'
import { useAddSongToPlaylist } from '../hooks/usePlaylistMutations'
import { usePlaylists } from '../hooks/usePlaylists'

type AddToPlaylistDialogProps = {
  open: boolean
  song: Song
  onClose: () => void
}

export function AddToPlaylistDialog({ open, song, onClose }: AddToPlaylistDialogProps) {
  const currentUser = useCurrentUser()
  const playlists = usePlaylists()
  const addSong = useAddSongToPlaylist(song)
  const owned =
    playlists.data?.filter((playlist) => playlist.ownerId === currentUser.data?.id) ?? []

  const add = async (playlistId: number) => {
    try {
      await addSong.mutateAsync(playlistId)
      onClose()
    } catch {
      // The mutation hook rolls the optimistic change back and keeps the dialog open.
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => !addSong.isPending && onClose()}
      title="Thêm vào playlist"
      description={song.title}
    >
      {playlists.isLoading || currentUser.isLoading ? (
        <div className="dialog-state" role="status">
          Đang tải playlist…
        </div>
      ) : playlists.isError || currentUser.isError ? (
        <div className="dialog-state error" role="alert">
          Không thể tải playlist của bạn.
        </div>
      ) : owned.length === 0 ? (
        <div className="dialog-empty">
          <ListMusic size={26} />
          <p>Bạn chưa có playlist nào. Hãy tạo playlist trong Thư viện trước.</p>
        </div>
      ) : (
        <div className="playlist-picker" role="list">
          {owned.map((playlist) => (
            <button
              type="button"
              role="listitem"
              key={playlist.id}
              disabled={addSong.isPending}
              onClick={() => void add(playlist.id)}
            >
              <span className="playlist-picker-art">
                {playlist.artworkUrl ? <img src={playlist.artworkUrl} alt="" /> : <ListMusic />}
              </span>
              <span>{playlist.name}</span>
            </button>
          ))}
        </div>
      )}
    </Modal>
  )
}
