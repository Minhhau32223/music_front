import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from '../store/auth.store'
import { GuestRoute } from './GuestRoute'
import { ProtectedRoute } from './ProtectedRoute'

describe('auth route guards', () => {
  beforeEach(() => useAuthStore.setState({ status: 'unauthenticated', accessToken: null }))

  it('redirects a guest to login and preserves the destination', () => {
    render(
      <MemoryRouter initialEntries={['/library?sort=recent']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/library" element={<div>Library</div>} />
          </Route>
          <Route path="/login" element={<div>Sign in</div>} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Sign in')).toBeInTheDocument()
  })

  it('allows authenticated users through private routes', () => {
    useAuthStore.getState().setSession('access-token')
    render(
      <MemoryRouter initialEntries={['/library']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/library" element={<div>Library</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Library')).toBeInTheDocument()
  })

  it('redirects authenticated users away from guest routes', () => {
    useAuthStore.getState().setSession('access-token')
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<div>Sign in</div>} />
          </Route>
          <Route path="/home" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Home')).toBeInTheDocument()
  })
})
