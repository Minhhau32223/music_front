import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { workspaceApi } from './api'
import { contentQuery, profileQuery, useWorkspaceMutation } from './queries'
import { WorkspaceError, WorkspaceState } from './components'
import { statusLabel } from './types'
import type { ArtistContent, ContentInput, ContentKind } from './types'

function ContentEditor({
  kind,
  item,
  albums,
  onClose,
}: {
  kind: ContentKind
  item?: ArtistContent
  albums: ArtistContent[]
  onClose: () => void
}) {
  const save = useWorkspaceMutation(
    (input: ContentInput) => workspaceApi.save(kind, input, item?.id),
    'artist',
  )
  const [validation, setValidation] = useState('')
  return (
    <Modal
      open
      title={`${item ? 'Edit' : 'Create'} ${kind === 'songs' ? 'song' : 'album'}`}
      onClose={() => !save.isPending && onClose()}
    >
      <form
        className="modal-form"
        onSubmit={(event) => {
          event.preventDefault()
          const values = new FormData(event.currentTarget)
          const image = values.get('image') as File
          const file = values.get('file') as File | null
          if (
            (image?.size && !image.type.startsWith('image/')) ||
            (file?.size && !file.type.startsWith('audio/'))
          ) {
            setValidation('Choose valid image and audio formats.')
            return
          }
          setValidation('')
          save.mutate(
            {
              name: String(values.get('name')),
              lyrics: String(values.get('lyrics') ?? ''),
              albumId: kind === 'songs' ? Number(values.get('albumId')) : undefined,
              description: String(values.get('description') ?? ''),
              bgColor: String(values.get('bgColor') ?? ''),
              image: image?.size ? image : undefined,
              file: file?.size ? file : undefined,
            },
            { onSuccess: onClose },
          )
        }}
      >
        <Input name="name" label="Name" defaultValue={item?.name} required pattern=".*\S.*" />
        <Input name="image" type="file" accept="image/*" label="Artwork" required={!item} />
        {kind === 'songs' ? (
          <>
            <Input name="file" type="file" accept="audio/*" label="Audio" required={!item} />
            <label className="field">
              Lyrics
              <textarea name="lyrics" required defaultValue={item?.lyrics ?? ''} />
            </label>
            <label className="field">
              Album
              <select name="albumId" required defaultValue={item?.albumId ?? ''}>
                <option value="" disabled>
                  Choose your album
                </option>
                {albums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.name}
                  </option>
                ))}
              </select>
            </label>
          </>
        ) : (
          <>
            {item && (
              <p>
                The API does not return the album description and color. Re-enter both fields to
                confirm replacement content.
              </p>
            )}
            <Input name="description" label="Description" required pattern=".*\S.*" />
            <Input
              name="bgColor"
              label="Background color"
              required
              placeholder="#16131f"
              pattern=".*\S.*"
            />
          </>
        )}
        {validation && <p role="alert">{validation}</p>}
        <WorkspaceError error={save.error} />
        <Button type="submit" loading={save.isPending}>
          Save
        </Button>
      </form>
    </Modal>
  )
}

function ContentList({ kind }: { kind: ContentKind }) {
  const query = useQuery(contentQuery(kind))
  const albums = useQuery(contentQuery('albums'))
  const [editor, setEditor] = useState<ArtistContent | 'new' | null>(null)
  const [removing, setRemoving] = useState<ArtistContent | null>(null)
  const submit = useWorkspaceMutation((id: number) => workspaceApi.submit(kind, id), 'artist')
  const remove = useWorkspaceMutation((id: number) => workspaceApi.remove(kind, id), 'artist')
  return (
    <section>
      <div className="section-heading">
        <h2>{kind === 'songs' ? 'Songs' : 'Albums'}</h2>
        <Button onClick={() => setEditor('new')}>Create new</Button>
      </div>
      <WorkspaceState
        pending={query.isPending}
        error={query.error}
        retry={() => void query.refetch()}
      />
      <WorkspaceError error={submit.error} />
      {query.isSuccess && !query.data.length && <p>No content yet.</p>}
      <ul className="workspace-list">
        {query.data?.map((item) => (
          <li key={item.id}>
            <h3>{item.name}</h3>
            <p>{statusLabel[item.status]}</p>
            {item.rejectionReason && <p>{item.rejectionReason}</p>}
            <div className="modal-actions">
              {['DRAFT', 'REJECTED', 'PUBLISHED'].includes(item.status) && (
                <Button variant="secondary" onClick={() => setEditor(item)}>
                  Edit
                </Button>
              )}
              {['DRAFT', 'REJECTED'].includes(item.status) && (
                <>
                  <Button disabled={submit.isPending} onClick={() => submit.mutate(item.id)}>
                    Submit for review
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      remove.reset()
                      setRemoving(item)
                    }}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      {editor && (
        <ContentEditor
          kind={kind}
          item={editor === 'new' ? undefined : editor}
          albums={albums.data ?? []}
          onClose={() => setEditor(null)}
        />
      )}
      <Modal
        open={Boolean(removing)}
        title="Delete draft?"
        onClose={() => !remove.isPending && setRemoving(null)}
      >
        <p>{removing?.name}. This action cannot be undone.</p>
        <WorkspaceError error={remove.error} />
        <Button
          variant="danger"
          loading={remove.isPending}
          onClick={() =>
            removing && remove.mutate(removing.id, { onSuccess: () => setRemoving(null) })
          }
        >
          Confirm delete
        </Button>
      </Modal>
    </section>
  )
}
export function ArtistWorkspace() {
  const profile = useQuery(profileQuery())
  const save = useWorkspaceMutation(workspaceApi.updateProfile, 'artist')
  return (
    <div className="page workspace-page">
      <h1>Artist studio</h1>
      <WorkspaceState
        pending={profile.isPending}
        error={profile.error}
        retry={() => void profile.refetch()}
      />
      {profile.data && (
        <form
          key={profile.data.id}
          className="modal-form workspace-form"
          onSubmit={(event) => {
            event.preventDefault()
            const values = new FormData(event.currentTarget)
            save.mutate({
              name: String(values.get('name')).trim(),
              bio: String(values.get('bio')).trim(),
              profileImage: String(values.get('profileImage')).trim(),
            })
          }}
        >
          <Input
            name="name"
            label="Artist name"
            defaultValue={profile.data.name}
            required
            pattern=".*\S.*"
          />
          <Input name="bio" label="Bio" defaultValue={profile.data.bio} required pattern=".*\S.*" />
          <Input
            name="profileImage"
            label="Profile image URL"
            type="url"
            defaultValue={profile.data.profileImage}
            required
          />
          <WorkspaceError error={save.error} />
          <Button type="submit" loading={save.isPending}>
            Save profile
          </Button>
          {save.isSuccess && <p role="status">Profile saved.</p>}
        </form>
      )}
      {profile.isSuccess && (
        <>
          <ContentList kind="albums" />
          <ContentList kind="songs" />
        </>
      )}
    </div>
  )
}
