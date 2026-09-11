import { ExpandedPlayer } from './ExpandedPlayer'
import { MiniPlayer } from './MiniPlayer'
import { PlayerBar } from './PlayerBar'
import { PlayerRuntime } from './PlayerRuntime'

export function GlobalPlayer() {
  return (
    <>
      <PlayerRuntime />
      <PlayerBar />
      <MiniPlayer />
      <ExpandedPlayer />
    </>
  )
}
