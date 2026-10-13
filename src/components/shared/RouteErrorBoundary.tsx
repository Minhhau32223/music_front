import { Component, type ReactNode } from 'react'
import { ErrorState } from './States'

type Props = {
  children: ReactNode
  root?: boolean
}

type State = { hasError: boolean }

export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          title={this.props.root ? 'NOCTURNE needs to restart' : 'This page could not load'}
          message={
            this.props.root
              ? 'Reload the app to restore your listening session.'
              : 'Your player is still available. Try this page again or continue browsing.'
          }
          actionLabel={this.props.root ? 'Reload app' : 'Try again'}
          onRetry={() => {
            if (this.props.root) window.location.reload()
            else this.setState({ hasError: false })
          }}
        />
      )
    }
    return this.props.children
  }
}
