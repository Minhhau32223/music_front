export type SongDto = {
  id: number
  name: string
  file: string
  image: string | null
  lyrics: string | null
  duration: string
  playCount: number | null
  albumId: number | null
  artistId: number
  albumName: string | null
  artistName: string | null
}
