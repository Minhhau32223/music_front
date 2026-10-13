import { ExpandedPlayer } from './ExpandedPlayer'
import { MiniPlayer } from './MiniPlayer'
import { PlayerBar } from './PlayerBar'
import { PlayerRuntime } from './PlayerRuntime'
import { LyricsPanel } from './LyricsPanel'

export function GlobalPlayer() {
  return (
    <>
      <PlayerRuntime />
      <PlayerBar />
      <MiniPlayer />
      <ExpandedPlayer />
      <LyricsPanel />
    </>
  )
}
