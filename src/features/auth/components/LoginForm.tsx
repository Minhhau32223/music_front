import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { isApiError } from '@/lib/api/api-error'
import { useLogin } from '../hooks/useLogin'
import { loginSchema, type LoginFormValues } from '../schemas/login.schema'

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [showPassword, setShowPassword] = useState(false)
  const login = useLogin()
  const { register, handleSubmit, setError, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const submit = handleSubmit(async (values) => {
    try {
      await login.mutateAsync(values)
      onSuccess()
    } catch (error) {
      if (isApiError(error) && error.fieldErrors) {
        for (const [field, message] of Object.entries(error.fieldErrors)) {
          if (field === 'email' || field === 'password') setError(field, { message })
        }
      }
    }
  })

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <div className="auth-heading">
        <span className="caption">WELCOME BACK</span>
        <h1>Sign in to listen</h1>
        <p>Continue your listening session across NOCTURNE.</p>
      </div>
      {login.error && isApiError(login.error) && (
        <div className="auth-alert" role="alert">
          {login.error.message}
        </div>
      )}
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        startIcon={<Mail size={17} />}
        error={formState.errors.email?.message}
        disabled={login.isPending}
        {...register('email')}
      />
      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        placeholder="Enter your password"
        startIcon={<LockKeyhole size={17} />}
        error={formState.errors.password?.message}
        disabled={login.isPending}
        endAdornment={
          <button
            className="password-toggle"
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        }
        {...register('password')}
      />
      <Button className="auth-submit" type="submit" size="lg" loading={login.isPending}>
        {login.isPending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
