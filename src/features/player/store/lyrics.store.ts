import { create } from 'zustand'
type LyricsState = {
  target: number | 'current' | null
  open: (target: number | 'current') => void
  close: () => void
}
export const useLyricsStore = create<LyricsState>((set) => ({
  target: null,
  open: (target) => set({ target }),
  close: () => set({ target: null }),
}))
