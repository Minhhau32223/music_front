import { Outlet } from 'react-router-dom'
import { useCurrentUser } from '../hooks/useCurrentUser'
import type { CurrentUser } from '../types/auth.types'
import { Button } from '@/components/ui/Button'

export function RoleRoute({ role }: { role: CurrentUser['role'] }) {
  const user = useCurrentUser()
  if (user.isPending) return <p role="status">Checking access…</p>
  if (user.isError)
    return (
      <div role="alert">
        <p>Unable to check access.</p>
        <Button onClick={() => void user.refetch()}>Try again</Button>
      </div>
    )
  if (user.data.role !== role)
    return (
      <div className="page">
        <h1>Access denied</h1>
        <p role="alert">This page requires the {role} role.</p>
      </div>
    )
  return <Outlet />
}
