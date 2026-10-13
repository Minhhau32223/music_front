import { Heart, MoreHorizontal, Play, Search, Volume2 } from 'lucide-react'
import { useState } from 'react'
import { Artwork } from '@/components/shared/Artwork'
import { MusicCard } from '@/components/shared/MusicCard'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/States'
import { SongTable } from '@/components/shared/SongRow'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Input } from '@/components/ui/Input'
import { SearchInput } from '@/components/ui/SearchInput'
import { AvatarSkeleton, CardSkeleton, SongSkeleton } from '@/components/ui/Skeleton'
import { artists, profileImage, recent } from '@/features/music/mock-data'

export function UIPlaygroundPage() {
  const [query, setQuery] = useState('Blinding Lights')
  return (
    <div className="page playground">
      <span className="caption" style={{ color: 'var(--accent-secondary)' }}>
        Development route / dev / ui
      </span>
      <h1>NOCTURNE Design System</h1>
      <p className="playground-intro">
        Core primitives, music components and product states used across the Phase 1 shell.
      </p>
      <section className="playground-section">
        <h2>Colors</h2>
        <div className="playground-surface">
          <div className="token-grid">
            {[
              ['Primary', '#08090c'],
              ['Surface', '#101217'],
              ['Elevated', '#171a21'],
              ['Hover', '#1e222b'],
              ['Accent', '#8b5cf6'],
              ['Cyan', '#22d3ee'],
              ['Success', '#22c55e'],
              ['Error', '#ef4444'],
            ].map(([name, color]) => (
              <div
                className="token"
                key={name}
                style={{ '--token-color': color } as React.CSSProperties}
              >
                <span>
                  {name}
                  <br />
                  {color}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="playground-section">
        <h2>Typography</h2>
        <div className="playground-surface" style={{ display: 'grid', justifyItems: 'start' }}>
          <span className="caption" style={{ color: 'var(--accent-secondary)' }}>
            Display / Space Grotesk
          </span>
          <strong className="brand-type" style={{ fontSize: '2.8rem', lineHeight: 1 }}>
            Future Us
          </strong>
          <strong style={{ fontSize: '1.4rem' }}>Blinding Lights</strong>
          <span className="secondary">The Weeknd · After Hours · 2020</span>
          <span className="muted">One Step of Love, Miles of Pain — title overflow ready</span>
        </div>
      </section>
      <section className="playground-section">
        <h2>Buttons & icon actions</h2>
        <div className="playground-surface">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <IconButton label="Play">
            <Play size={18} />
          </IconButton>
          <IconButton label="Like" active>
            <Heart size={18} />
          </IconButton>
          <IconButton label="Volume">
            <Volume2 size={18} />
          </IconButton>
          <IconButton label="More options">
            <MoreHorizontal size={18} />
          </IconButton>
        </div>
      </section>
      <section className="playground-section">
        <h2>Inputs</h2>
        <div className="playground-surface" style={{ alignItems: 'start' }}>
          <Input label="Default input" placeholder="Email address" />
          <Input
            label="Error state"
            value="invalid@"
            readOnly
            error="Enter a valid email address"
          />
          <Input label="Disabled" placeholder="Unavailable" disabled />
          <SearchInput
            aria-label="Search input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery('')}
            placeholder="Search music"
          />
          <SearchInput aria-label="Loading search" value="Searching" readOnly loading />
        </div>
      </section>
      <section className="playground-section">
        <h2>Avatar, badge & artwork</h2>
        <div className="playground-surface">
          <Avatar src={profileImage} alt="Aether Curates" fallback="AC" size="sm" />
          <Avatar fallback="NH" alt="Nguyen Ha" />
          <Avatar fallback="TW" alt="The Weeknd" size="lg" />
          <Badge>Album</Badge>
          <Badge accent>New</Badge>
          <div style={{ width: 130 }}>
            <Artwork src={recent[0].image} alt="After Hours" />
          </div>
          <div style={{ width: 130 }}>
            <Artwork src={artists[0].image} alt="The Weeknd" shape="artist" />
          </div>
        </div>
      </section>
      <section className="playground-section">
        <h2>Music cards</h2>
        <div className="playground-surface">
          <div className="playground-grid">
            <MusicCard {...recent[0]} />
            <MusicCard {...recent[1]} />
            <MusicCard {...artists[0]} />
            <MusicCard {...recent[3]} badge="New" />
            <MusicCard
              id="fallback"
              image="/missing-artwork.jpg"
              title="Fallback Artwork"
              subtitle="Error state"
            />
          </div>
        </div>
      </section>
      <section className="playground-section">
        <h2>Song row</h2>
        <div className="playground-surface">
          <SongTable
            songs={[
              {
                id: '1',
                index: 1,
                title: 'Blinding Lights',
                artist: 'The Weeknd',
                album: 'After Hours',
                date: '2 days ago',
                duration: '3:20',
                image: recent[0].image,
              },
              {
                id: '2',
                index: 2,
                title: 'Is This Love',
                artist: 'Son Tung M-TP',
                album: 'Single',
                date: '1 week ago',
                duration: '3:22',
                playing: true,
              },
            ]}
          />
        </div>
      </section>
      <section className="playground-section">
        <h2>Skeletons</h2>
        <div className="playground-surface">
          <div className="playground-grid">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <AvatarSkeleton />
          <SongSkeleton />
        </div>
      </section>
      <section className="playground-section">
        <h2>Loading, empty & error</h2>
        <div
          className="playground-surface"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
            width: '100%',
          }}
        >
          <LoadingState />
          <EmptyState />
          <ErrorState />
        </div>
      </section>
      <section className="playground-section">
        <h2>Search icon reference</h2>
        <div className="playground-surface">
          <Search size={20} />
          <span className="secondary">Lucide icons use a consistent 1.75–2px visual weight.</span>
        </div>
      </section>
    </div>
  )
}
