import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { workspaceApi } from './api'
import { applicationQuery, useWorkspaceMutation } from './queries'
import { WorkspaceError, WorkspaceState } from './components'
import { statusLabel } from './types'

export function ApplicationPage() {
  const query = useQuery(applicationQuery())
  const user = useCurrentUser()
  const mutation = useWorkspaceMutation(workspaceApi.apply, 'applications')
  const canApply =
    user.data?.role === 'USER' &&
    query.isSuccess &&
    !query.data.some((item) => item.status === 'PENDING')
  return (
    <div className="page">
      <h1>Artist application</h1>
      <WorkspaceState
        pending={query.isPending || user.isPending}
        error={query.error || user.error}
        retry={() => {
          void query.refetch()
          void user.refetch()
        }}
      />
      {canApply && (
        <form
          className="modal-form workspace-form"
          onSubmit={(event) => {
            event.preventDefault()
            const form = event.currentTarget
            const data = new FormData(form)
            mutation.mutate(
              {
                artistName: String(data.get('artistName')),
                bio: String(data.get('bio')),
                profileImage: String(data.get('profileImage')),
              },
              { onSuccess: () => form.reset() },
            )
          }}
        >
          <Input name="artistName" label="Artist name" required pattern=".*\S.*" />
          <Input name="bio" label="Bio" required pattern=".*\S.*" />
          <Input name="profileImage" label="Profile image URL" type="url" required />
          <WorkspaceError error={mutation.error} />
          <Button type="submit" loading={mutation.isPending}>
            Submit application
          </Button>
        </form>
      )}
      {mutation.isSuccess && <p role="status">Application submitted.</p>}
      <h2>Your applications</h2>
      {query.isSuccess && !query.data.length && <p>No applications yet.</p>}
      <ul className="workspace-list">
        {query.data?.map((item) => (
          <li key={item.id}>
            <h3>{item.artistName}</h3>
            <p>{statusLabel[item.status]}</p>
            {item.rejectionReason && <p>{item.rejectionReason}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}
