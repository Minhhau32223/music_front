import { RouterProvider } from 'react-router-dom'
import { AuthBootstrap } from '@/features/auth/components/AuthBootstrap'
import { RouteErrorBoundary } from '@/components/shared/RouteErrorBoundary'
import { AppProviders } from './providers'
import { router } from './router'

export function App() {
  return (
    <AppProviders>
      <RouteErrorBoundary root>
        <AuthBootstrap>
          <RouterProvider router={router} />
        </AuthBootstrap>
      </RouteErrorBoundary>
    </AppProviders>
  )
}
