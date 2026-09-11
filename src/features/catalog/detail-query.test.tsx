import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { songApi } from '@/features/songs/api/song.api'
import { useSongDetail } from '@/features/songs/hooks/useSongDetail'

const detail = {
  id: 1,
  title: 'Night Signal',
  durationMs: 180_000,
  audioUrl: 'night.mp3',
  playCount: 1,
  artist: { id: 2, name: 'Nocturne' },
}

function createHarness() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return { client, wrapper }
}

afterEach(() => vi.restoreAllMocks())

describe('Phase 5 detail query behavior', () => {
  it('does not request an invalid route id', () => {
    const getSong = vi.spyOn(songApi, 'getSong').mockResolvedValue(detail)
    const { wrapper } = createHarness()
    const { result } = renderHook(() => useSongDetail(null), { wrapper })
    expect(result.current.fetchStatus).toBe('idle')
    expect(getSong).not.toHaveBeenCalled()
  })

  it('reuses fresh detail cache across mounts', async () => {
    const getSong = vi.spyOn(songApi, 'getSong').mockResolvedValue(detail)
    const { wrapper } = createHarness()
    const first = renderHook(() => useSongDetail(1), { wrapper })
    await waitFor(() => expect(first.result.current.isSuccess).toBe(true))
    first.unmount()
    const second = renderHook(() => useSongDetail(1), { wrapper })
    expect(second.result.current.data?.title).toBe('Night Signal')
    expect(getSong).toHaveBeenCalledTimes(1)
  })

  it('does not retry a 404 detail response', async () => {
    const getSong = vi
      .spyOn(songApi, 'getSong')
      .mockRejectedValue({ status: 404, kind: 'unknown', message: 'Not found' })
    const { wrapper } = createHarness()
    const { result } = renderHook(() => useSongDetail(404), { wrapper })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(getSong).toHaveBeenCalledTimes(1)
  })
})
