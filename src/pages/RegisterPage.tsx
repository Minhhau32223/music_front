import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/toast-context'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

export function RegisterPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const onSuccess = () => {
    showToast('Account created. Sign in to continue.', 'success')
    navigate('/login', { replace: true })
  }

  return (
    <>
      <RegisterForm onSuccess={onSuccess} />
      <p className="auth-switch">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </>
  )
}
