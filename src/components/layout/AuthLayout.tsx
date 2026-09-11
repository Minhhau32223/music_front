import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <main className="auth-layout">
      <section className="auth-visual" aria-hidden="true">
        <div className="auth-orbit orbit-one" />
        <div className="auth-orbit orbit-two" />
        <div className="auth-wave" />
        <div className="auth-visual-copy">
          <span className="caption">HIGH FIDELITY. DEEPLY YOURS.</span>
          <h2>Music after dark.</h2>
        </div>
      </section>
      <section className="auth-panel">
        <div className="auth-panel-inner">
          <div className="brand-lockup">
            <span className="brand-mark" aria-hidden="true" />
            <span className="brand-type">NOCTURNE</span>
          </div>
          <Outlet />
        </div>
      </section>
    </main>
  )
}
