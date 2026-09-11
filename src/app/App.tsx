import { RouterProvider } from 'react-router-dom'
import { AuthBootstrap } from '@/features/auth/components/AuthBootstrap'
import { AppProviders } from './providers'
import { router } from './router'

export function App() {
  return (
    <AppProviders>
      <AuthBootstrap>
        <RouterProvider router={router} />
      </AuthBootstrap>
    </AppProviders>
  )
}
