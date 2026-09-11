import { useEffect, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'

export function AuthBootstrap({ children }: { children: ReactNode }) {
  const status = useAuthStore((state) => state.status)
  const setSession = useAuthStore((state) => state.setSession)
  const clearSession = useAuthStore((state) => state.clearSession)
  const [attempt, setAttempt] = useState(0)
  const [networkError, setNetworkError] = useState(false)

  useEffect(() => {
    if (status !== 'unknown') return
    let active = true
    authApi
      .refresh()
      .then(({ accessToken }) => active && setSession(accessToken))
      .catch((error: { kind?: string; status?: number }) => {
        if (!active) return
        if (error.kind === 'network') setNetworkError(true)
        else clearSession()
      })

    return () => {
      active = false
    }
  }, [attempt, clearSession, setSession, status])

  if (status === 'unknown') {
    return (
      <main className="app-boot" aria-live="polite">
        <div className="brand-lockup" aria-label="NOCTURNE">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-type">NOCTURNE</span>
        </div>
        {networkError ? (
          <>
            <p>We couldn't connect to NOCTURNE.</p>
            <Button
              onClick={() => {
                setNetworkError(false)
                setAttempt((value) => value + 1)
              }}
            >
              Try again
            </Button>
          </>
        ) : (
          <span className="boot-spinner" aria-label="Restoring your session" />
        )}
      </main>
    )
  }

  return children
}
