import { Check, MoreHorizontal, Play } from 'lucide-react'
import { MusicCard } from '@/components/shared/MusicCard'
import { SongTable, type Song } from '@/components/shared/SongRow'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { recent } from '@/features/music/mock-data'

const hero =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA5T5u9DaxpY0JFnOH_ZJVJc6l_Zjvi7y3JpNPT5MFxvq-_0wwgZe-Trul1J-FEgmfUT62g79TqmJcw5IHjxWa3221lwbM32AgSHdfivg3xgbcOWAR8Wq1RDgMSlr4wEq02KVCBO9tVDzXOcuB_6aHD-eSKUaP2eP_sC93b58owbOg8Tti_lpHFLZnU1GTG3W4cx3MkvTlgmCP-eM5xjvDC9ngzz_RUxiw1cdxDuM1uyN_u16w8GdKC'
const popular: Song[] = [
  ['Blinding Lights', 'After Hours', '4,120,491,820', '3:20'],
  ['Starboy', 'Starboy', '3,284,912,050', '3:50'],
  ['Save Your Tears', 'After Hours', '2,912,488,110', '3:35'],
  ['Die For You', 'Starboy', '2,410,772,990', '4:20'],
  ['The Hills', 'Beauty Behind the Madness', '2,118,500,432', '4:02'],
].map(([title, album, date, duration], index) => ({
  id: title,
  index: index + 1,
  title,
  artist: 'The Weeknd',
  album,
  date,
  duration,
  image: index === 0 ? recent[0].image : undefined,
}))

export function ArtistPage() {
  return (
    <div className="page">
      <section className="artist-hero">
        <img src={hero} alt="The Weeknd biểu diễn trên sân khấu" />
        <span className="caption" style={{ color: 'var(--accent-secondary)' }}>
          ◉ Verified artist
        </span>
        <h1>The Weeknd</h1>
        <p>
          98,412,050 monthly listeners&nbsp; · &nbsp;<Badge accent>#1 in the world</Badge>
        </p>
        <div className="hero-actions">
          <Button size="lg">
            <Play size={17} fill="currentColor" /> Play
          </Button>
          <Button size="lg" variant="secondary">
            <Check size={17} /> Following
          </Button>
          <IconButton label="Tùy chọn khác" className="button secondary-variant icon">
            <MoreHorizontal size={19} />
          </IconButton>
        </div>
      </section>
      <div className="two-column">
        <section>
          <div className="subheading-row">
            <h2>Popular</h2>
            <span className="caption muted">All time plays</span>
          </div>
          <SongTable songs={popular} />
        </section>
        <aside>
          <div className="subheading-row">
            <h2>Tour & Live</h2>
          </div>
          <div className="tour-card">
            <Badge accent>Live tonight</Badge>
            <h3>After Hours Til Dawn Stadium Tour</h3>
            <p>MetLife Stadium, East Rutherford, NJ</p>
            <div className="result-actions">
              <span className="caption" style={{ color: 'var(--warning)' }}>
                Limited passes left
              </span>
              <Button size="sm" variant="secondary">
                View tickets
              </Button>
            </div>
          </div>
        </aside>
      </div>
      <section className="section">
        <div className="section-heading">
          <div className="section-title-wrap">
            <h2>Discography</h2>
          </div>
        </div>
        <div className="card-grid">
          {recent.map((item) => (
            <MusicCard key={item.id} {...item} />
          ))}
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <div className="section-title-wrap">
            <h2>About</h2>
          </div>
        </div>
        <div className="bio-card">
          <span className="caption" style={{ color: '#d5c2ff' }}>
            Artist spotlight&nbsp; ● &nbsp;Toronto, Ontario, Canada
          </span>
          <blockquote>
            “Music is the soundtrack to our private nocturnal lives. Every record is a film you
            experience with your eyes closed.”
          </blockquote>
          <p className="secondary">
            Abel Makkonen Tesfaye is a Canadian singer, songwriter, and record producer renowned for
            his sonic versatility and dark lyricism.
          </p>
          <div className="stats">
            <div>
              <strong>98.4M</strong>
              <span>Global listeners</span>
            </div>
            <div>
              <strong>4.1B</strong>
              <span>Peak single stream</span>
            </div>
            <div>
              <strong style={{ color: 'var(--accent-secondary)' }}>4x</strong>
              <span>Grammy winner</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
