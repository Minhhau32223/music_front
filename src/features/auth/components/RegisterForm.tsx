import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { isApiError } from '@/lib/api/api-error'
import { useRegister } from '../hooks/useRegister'
import { registerSchema, type RegisterFormValues } from '../schemas/register.schema'

export function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [showPassword, setShowPassword] = useState(false)
  const registration = useRegister()
  const { register, handleSubmit, setError, formState } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  })
  const submit = handleSubmit(async (formValues) => {
    const values = {
      username: formValues.username,
      email: formValues.email,
      password: formValues.password,
    }
    try {
      await registration.mutateAsync(values)
      onSuccess()
    } catch (error) {
      if (isApiError(error) && error.fieldErrors) {
        for (const [field, message] of Object.entries(error.fieldErrors)) {
          if (field === 'username' || field === 'email' || field === 'password')
            setError(field, { message })
        }
      }
    }
  })

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <div className="auth-heading">
        <span className="caption">JOIN NOCTURNE</span>
        <h1>Create your account</h1>
        <p>Start building a listening space that feels like yours.</p>
      </div>
      {registration.error && isApiError(registration.error) && (
        <div className="auth-alert" role="alert">
          {registration.error.message}
        </div>
      )}
      <Input
        label="Username"
        autoComplete="username"
        placeholder="Your display name"
        startIcon={<UserRound size={17} />}
        error={formState.errors.username?.message}
        disabled={registration.isPending}
        {...register('username')}
      />
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        startIcon={<Mail size={17} />}
        error={formState.errors.email?.message}
        disabled={registration.isPending}
        {...register('email')}
      />
      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
        placeholder="At least 6 characters"
        startIcon={<LockKeyhole size={17} />}
        error={formState.errors.password?.message}
        disabled={registration.isPending}
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
      <Input
        label="Confirm password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
        placeholder="Repeat your password"
        startIcon={<LockKeyhole size={17} />}
        error={formState.errors.confirmPassword?.message}
        disabled={registration.isPending}
        {...register('confirmPassword')}
      />
      <Button className="auth-submit" type="submit" size="lg" loading={registration.isPending}>
        {registration.isPending ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  )
}
