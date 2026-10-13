import { MoreHorizontal } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { AddToPlaylistDialog } from '@/features/playlists/components/AddToPlaylistDialog'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useLikedSongs } from '@/features/favorites/hooks/useLikedSongs'
import { useToggleFavorite } from '@/features/favorites/hooks/useToggleFavorite'
import { useLyricsStore } from '@/features/player/store/lyrics.store'
import { usePlayer, usePlayerStore } from '@/features/player'
import { toPlayableTrack, type Song } from '@/features/songs/types/song.types'
import { getSongActions, type SongActionContext } from '@/features/songs/actions/song-actions'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  song: Song
  onPlayNow: () => void
  onPlayNext?: () => void
  context?: SongActionContext
  playlistContext?: { canEdit: boolean; onRemove: () => void; removing?: boolean }
}
export function SongContextMenu({
  song,
  onPlayNow,
  onPlayNext,
  context = 'home',
  playlistContext,
}: Props) {
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null)
  const [picker, setPicker] = useState(false)
  const authenticated = useAuthStore((s) => s.status === 'authenticated')
  const liked = useLikedSongs()
  const toggle = useToggleFavorite(song)
  const navigate = useNavigate()
  const { playNext, addToQueue } = usePlayer()
  const closePlayerOverlays = () => {
    usePlayerStore.getState().setQueueOpen(false)
    usePlayerStore.getState().setExpanded(false)
    useLyricsStore.getState().close()
  }
  const actions = getSongActions(
    context,
    {
      authenticated,
      liked: liked.data?.some((item) => item.id === song.id) ?? false,
      likeDisabled: !liked.data || liked.isError || toggle.isPending,
      hasAlbum: Boolean(song.album),
      canRemove: playlistContext?.canEdit ?? false,
      removing: playlistContext?.removing,
    },
    {
      play: onPlayNow,
      next: onPlayNext ?? (() => playNext(toPlayableTrack(song))),
      queue: () => addToQueue(toPlayableTrack(song)),
      like: () => toggle.mutate(!liked.data?.some((item) => item.id === song.id)),
      playlist: () => setPicker(true),
      lyrics: () => useLyricsStore.getState().open(context === 'player' ? 'current' : song.id),
      artist: () => {
        closePlayerOverlays()
        navigate(`/artist/${song.artist.id}`)
      },
      album: () => {
        closePlayerOverlays()
        navigate(`/album/${song.album?.id}`)
      },
      remove: () => playlistContext?.onRemove(),
    },
  )
  const close = () => {
    setPoint(null)
    trigger.current?.focus({ preventScroll: true })
  }
  useEffect(() => {
    const surface = trigger.current?.closest('[data-song-surface]')
    const open = (event: Event) => {
      const pointer = event as MouseEvent
      pointer.preventDefault()
      pointer.stopPropagation()
      setPoint({ x: pointer.clientX, y: pointer.clientY })
    }
    surface?.addEventListener('contextmenu', open)
    return () => surface?.removeEventListener('contextmenu', open)
  }, [])
  useLayoutEffect(() => {
    if (!point || !panel.current) return
    const menu = panel.current
    if (window.innerWidth > 639) {
      menu.style.left = `${Math.max(8, Math.min(point.x, window.innerWidth - menu.offsetWidth - 8))}px`
      menu.style.top = `${Math.max(8, Math.min(point.y, window.innerHeight - menu.offsetHeight - 8))}px`
    }
    menu.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus()
  }, [point])
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="song-more-trigger"
        aria-label={`Options for ${song.title}`}
        aria-haspopup="menu"
        aria-expanded={Boolean(point)}
        onClick={(event) => {
          event.stopPropagation()
          const rect = event.currentTarget.getBoundingClientRect()
          setPoint({ x: rect.left, y: rect.bottom })
        }}
      >
        <MoreHorizontal size={18} />
      </button>
      {createPortal(
        <AnimatePresence>
          {point && (
            <motion.div
              className="song-menu-backdrop"
              onClick={close}
              onContextMenu={(e) => {
                e.preventDefault()
                close()
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <motion.div
                ref={panel}
                className="song-action-menu"
                role="menu"
                aria-label={`Actions for ${song.title}`}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  const items = Array.from(
                    panel.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [],
                  )
                  const index = items.indexOf(document.activeElement as HTMLButtonElement)
                  if (e.key === 'Escape' || e.key === 'Tab') {
                    e.preventDefault()
                    close()
                  }
                  if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
                    e.preventDefault()
                    const next =
                      e.key === 'Home'
                        ? 0
                        : e.key === 'End'
                          ? items.length - 1
                          : (index + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
                    items[next]?.focus()
                  }
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <strong className="song-menu-title">{song.title}</strong>
                {actions.map((action) => (
                  <button
                    role="menuitem"
                    type="button"
                    key={action.id}
                    disabled={action.disabled}
                    className={action.destructive ? 'danger-menu-item' : undefined}
                    onClick={() => {
                      close()
                      action.execute()
                    }}
                  >
                    {action.label}
                  </button>
                ))}
                <button type="button" role="menuitem" onClick={close}>
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
      {picker && <AddToPlaylistDialog open song={song} onClose={() => setPicker(false)} />}
    </>
  )
}
