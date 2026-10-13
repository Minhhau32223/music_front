import { Compass, Home, Library, Search } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const items = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/library', label: 'Library', icon: Library },
]

export function MobileNavigation() {
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <Icon size={19} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
