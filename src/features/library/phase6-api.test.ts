import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { favoriteApi } from '@/features/favorites/api/favorite.api'
import { playlistApi } from '@/features/playlists/api/playlist.api'
import { canEditPlaylist } from '@/features/playlists/types/playlist.types'
import { libraryApi } from './api/library.api'

const songDto = {
  id: 9,
  name: 'After Midnight',
  file: 'after-midnight.mp3',
  image: null,
  lyrics: null,
  duration: '3:12',
  playCount: 17,
  albumId: 4,
  artistId: 2,
  albumName: 'Night Lines',
  artistName: 'Nocturne',
}

let createdName = ''
let updatedName = ''

const server = setupServer(
  http.get('http://localhost:8000/api/playlists/', () =>
    HttpResponse.json([{ id: 3, name: 'Night Drive', image: null, userId: 7 }]),
  ),
  http.get('http://localhost:8000/api/playlists/3/songs', () =>
    HttpResponse.json([songDto, { ...songDto, id: 4, name: 'Blue Hour' }]),
  ),
  http.post('http://localhost:8000/api/playlists/create', async ({ request }) => {
    createdName = String(((await request.json()) as { name: string }).name)
    return HttpResponse.json({ id: 8, name: createdName, image: null, userId: 7 })
  }),
  http.put('http://localhost:8000/api/playlists/3', async ({ request }) => {
    const form = await request.formData()
    updatedName = String(form.get('name'))
    return HttpResponse.json({ id: 3, name: updatedName, image: null, userId: 7 })
  }),
  http.get('http://localhost:8000/api/favorites/me', () => HttpResponse.json([songDto])),
  http.get('http://localhost:8000/api/artist-follows/me/', () =>
    HttpResponse.json([{ id: 2, name: 'Nocturne', bio: 'Dark pop', profileImage: null }]),
  ),
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  createdName = ''
  updatedName = ''
  server.resetHandlers()
})
afterAll(() => server.close())

describe('Phase 6 API contracts', () => {
  it('maps playlist ownership and preserves backend track order', async () => {
    await expect(playlistApi.getPlaylists()).resolves.toEqual([
      expect.objectContaining({ id: 3, name: 'Night Drive', ownerId: 7 }),
    ])
    const tracks = await playlistApi.getPlaylistTracks(3)
    expect(tracks.map((track) => track.song.id)).toEqual([9, 4])
    expect(tracks.map((track) => track.position)).toEqual([0, 1])
  })

  it('uses JSON for create and multipart PUT for the backend update contract', async () => {
    await expect(playlistApi.createPlaylist({ name: 'Focus' })).resolves.toMatchObject({
      id: 8,
      name: 'Focus',
    })
    await expect(playlistApi.updatePlaylist(3, { name: 'Renamed' })).resolves.toMatchObject({
      id: 3,
      name: 'Renamed',
    })
    expect(createdName).toBe('Focus')
    expect(updatedName).toBe('Renamed')
  })

  it('maps favorites and followed artists into shared catalog entities', async () => {
    await expect(favoriteApi.getLikedSongs()).resolves.toEqual([
      expect.objectContaining({ id: 9, title: 'After Midnight' }),
    ])
    await expect(libraryApi.getFollowedArtists()).resolves.toEqual([
      expect.objectContaining({ id: 2, name: 'Nocturne' }),
    ])
  })

  it('grants playlist editing only to its owner', () => {
    expect(canEditPlaylist({ ownerId: 7 }, 7)).toBe(true)
    expect(canEditPlaylist({ ownerId: 7 }, 8)).toBe(false)
    expect(canEditPlaylist({ ownerId: 7 })).toBe(false)
  })
})
