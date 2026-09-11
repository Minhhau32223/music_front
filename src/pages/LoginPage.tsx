import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LoginForm } from '@/features/auth/components/LoginForm'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/home'

  return (
    <>
      <LoginForm onSuccess={() => navigate(from, { replace: true })} />
      <p className="auth-switch">
        New to NOCTURNE? <Link to="/register">Create an account</Link>
      </p>
    </>
  )
}
