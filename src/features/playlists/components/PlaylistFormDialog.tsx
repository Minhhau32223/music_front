import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useCreatePlaylist, useRenamePlaylist } from '../hooks/usePlaylistMutations'
import { playlistSchema, type PlaylistSchemaValues } from '../schemas/playlist.schema'
import type { PlaylistSummary } from '../types/playlist.types'

type PlaylistFormDialogProps = {
  open: boolean
  onClose: () => void
  playlist?: PlaylistSummary
}

export function PlaylistFormDialog({ open, onClose, playlist }: PlaylistFormDialogProps) {
  const createPlaylist = useCreatePlaylist()
  const renamePlaylist = useRenamePlaylist(playlist?.id ?? 0)
  const mutation = playlist ? renamePlaylist : createPlaylist
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlaylistSchemaValues>({
    resolver: zodResolver(playlistSchema),
    defaultValues: { name: playlist?.name ?? '' },
  })

  useEffect(() => {
    if (open) reset({ name: playlist?.name ?? '' })
  }, [open, playlist?.name, reset])

  const submit = handleSubmit(async ({ name }) => {
    try {
      if (playlist) await renamePlaylist.mutateAsync(name)
      else await createPlaylist.mutateAsync({ name })
      onClose()
    } catch {
      // Mutation hooks surface a toast and keep the form open for correction or retry.
    }
  })

  return (
    <Modal
      open={open}
      onClose={() => !mutation.isPending && onClose()}
      title={playlist ? 'Rename playlist' : 'Create playlist'}
      description="Your playlist name will appear in your library."
    >
      <form className="modal-form" onSubmit={submit}>
        <Input
          label="Playlist name"
          autoComplete="off"
          maxLength={255}
          error={errors.name?.message}
          {...register('name')}
        />
        <div className="modal-actions">
          <Button variant="ghost" disabled={mutation.isPending} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={mutation.isPending}>
            {playlist ? 'Save' : 'Create playlist'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
