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
      title="Delete playlist?"
      description={`“${playlist.name}” will be removed from your library. The current queue will not change.`}
    >
      <div className="modal-actions">
        <Button variant="ghost" disabled={remove.isPending} onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" loading={remove.isPending} onClick={() => void confirm()}>
          Delete playlist
        </Button>
      </div>
    </Modal>
  )
}
