# NOCTURNE Phase 3 catalog contract

Audited against the running Spring Boot application on 2026-09-09.

| Purpose                | Method and path                                 | Auth   | Shape                                                       |
| ---------------------- | ----------------------------------------------- | ------ | ----------------------------------------------------------- |
| Paginated/latest songs | GET `/api/songs/filter`                         | Public | `PageResponse<SongResponse>`                                |
| Song list/detail       | GET `/api/songs/`, `/api/songs/{id}/`           | Public | array/object                                                |
| Popular songs          | GET `/api/recommendations/top-songs?limit=N`    | Public | `SongResponse[]`, ordered by `playCount DESC, id ASC`       |
| New releases           | GET `/api/recommendations/new-releases?limit=N` | Public | `SongResponse[]`, ordered by song `createdAt DESC, id DESC` |
| Albums                 | GET `/api/albums/`                              | Public | `AlbumResponse[]`                                           |
| Artists                | GET `/api/artists/`                             | Public | `ArtistResponse[]`                                          |

`SongResponse`: `id, name, file, image, lyrics, duration, playCount, albumId, artistId, albumName, artistName`.
`AlbumResponse`: `id, name, image, description, bgColor`.
`ArtistResponse`: `id, name, bio, profileImage`.
`PageResponse`: `content, pageNumber, pageSize, totalElements, totalPages, last`.

Song filters support `artistId`, `albumId`, `sortBy` (`playCount|id|createdAt|name`),
`sortDirection` (`ASC|DESC`), zero-based `page`, and `size` from 1 to 100.

The backend has no artist popularity endpoint or artist ranking metric. The Home label is therefore
`Artists`, not `Popular Artists`. New releases are song-ranked; the frontend maps their album
identity into unique `AlbumSummary` values. Audio and image fields are backend-returned URLs.
Errors use the Phase 2 normalized error layer.

## Phase 5 detail contract

Audited against the running Spring Boot application on 2026-09-10.

| Purpose         | Method and path                                                                           | Auth   | Path/query                             | Response and nullable fields                                                                         | Failure/order behavior                                                                                                    |
| --------------- | ----------------------------------------------------------------------------------------- | ------ | -------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Artist identity | GET `/api/artists/{id}/`                                                                  | Public | `id`: positive integer                 | `ArtistResponse`; `bio`, `profileImage` nullable                                                     | Unknown ID returns 404                                                                                                    |
| Artist tracks   | GET `/api/songs/filter?artistId={id}&page=0&size=100&sortBy=playCount&sortDirection=DESC` | Public | positive `artistId`; page size max 100 | `PageResponse<SongResponse>`                                                                         | Popularity order is explicitly requested from the backend                                                                 |
| Artist releases | GET `/api/songs/filter?artistId={id}&page=0&size=100&sortBy=createdAt&sortDirection=DESC` | Public | positive `artistId`                    | `PageResponse<SongResponse>` mapped to distinct non-null album relations                             | No dedicated release endpoint; frontend derives releases without inventing type/date                                      |
| Album identity  | GET `/api/albums/{id}/`                                                                   | Public | `id`: positive integer                 | `AlbumResponse`; `image`, `description`, `bgColor` nullable                                          | Unknown ID returns 404; no artist/date/type fields                                                                        |
| Album tracks    | GET `/api/albums/{id}/songs/`                                                             | Public | `id`: positive integer                 | `SongResponse[]`                                                                                     | Empty array is valid; repository exposes no explicit `trackNumber` or sort contract, so frontend preserves response order |
| Song identity   | GET `/api/songs/{id}/`                                                                    | Public | `id`: positive integer                 | `SongResponse`; `image`, `lyrics`, `albumId`, `albumName`, `artistName`, `playCount` may be nullable | Unknown ID returns 404                                                                                                    |

All returned image/audio values are URL strings owned by the backend response. Public GET routes do not require an access token and normally do not produce 403; the frontend still presents a dedicated 403 state if policy changes. Detail errors are normalized before reaching UI code.
