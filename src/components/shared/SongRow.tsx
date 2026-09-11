import { Play } from 'lucide-react'

export type Song = {
  id: string
  index: number
  title: string
  artist: string
  album: string
  date: string
  duration: string
  image?: string
  playing?: boolean
}
export function SongRow({ song }: { song: Song }) {
  return (
    <tr className={`song-row${song.playing ? ' playing' : ''}`}>
      <td>
        <span className="song-index">{song.index}</span>
        <Play className="song-index-play" size={14} fill="currentColor" />
      </td>
      <td>
        <div className="song-title-cell">
          {song.image && (
            <div className="song-cover">
              <img src={song.image} alt="" />
            </div>
          )}
          <div>
            <strong>{song.title}</strong>
            <span>{song.artist}</span>
          </div>
        </div>
      </td>
      <td>{song.album}</td>
      <td>{song.date}</td>
      <td>{song.duration}</td>
    </tr>
  )
}
export function SongTable({ songs }: { songs: Song[] }) {
  return (
    <table className="song-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Album</th>
          <th>Date added</th>
          <th>
            <span className="sr-only">Duration</span>◷
          </th>
        </tr>
      </thead>
      <tbody>
        {songs.map((song) => (
          <SongRow key={song.id} song={song} />
        ))}
      </tbody>
    </table>
  )
}
