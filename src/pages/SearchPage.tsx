import { Play, Radio, Search, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { SongTable, type Song } from '@/components/shared/SongRow'

const weekndPortrait =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA5T5u9DaxpY0JFnOH_ZJVJc6l_Zjvi7y3JpNPT5MFxvq-_0wwgZe-Trul1J-FEgmfUT62g79TqmJcw5IHjxWa3221lwbM32AgSHdfivg3xgbcOWAR8Wq1RDgMSlr4wEq02KVCBO9tVDzXOcuB_6aHD-eSKUaP2eP_sC93b58owbOg8Tti_lpHFLZnU1GTG3W4cx3MkvTlgmCP-eM5xjvDC9ngzz_RUxiw1cdxDuM1uyN_u16w8GdKC'
const covers = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAWrBCIx7BscR9bXmHRYuTOoI6ZAgKyUnFI5xyp19owvwz1U6SY2vw8KocDBsD_JJa0TGMi1QvKmyAskPlAcmjv-IebqFeoi5v8x17U3YSxhMYyPiescHmkVnDAooNUNAVWxLf0dQtigPD2Cfd0IJqDquK3sGnhsHrsiYtkFbGry1juqcNAfrjdUG4ERXYUea0bjNSEDtoEHV2j2ggTcyP123-XFJeVU0Ke_eyrWUsH943IHaWDHURC',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB18ib7VpUyC3H9omH4FFMjnONA1MskYbvEo2xbK9gFpg-FXjpd68Q2KI43-L_CYPkC4vqTNGLS07Cij4YK0ZbIG9Axc4zsjFOXyzX3nJM5NtiYYUjZsatLI7CiTkYLOW1RhzG42C2tf-wlx7pdi_R2VSE5RZbo7mowzXawGASg2r7Su7MfprdvBB2wppEQFDIhOKsVeSDQfcDuZg-0VcgKEMfK07u0LrFad15Zfa0QTTyGPsy2K2rY',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAmxEHDVZ__XYxG5E69AG7xy1wbpiTvJ855l0Bo5ABrnKw9Uul_ymIvxtCgeMsG_LQHn1sx-tElmh9QOcZEdSEYRtYbSovmUvoqEBBIpHUiIueL2blBS87mB7VvqKXGiB0-8NbvYLkM0pTYj3jzSfMa0X1q-CiC9EGTO9GFvWjRixEf8uOjIpp1OEMPGro8ZjhbUzYB-83ywbKneK4tQb7fWPNbEXtE0qNd-IL3m7-3XjkIfkfqwlBW',
]
const songs: Song[] = [
  {
    id: 'blinding',
    index: 1,
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    date: '4,182,901,102',
    duration: '3:20',
    image: covers[0],
    playing: true,
  },
  {
    id: 'starboy',
    index: 2,
    title: 'Starboy',
    artist: 'The Weeknd, Daft Punk',
    album: 'Starboy',
    date: '3,190,412,880',
    duration: '3:50',
    image: covers[1],
  },
  {
    id: 'save',
    index: 3,
    title: 'Save Your Tears',
    artist: 'The Weeknd',
    album: 'After Hours',
    date: '2,308,124,095',
    duration: '3:35',
    image: covers[2],
  },
  {
    id: 'hills',
    index: 4,
    title: 'The Hills',
    artist: 'The Weeknd',
    album: 'Beauty Behind the Madness',
    date: '2,241,501,118',
    duration: '4:02',
  },
]
const categories = [
  [
    '01 · Frequency',
    'Late Night Electronic',
    'Synthwave, French Electro, Cyberpunk',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDETHuRrvua6HXa1pV40Y3wjmyoCPE-hZFykJalzDdsWRKaEZ-r_5Q_R07qALBq9-w6J-sAn3nNc0uoepxy38-gvhWw7OLfoyYHIgiJ5qd028PxOgDmcZCTv-G5MsKpQuRT1r14FA5iPeXTsbfVI2qPQlxQCFfdhn73fkiIzNvMIm1Ks-6tPDJ_OOoPWuScvWWQ6bwQ_9CplJuSJH-Ol7f6_7eBkL-hqwIEdvYlI-9VY_AG8b7Vw5-A',
  ],
  [
    '02 · Meditation',
    'Dark Ambient & Drone',
    'Modular resonance, Sub-bass meditation',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCDn_F7qjF3Zo-L2v71zlSWIgAhm4Ul2Qn1E2zIdUU2Hd1_KNbplUi5LpiXJmtiEH5a-3B4laj_PMkKEX-btORR1kZWDKROXN4yUDroJJh8WXgALv2hUpLyTcxi-gkCvad1DwL5i7EUxa1IOpN_9dhMGhwZ6zTW5dQdWceqD3V9CZ12AUK2poc5CXpUx3nueKrGOo-zqsUvdlKzoJY0ET31H1xemAFwYYc7Vra3VLcMSQxmQ3ZsfQC4',
  ],
  [
    '03 · Theatrical',
    'Cinematic Soundtracks',
    'Original scores, Neo-noir, Orchestral hybrid',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDgxQFdfoQkqPGcKr8ahMszGaCiBMB6Hxl1JPnY22tUpR3yPR0raxxBq6wOH2llskUJLWHNxUrDhjsAN1Xb1Xy5Bbw32ylAh-PJUcQwWPAZ-XXt0ybD80snSjodvjPyEdwAO3-kB0qKpQ-z66Sc26ivy6VIwW5bW2ismrrVta80f4W0ZDvMllMYQwjO-BtQjhXoI1gtRPFbtPn3d_ltFOUhi10-BcoOuZ0Y2tYABEDFJvjPczfkcW0D',
  ],
]

export function SearchPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('The Weeknd')
  return (
    <div className="page search-page">
      <div className="caption search-terminal">Acoustic discovery terminal&nbsp; ●</div>
      <label className="search-hero">
        <Search size={24} color="var(--text-secondary)" />
        <input
          value={query}
          aria-label="Search music"
          onChange={(event) => setQuery(event.target.value)}
          autoFocus
        />
        <kbd>ESC</kbd>
        <IconButton label="Clear search" tooltip={false} onClick={() => setQuery('')}>
          <X size={17} />
        </IconButton>
      </label>
      <div className="search-tabs">
        {['All', 'Songs', 'Artists', 'Albums', 'Playlists', 'Broadcasts'].map((tab, index) => (
          <Button key={tab} variant={index === 0 ? 'secondary' : 'ghost'} size="sm">
            {tab}
          </Button>
        ))}
      </div>
      <div className="search-layout">
        <section>
          <div className="subheading-row">
            <h1>Top Result</h1>
            <span className="caption" style={{ color: '#cfb7ff' }}>
              Verified master
            </span>
          </div>
          <div className="top-result">
            <div className="result-head">
              <Avatar src={weekndPortrait} alt="The Weeknd" fallback="TW" size="lg" />
              <div className="result-copy">
                <span className="caption" style={{ color: '#cfb7ff' }}>
                  Direct match
                </span>
                <h2>The Weeknd</h2>
                <Badge>Artist</Badge>
              </div>
            </div>
            <p className="secondary" style={{ marginTop: 24 }}>
              Pioneering Canadian visionary shaping modern synth-pop and nocturnal R&B.
            </p>
            <div className="result-actions">
              <Button variant="secondary" onClick={() => navigate('/artist/the-weeknd')}>
                View artist
              </Button>
              <IconButton label="Open artist radio">
                <Radio size={18} />
              </IconButton>
              <IconButton label="Play The Weeknd" className="play-main">
                <Play size={18} fill="currentColor" />
              </IconButton>
            </div>
          </div>
        </section>
        <section>
          <div className="subheading-row">
            <h2>Top Songs</h2>
            <button className="text-button" type="button">
              View discography
            </button>
          </div>
          <div className="top-song-list">
            <SongTable songs={songs} />
          </div>
        </section>
      </div>
      <section className="category-section">
        <div className="category-heading">
          <div>
            <span className="caption muted">Aesthetic soundscapes</span>
            <h2>Browse All Categories</h2>
          </div>
          <span className="secondary">Curated by Nocturne Sound Labs</span>
        </div>
        <div className="category-grid">
          {categories.map(([tag, title, subtitle, image]) => (
            <article className="category-card" key={title}>
              <img src={image} alt="" />
              <div>
                <span className="caption" style={{ color: 'var(--accent-secondary)' }}>
                  {tag}
                </span>
                <h3>{title}</h3>
                <span className="secondary">{subtitle}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
