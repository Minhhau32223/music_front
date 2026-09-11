export type ArtworkShape = 'album' | 'playlist' | 'artist'

export type MusicItem = {
  id: string
  image: string
  title: string
  subtitle: string
  shape?: ArtworkShape
  badge?: string
}
