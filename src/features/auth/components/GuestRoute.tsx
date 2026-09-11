import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'

export function GuestRoute() {
  const status = useAuthStore((state) => state.status)
  return status === 'authenticated' ? <Navigate to="/home" replace /> : <Outlet />
}
