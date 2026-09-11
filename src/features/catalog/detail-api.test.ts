import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { albumApi } from '@/features/albums/api/album.api'
import { artistApi } from '@/features/artists/api/artist.api'
import { songApi } from '@/features/songs/api/song.api'
import { retryDetailQuery } from '@/lib/query-retry'
import { parseEntityId } from '@/lib/route-params'

const songs = [
  {
    id: 9,
    name: 'Second Track',
    file: 'second.mp3',
    image: null,
    lyrics: null,
    duration: '2:05',
    playCount: 5,
    albumId: 2,
    artistId: 3,
    albumName: 'After Dark',
    artistName: 'Nocturne',
  },
  {
    id: 4,
    name: 'First Track',
    file: 'first.mp3',
    image: 'cover.jpg',
    lyrics: null,
    duration: '3:10',
    playCount: 8,
    albumId: 2,
    artistId: 3,
    albumName: 'After Dark',
    artistName: 'Nocturne',
  },
]

const server = setupServer(
  http.get('http://localhost:8000/api/artists/3/', () =>
    HttpResponse.json({ id: 3, name: 'Nocturne', bio: 'Dark pop', profileImage: null }),
  ),
  http.get('http://localhost:8000/api/albums/2/', () =>
    HttpResponse.json({
      id: 2,
      name: 'After Dark',
      image: 'cover.jpg',
      description: 'A nocturnal record',
      bgColor: '#201044',
    }),
  ),
  http.get('http://localhost:8000/api/albums/2/songs/', () => HttpResponse.json(songs)),
  http.get('http://localhost:8000/api/songs/4/', () => HttpResponse.json(songs[1])),
  http.get('http://localhost:8000/api/songs/filter', () =>
    HttpResponse.json({
      content: songs,
      pageNumber: 0,
      pageSize: 100,
      totalElements: 2,
      totalPages: 1,
      last: true,
    }),
  ),
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Phase 5 detail APIs', () => {
  it('maps artist, album and song details without exposing DTO field names', async () => {
    await expect(artistApi.getArtist(3)).resolves.toMatchObject({
      id: 3,
      name: 'Nocturne',
      bio: 'Dark pop',
    })
    await expect(albumApi.getAlbum(2)).resolves.toMatchObject({
      id: 2,
      title: 'After Dark',
      backgroundColor: '#201044',
    })
    await expect(songApi.getSong(4)).resolves.toMatchObject({
      id: 4,
      title: 'First Track',
      durationMs: 190_000,
    })
  })

  it('preserves the album track order returned by the backend', async () => {
    const tracks = await albumApi.getAlbumTracks(2)
    expect(tracks.map((track) => track.id)).toEqual([9, 4])
  })

  it('derives real releases from artist songs and removes duplicate albums', async () => {
    await expect(artistApi.getArtistReleases(3)).resolves.toEqual([
      expect.objectContaining({ id: 2, title: 'After Dark', artistId: 3 }),
    ])
  })
})

describe('detail request guards', () => {
  it('accepts only safe positive route ids', () => {
    expect(parseEntityId('12')).toBe(12)
    expect(parseEntityId('0')).toBeNull()
    expect(parseEntityId('-1')).toBeNull()
    expect(parseEntityId('12x')).toBeNull()
    expect(parseEntityId('999999999999999999999')).toBeNull()
  })

  it('does not retry a missing resource but retries one transient failure', () => {
    expect(retryDetailQuery(0, { status: 404, kind: 'unknown', message: 'Not found' })).toBe(false)
    expect(retryDetailQuery(0, new Error('network'))).toBe(true)
    expect(retryDetailQuery(1, new Error('network'))).toBe(false)
  })
})
