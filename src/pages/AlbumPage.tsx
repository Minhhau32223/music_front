import { Download, Heart, MoreHorizontal, Play, Waves } from 'lucide-react'
import { Artwork } from '@/components/shared/Artwork'
import { SongTable, type Song } from '@/components/shared/SongRow'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { recent } from '@/features/music/mock-data'

const titles = [
  ['Alone Again', '4:10'],
  ['Too Late', '3:59'],
  ['Hardest to Love', '3:31'],
  ['Scared to Live', '3:11'],
  ['Snowchild', '4:07'],
  ['Escape from LA', '5:55'],
  ['Heartless', '3:18'],
  ['Faith', '4:43'],
  ['Blinding Lights', '3:20'],
  ['In Your Eyes', '3:57'],
  ['Save Your Tears', '3:35'],
  ['Repeat After Me (Interlude)', '3:15'],
  ['After Hours', '6:01'],
  ['Until I Bleed Out', '3:10'],
]
const songs: Song[] = titles.map(([title, duration], index) => ({
  id: title,
  index: index + 1,
  title,
  artist: 'The Weeknd',
  album: 'After Hours',
  date: 'Mar 20, 2020',
  duration,
  playing: title === 'Blinding Lights',
}))

export function AlbumPage() {
  return (
    <div className="page">
      <section className="album-hero">
        <div className="album-cover">
          <Artwork src={recent[0].image} alt="After Hours album cover">
            <Badge accent className="artwork-badge">
              24-bit 192kHz
            </Badge>
          </Artwork>
        </div>
        <div className="album-copy">
          <Badge>Album</Badge>
          <span className="caption" style={{ color: 'var(--warning)', marginLeft: 10 }}>
            ● Master quality authenticated
          </span>
          <h1>
            After
            <br />
            Hours
          </h1>
          <p>
            <strong style={{ color: 'var(--text-primary)' }}>The Weeknd</strong>&nbsp; ·
            &nbsp;2020&nbsp; · &nbsp;14 songs, 56 min 19 sec
          </p>
          <div className="hero-actions">
            <Button size="lg" className="hero-play">
              <Play size={17} fill="currentColor" /> Play
            </Button>
            <IconButton label="Lưu album" className="button secondary-variant icon">
              <Heart size={19} />
            </IconButton>
            <IconButton label="Tải xuống" className="button secondary-variant icon">
              <Download size={19} />
            </IconButton>
            <IconButton label="Tùy chọn khác" className="button secondary-variant icon">
              <MoreHorizontal size={19} />
            </IconButton>
          </div>
        </div>
      </section>
      <div className="sonic-palette">
        <Waves size={20} color="var(--accent-secondary)" />
        <div>
          <span>Sonic palette</span>
          <strong>Dark Wave · Synthpop · Electro-noir Cinematic</strong>
        </div>
        <svg className="waveform" viewBox="0 0 130 28" fill="none">
          <path
            d="M1 15c9-8 16-8 24 0s17 8 25 0 17-8 25 0 17 8 25-2 16-10 29-8"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <Badge>LUFS -8.4</Badge>
      </div>
      <SongTable songs={songs} />
      <section className="section">
        <div className="section-heading">
          <div className="section-title-wrap">
            <h2>About the Album</h2>
          </div>
          <span className="caption muted">Mastered for Nocturne Pro Audio</span>
        </div>
        <div className="about-grid">
          <div className="about-card">
            <span className="caption" style={{ color: '#d5c2ff' }}>
              Concept & vision
            </span>
            <p>
              The fourth studio album by The Weeknd explores themes of self-destruction, regret, and
              escapism across a nocturnal, 80s-inspired dreamscape.
            </p>
          </div>
          <div className="about-card">
            <span className="caption" style={{ color: 'var(--accent-secondary)' }}>
              Production credits
            </span>
            <p>
              Produced by The Weeknd, Illangelo, Max Martin, Metro Boomin, Oscar Holter, and
              DaHeala. Sound engineering optimized for spatial audio.
            </p>
          </div>
          <div className="about-card">
            <span className="caption" style={{ color: 'var(--warning)' }}>
              Recognition
            </span>
            <p>
              Debuted atop the Billboard 200 and became a defining contemporary pop record with a
              record-breaking chart run.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
