import { readdir, stat, readFile } from 'node:fs/promises'
const files = await readdir('dist/assets')
const html = await readFile('dist/index.html', 'utf8')
const entry = html.match(/src="\/assets\/([^" ]+\.js)"/)?.[1]
if (!entry) throw new Error('Entry script missing')
const routes =
  /^(?:HomePage|ProfilePage|NotFoundPage|ApplicationPage|ArtistWorkspace|AdminWorkspace|AlbumDetailPage|ArtistDetailPage|LikedSongsPage|LibraryPage|PlaylistPage|SongPage|PhaseSevenSearchPage)-/
for (const name of files.filter((name) => name === entry || routes.test(name))) {
  const size = (await stat(`dist/assets/${name}`)).size
  const max = name === entry ? 350_000 : 15_000
  console.log(`${name}: ${size} / ${max} bytes`)
  if (size > max) throw new Error(`Bundle budget exceeded: ${name}`)
}
if (files.some((name) => /UIPlayground|mock-data|ArtistPage-|AlbumPage-/.test(name)))
  throw new Error('Development-only bundle emitted')
