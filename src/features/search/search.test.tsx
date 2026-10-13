import { act, renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { searchApi } from './api/search.api'
import { mapSearchResponse } from './api/search.mapper'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import {
  clearRecentSearches,
  readRecentSearches,
  removeRecentSearch,
  saveRecentSearch,
} from './recent-searches'

const songDto = {
  id: 11,
  name: 'Đêm Không Ngủ',
  file: 'https://audio.test/dem-khong-ngu.mp3',
  image: null,
  lyrics: null,
  duration: '3:05',
  playCount: 42,
  albumId: 12,
  artistId: 13,
  albumName: 'Thành Phố Mưa',
  artistName: 'Linh',
}

let observedKeyword = ''
const server = setupServer(
  http.get('http://localhost:8000/api/search', ({ request }) => {
    observedKeyword = new URL(request.url).searchParams.get('keyword') ?? ''
    return HttpResponse.json({
      songs: [songDto],
      albums: [
        {
          id: 12,
          name: 'Thành Phố Mưa',
          image: null,
          description: null,
          bgColor: null,
        },
      ],
      artists: [{ id: 13, name: 'Linh', bio: null, profileImage: null }],
    })
  }),
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => {
  window.localStorage.clear()
  observedKeyword = ''
})
afterEach(() => {
  server.resetHandlers()
  vi.useRealTimers()
})
afterAll(() => server.close())

describe('Phase 7 search contract', () => {
  it('maps only the entity groups supported by the runtime OpenAPI contract', () => {
    const result = mapSearchResponse({ songs: [songDto], albums: [], artists: [] })
    expect(result).toMatchObject({
      totalCount: 1,
      songs: [
        {
          title: 'Đêm Không Ngủ',
          artist: { id: 13, name: 'Linh' },
          album: { id: 12, title: 'Thành Phố Mưa' },
        },
      ],
      albums: [],
      artists: [],
    })
    expect(result).not.toHaveProperty('playlists')
  })

  it('trims the UI query and adapts it to the backend keyword parameter', async () => {
    await expect(searchApi.search('  Đêm Không Ngủ  ')).resolves.toMatchObject({ totalCount: 3 })
    expect(observedKeyword).toBe('Đêm Không Ngủ')
  })

  it('debounces values without losing the current draft', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 350), {
      initialProps: { value: 'đê' },
    })
    rerender({ value: 'đêm' })
    expect(result.current).toBe('đê')
    act(() => vi.advanceTimersByTime(349))
    expect(result.current).toBe('đê')
    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe('đêm')
  })

  it('deduplicates, limits, removes, and clears recent searches', async () => {
    for (let index = 0; index < 10; index += 1) saveRecentSearch(`  Tìm kiếm ${index}  `)
    saveRecentSearch('tìm KIẾM 5')

    await waitFor(() => expect(readRecentSearches()).toHaveLength(8))
    expect(readRecentSearches()[0]).toBe('tìm KIẾM 5')
    expect(removeRecentSearch('tìm KIẾM 5')).not.toContain('tìm KIẾM 5')
    clearRecentSearches()
    expect(readRecentSearches()).toEqual([])
  })
})
