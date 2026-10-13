import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { OfflineBanner } from '@/components/shared/OfflineBanner'
import { RouteErrorBoundary } from '@/components/shared/RouteErrorBoundary'
import { GlobalPlayer, QueuePanel, usePlayerStore } from '@/features/player'
import { useLyricsStore } from '@/features/player/store/lyrics.store'
import { MobileNavigation } from './MobileNavigation'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

const scrollPositions = new Map<string, number>()

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const location = useLocation()
  const navigationType = useNavigationType()
  const queueOpen = usePlayerStore((state) => state.isQueueOpen)
  const hasActiveTrack = usePlayerStore((state) => state.currentIndex >= 0)

  useLayoutEffect(() => {
    const main = mainRef.current
    if (!main) return
    main.scrollTop = navigationType === 'POP' ? (scrollPositions.get(location.key) ?? 0) : 0
    return () => {
      scrollPositions.set(location.key, main.scrollTop)
    }
  }, [location.key, navigationType])

  useEffect(() => {
    // Playback state is persistent; route changes only dismiss transient player overlays.
    usePlayerStore.getState().setQueueOpen(false)
    usePlayerStore.getState().setExpanded(false)
    useLyricsStore.getState().close()

    const routeTitle = getRouteTitle(location.pathname)
    document.title = `${routeTitle} — NOCTURNE`
    const frame = window.requestAnimationFrame(() =>
      mainRef.current?.focus({ preventScroll: true }),
    )
    return () => window.cancelAnimationFrame(frame)
  }, [location.pathname])

  return (
    <div
      className={`app-shell${collapsed ? ' sidebar-collapsed' : ''}${hasActiveTrack ? ' has-active-track' : ''}${
        queueOpen ? ' queue-panel-open' : ' queue-panel-closed'
      }`}
    >
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
      <div className="workspace">
        <TopBar />
        <OfflineBanner />
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {getRouteTitle(location.pathname)} page
        </p>
        <main ref={mainRef} className="main-scroll" id="main-content" tabIndex={-1}>
          <RouteErrorBoundary key={location.key}>
            <Outlet />
          </RouteErrorBoundary>
        </main>
      </div>
      <QueuePanel />
      <GlobalPlayer />
      <MobileNavigation />
    </div>
  )
}

function getRouteTitle(pathname: string) {
  if (pathname === '/home') return 'Home'
  if (pathname === '/search') return 'Search'
  if (pathname === '/studio') return 'Artist Studio'
  if (pathname === '/admin') return 'Moderation'
  if (pathname === '/artist-application') return 'Artist application'
  if (pathname === '/profile') return 'Profile'
  if (pathname === '/discover') return 'Discover'
  if (pathname.startsWith('/library')) return 'Your library'
  if (pathname.startsWith('/artist')) return 'Artist'
  if (pathname.startsWith('/album')) return 'Album'
  if (pathname.startsWith('/song')) return 'Song'
  if (pathname.startsWith('/playlist')) return 'Playlist'
  return 'NOCTURNE'
}
