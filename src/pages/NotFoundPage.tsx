import { Link } from 'react-router-dom'
export function NotFoundPage() {
  return (
    <div className="page">
      <h1>404 — Page not found</h1>
      <p>This page does not exist or has been moved.</p>
      <Link className="button secondary-variant" to="/home">
        Back to home
      </Link>
    </div>
  )
}
