import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { mapAlbumDto } from '@/features/albums/api/album.mapper'
import { artistApi } from '@/features/artists/api/artist.api'
import { mapArtistDto } from '@/features/artists/api/artist.mapper'
import { songApi } from '@/features/songs/api/song.api'
import { mapSongDto } from '@/features/songs/api/song.mapper'
import { toPlayableTrack } from '@/features/songs/types/song.types'
import { mapPageResult } from '@/lib/pagination/pagination.types'

const songDto = {
  id: 1,
  name: 'Night Signal',
  file: 'https://audio.test/song.mp3',
  image: null,
  lyrics: null,
  duration: '3:21',
  playCount: 12,
  albumId: 2,
  artistId: 3,
  albumName: 'After Dark',
  artistName: 'Nocturne',
}
const server = setupServer(
  http.get('http://localhost:8000/api/songs/filter', () =>
    HttpResponse.json({
      content: [songDto],
      pageNumber: 0,
      pageSize: 6,
      totalElements: 1,
      totalPages: 1,
      last: true,
    }),
  ),
  http.get('http://localhost:8000/api/artists/', () =>
    HttpResponse.json([{ id: 3, name: 'Nocturne', bio: null, profileImage: null }]),
  ),
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('catalog mapping', () => {
  it('maps backend song and duration to the stable player contract', () => {
    const song = mapSongDto(songDto)
    expect(song).toMatchObject({ title: 'Night Signal', durationMs: 201000, artworkUrl: undefined })
    expect(toPlayableTrack(song)).toMatchObject({ artistId: 3, albumId: 2, audioUrl: songDto.file })
  })
  it('maps nullable artist and album fields', () => {
    expect(mapArtistDto({ id: 1, name: 'A', bio: null, profileImage: null })).toEqual({
      id: 1,
      name: 'A',
      bio: undefined,
      imageUrl: undefined,
    })
    expect(
      mapAlbumDto({ id: 1, name: 'B', image: null, description: null, bgColor: null }),
    ).toMatchObject({ title: 'B', artworkUrl: undefined })
  })
  it('normalizes backend pagination', () => {
    expect(
      mapPageResult(
        { content: [1], pageNumber: 1, pageSize: 1, totalElements: 3, totalPages: 3, last: false },
        String,
      ),
    ).toMatchObject({ items: ['1'], page: 1, hasNext: true, hasPrevious: true })
  })
})

describe('catalog APIs', () => {
  it('maps songs and artists through the central client', async () => {
    await expect(songApi.getLatestSongs(6)).resolves.toMatchObject({
      items: [{ title: 'Night Signal' }],
    })
    await expect(artistApi.getArtists()).resolves.toEqual([
      { id: 3, name: 'Nocturne', bio: undefined, imageUrl: undefined },
    ])
  })
  it('normalizes server failures', async () => {
    server.use(
      http.get(
        'http://localhost:8000/api/songs/filter',
        () => new HttpResponse(null, { status: 500 }),
      ),
    )
    await expect(songApi.getLatestSongs()).rejects.toMatchObject({ status: 500, kind: 'server' })
  })
  it('keeps an empty catalog as successful empty data', async () => {
    server.use(
      http.get('http://localhost:8000/api/songs/filter', () =>
        HttpResponse.json({
          content: [],
          pageNumber: 0,
          pageSize: 6,
          totalElements: 0,
          totalPages: 0,
          last: true,
        }),
      ),
    )
    await expect(songApi.getLatestSongs()).resolves.toMatchObject({ items: [] })
  })
})
