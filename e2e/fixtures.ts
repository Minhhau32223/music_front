import type { Page } from '@playwright/test'
export async function mockBackend(
  page: Page,
  role: 'USER' | 'ARTIST' | 'ADMIN' = 'USER',
  signedIn = true,
) {
  const requests: string[] = []
  let authenticated = signedIn
  let liked = false
  let application: Record<string, unknown> | null = null
  let playlists: { id: number; name: string; userId: number; image: null }[] = []
  let playlistSongs: unknown[] = []
  const song = {
    id: 1,
    name: 'Test song',
    file: 'https://audio.test/test.wav',
    image: '',
    lyrics: 'Test lyrics',
    duration: '00:00',
    playCount: 0,
    albumId: 1,
    artistId: 1,
    albumName: 'Test album',
    artistName: 'Test artist',
  }
  const album = { id: 1, name: 'Test album', image: '', description: 'Test', bgColor: '#15131f' }
  const artist = { id: 1, name: 'Test artist', bio: 'Test bio', profileImage: '' }
  const pending = {
    id: 3,
    userId: 3,
    artistName: 'Applicant',
    bio: 'Test biography',
    profileImage: 'https://example.com/test.png',
    status: 'PENDING',
    submittedAt: '2026-10-01T12:00:00',
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: null,
  }
  let reviewed = false
  await page.route('**/api/**', async (route) => {
    const request = route.request()
    const path = new URL(request.url()).pathname.replace(/^\/api/, '')
    const method = request.method()
    requests.push(`${method} ${path}`)
    const respond = (body: unknown, status = 200) =>
      route.fulfill({
        status,
        contentType: 'application/json',
        headers: {
          'Access-Control-Allow-Origin': 'http://127.0.0.1:4173',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Headers': '*',
        },
        body: JSON.stringify(body),
      })
    if (method === 'OPTIONS') return respond({})
    if (path === '/auth/refresh/')
      return respond(authenticated ? { accessToken: 'test-token' } : {}, authenticated ? 200 : 401)
    if (path === '/auth/login/') {
      authenticated = true
      return respond({
        id: 1,
        username: 'Tester',
        email: 'test@example.com',
        accessToken: 'test-token',
      })
    }
    if (path === '/auth/logout/') {
      authenticated = false
      return respond({})
    }
    if (path === '/users/me/')
      return respond({
        id: 1,
        username: 'Tester',
        email: 'test@example.com',
        role,
        active: true,
        avatarUrl: null,
      })
    if (path === '/songs/filter')
      return respond({
        content: [song],
        pageNumber: 0,
        pageSize: 6,
        totalPages: 1,
        totalElements: 1,
        last: true,
      })
    if (path === '/songs/1/') return respond(song)
    if (path === '/artists/') return respond([artist])
    if (path === '/albums/') return respond([album])
    if (path === '/albums/1/') return respond(album)
    if (path === '/albums/1/songs/') return respond([song])
    if (path.startsWith('/recommendations/')) return respond([song])
    if (path === '/search') return respond({ songs: [song], artists: [artist], albums: [album] })
    if (path === '/favorites/me') return respond(liked ? [song] : [])
    if (path === '/favorites/1') {
      liked = method === 'POST'
      return respond({})
    }
    if (path === '/artist-follows/me/') return respond([])
    if (path === '/recently-played/me') return respond([])
    if (path === '/recently-played/play') return respond({})
    if (path === '/playlists/') return respond(playlists)
    if (path === '/playlists/create') {
      const body = request.postDataJSON()
      const created = { id: 1, name: body.name, image: null, userId: 1 }
      playlists = [created]
      return respond(created)
    }
    if (path === '/playlists/1') return respond(playlists[0])
    if (path === '/playlists/1/songs') {
      if (method === 'POST') playlistSongs = [song]
      return respond(method === 'POST' ? null : playlistSongs)
    }
    if (path === '/playlists/1/songs/1' && method === 'DELETE') {
      playlistSongs = []
      return respond(null)
    }
    if (path === '/artist-applications/me') return respond(application ? [application] : [])
    if (path === '/artist-applications' && method === 'POST') {
      application = { ...pending, ...request.postDataJSON() }
      return respond(application)
    }
    if (path === '/artist/profile') return respond(artist)
    if (path === '/artist/albums' || path === '/artist/songs') return respond([])
    if (path === '/admin/artist-applications') return respond(reviewed ? [] : [pending])
    if (path === '/admin/songs/pending' || path === '/admin/albums/pending') return respond([])
    if (path.startsWith('/admin/artist-applications/3/')) {
      reviewed = true
      return respond({
        ...pending,
        status: path.endsWith('/approve') ? 'APPROVED' : 'REJECTED',
        rejectionReason: request.postData() ? request.postDataJSON().rejectionReason : null,
      })
    }
    if (path === '/stream/song/1/play') {
      const frames = 44100 * 4
      const audio = Buffer.alloc(44 + frames * 2)
      audio.write('RIFF', 0)
      audio.writeUInt32LE(audio.length - 8, 4)
      audio.write('WAVEfmt ', 8)
      audio.writeUInt32LE(16, 16)
      audio.writeUInt16LE(1, 20)
      audio.writeUInt16LE(1, 22)
      audio.writeUInt32LE(44100, 24)
      audio.writeUInt32LE(88200, 28)
      audio.writeUInt16LE(2, 32)
      audio.writeUInt16LE(16, 34)
      audio.write('data', 36)
      audio.writeUInt32LE(frames * 2, 40)
      const range = request.headers()['range']?.match(/bytes=(\d+)-(\d*)/)
      const start = range ? Number(range[1]) : 0
      const end = range?.[2] ? Math.min(Number(range[2]), audio.length - 1) : audio.length - 1
      return route.fulfill({
        status: range ? 206 : 200,
        contentType: 'audio/wav',
        headers: {
          'Accept-Ranges': 'bytes',
          ...(range ? { 'Content-Range': `bytes ${start}-${end}/${audio.length}` } : {}),
        },
        body: audio.subarray(start, end + 1),
      })
    }
    return respond({ message: `Unhandled fixture: ${method} ${path}` }, 404)
  })
  return requests
}
