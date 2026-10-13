export type SongActionContext =
  'home' | 'search' | 'artist' | 'album' | 'playlist' | 'liked-songs' | 'player' | 'queue'
export type SongAction = {
  id: string
  label: string
  disabled?: boolean
  destructive?: boolean
  execute: () => void
}
type Capabilities = {
  authenticated: boolean
  liked: boolean
  likeDisabled: boolean
  hasAlbum: boolean
  canRemove: boolean
  removing?: boolean
}
export function getSongActions(
  context: SongActionContext,
  c: Capabilities,
  run: Record<string, () => void>,
): SongAction[] {
  const actions: SongAction[] = [
    { id: 'play', label: 'Play now', execute: run.play },
    { id: 'play-next', label: 'Play next', execute: run.next },
    { id: 'add-queue', label: 'Add to queue', execute: run.queue },
  ]
  if (c.authenticated)
    actions.push(
      {
        id: 'like',
        label: c.liked ? 'Unlike' : 'Like',
        disabled: c.likeDisabled,
        execute: run.like,
      },
      { id: 'add-playlist', label: 'Add to playlist', execute: run.playlist },
    )
  actions.push({ id: 'lyrics', label: 'View lyrics', execute: run.lyrics })
  if (context !== 'artist')
    actions.push({ id: 'artist', label: 'Go to artist', execute: run.artist })
  if (context !== 'album' && c.hasAlbum)
    actions.push({ id: 'album', label: 'Go to album', execute: run.album })
  if (c.authenticated && c.canRemove)
    actions.push({
      id: 'remove',
      label: 'Remove from playlist',
      destructive: true,
      disabled: c.removing,
      execute: run.remove,
    })
  return actions
}
