import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useDeletePlaylist } from '../hooks/usePlaylistMutations'
import type { PlaylistSummary } from '../types/playlist.types'

type DeletePlaylistDialogProps = {
  open: boolean
  playlist: PlaylistSummary
  onClose: () => void
  onDeleted: () => void
}

export function DeletePlaylistDialog({
  open,
  playlist,
  onClose,
  onDeleted,
}: DeletePlaylistDialogProps) {
  const remove = useDeletePlaylist()
  const confirm = async () => {
    try {
      await remove.mutateAsync(playlist.id)
      onDeleted()
    } catch {
      // The mutation hook restores cache state and reports the failure.
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => !remove.isPending && onClose()}
      title="Xóa playlist?"
      description={`“${playlist.name}” sẽ bị xóa khỏi thư viện. Hàng đợi đang phát không bị thay đổi.`}
    >
      <div className="modal-actions">
        <Button variant="ghost" disabled={remove.isPending} onClick={onClose}>
          Hủy
        </Button>
        <Button variant="danger" loading={remove.isPending} onClick={() => void confirm()}>
          Xóa playlist
        </Button>
      </div>
    </Modal>
  )
}
