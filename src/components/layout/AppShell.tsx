import { useLayoutEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { GlobalPlayer, QueuePanel, usePlayerStore } from '@/features/player'
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

  useLayoutEffect(() => {
    const main = mainRef.current
    if (!main) return
    main.scrollTop = navigationType === 'POP' ? (scrollPositions.get(location.key) ?? 0) : 0
    return () => {
      scrollPositions.set(location.key, main.scrollTop)
    }
  }, [location.key, navigationType])

  return (
    <div
      className={`app-shell${collapsed ? ' sidebar-collapsed' : ''}${
        queueOpen ? ' queue-panel-open' : ' queue-panel-closed'
      }`}
    >
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
      <div className="workspace">
        <TopBar />
        <main ref={mainRef} className="main-scroll" id="main-content">
          <Outlet />
        </main>
      </div>
      <QueuePanel />
      <GlobalPlayer />
      <MobileNavigation />
    </div>
  )
}
