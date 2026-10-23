import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { workspaceApi } from './api'
import { moderationQuery, useWorkspaceMutation } from './queries'
import { WorkspaceError, WorkspaceState } from './components'
import { statusLabel } from './types'
import type { ArtistApplication, ArtistContent, ReviewKind } from './types'

type ReviewItem = ArtistApplication | ArtistContent
function ReviewQueue({ kind }: { kind: ReviewKind }) {
  const query = useQuery(moderationQuery(kind))
  const [reviewed, setReviewed] = useState<ReviewItem[]>([])
  const [filter, setFilter] = useState('pending')
  const [decision, setDecision] = useState<{
    item: ReviewItem
    action: 'approve' | 'reject' | 'disable'
  } | null>(null)
  const mutation = useWorkspaceMutation(
    ({
      id,
      action,
      reason,
    }: {
      id: number
      action: 'approve' | 'reject' | 'disable'
      reason?: string
    }) => workspaceApi.review(kind, id, action, reason),
    'admin',
  )
  const items =
    filter === 'pending'
      ? (query.data ?? [])
      : reviewed.filter((item) =>
          filter === 'approved'
            ? ['APPROVED', 'PUBLISHED'].includes(item.status)
            : item.status === 'REJECTED',
        )
  return (
    <section>
      <h2>
        {kind === 'artist-applications'
          ? 'Artist applications'
          : kind === 'songs'
            ? 'Songs'
            : 'Albums'}
      </h2>
      <label className="field">
        Status
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved this session</option>
          <option value="rejected">Rejected this session</option>
        </select>
      </label>
      {filter !== 'pending' && (
        <p>
          Only actions from this session are shown. The backend does not yet provide full history.
        </p>
      )}
      <WorkspaceState
        pending={query.isPending}
        error={query.error}
        retry={() => void query.refetch()}
      />
      {query.isSuccess && !items.length && <p>No items found.</p>}
      <div className="workspace-table">
        <table>
          <caption>
            {kind === 'artist-applications' ? 'Applications' : 'Content'} moderation
          </caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Status</th>
              <th scope="col">Details</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <th scope="row">{'artistName' in item ? item.artistName : item.name}</th>
                <td>{statusLabel[item.status]}</td>
                <td>
                  {'bio' in item ? item.bio : `Artist #${item.artistId}`}
                  {item.rejectionReason && <p>{item.rejectionReason}</p>}
                  {'lyrics' in item && item.lyrics && (
                    <details>
                      <summary>Lyrics</summary>
                      <p style={{ whiteSpace: 'pre-wrap' }}>{item.lyrics}</p>
                    </details>
                  )}
                </td>
                <td>
                  {['PENDING', 'PENDING_REVIEW'].includes(item.status) && (
                    <>
                      <Button
                        size="sm"
                        disabled={mutation.isPending}
                        onClick={() => {
                          mutation.reset()
                          setDecision({ item, action: 'approve' })
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={mutation.isPending}
                        onClick={() => {
                          mutation.reset()
                          setDecision({ item, action: 'reject' })
                        }}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {item.status === 'PUBLISHED' && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        mutation.reset()
                        setDecision({ item, action: 'disable' })
                      }}
                    >
                      Hide content
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        open={Boolean(decision)}
        title={
          decision?.action === 'approve'
            ? 'Confirm approval'
            : decision?.action === 'disable'
              ? 'Hide published content?'
              : 'Reject'
        }
        onClose={() => !mutation.isPending && setDecision(null)}
      >
        <form
          className="modal-form"
          onSubmit={(event) => {
            event.preventDefault()
            if (!decision) return
            const values = new FormData(event.currentTarget)
            mutation.mutate(
              {
                id: decision.item.id,
                action: decision.action,
                reason: String(values.get('reason') ?? ''),
              },
              {
                onSuccess: (item) => {
                  setReviewed((previous) => [...previous.filter((row) => row.id !== item.id), item])
                  setDecision(null)
                },
              },
            )
          }}
        >
          <p>
            {decision &&
              ('artistName' in decision.item ? decision.item.artistName : decision.item.name)}
          </p>
          {decision?.action === 'reject' && (
            <Input label="Rejection reason" name="reason" required pattern=".*\S.*" />
          )}
          <WorkspaceError error={mutation.error} />
          <Button type="submit" loading={mutation.isPending}>
            Confirm
          </Button>
        </form>
      </Modal>
    </section>
  )
}
export function AdminWorkspace() {
  return (
    <div className="page workspace-page">
      <h1>Moderation</h1>
      <ReviewQueue kind="artist-applications" />
      <ReviewQueue kind="songs" />
      <ReviewQueue kind="albums" />
    </div>
  )
}
