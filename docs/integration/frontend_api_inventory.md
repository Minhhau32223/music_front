# Frontend API inventory — SYNC-2

Source: `C:\Learning\spotify_clone_front\src` audit on 2026-09-13.

| Feature          | Frontend call                                        | Backend endpoint                        | Status           |
| ---------------- | ---------------------------------------------------- | --------------------------------------- | ---------------- |
| Auth             | `authApi` register/login/refresh/logout/current user | `/auth/**`, `/users/me/`                | DONE             |
| Catalog          | `songApi`, `albumApi`, `artistApi`                   | songs filter/detail, albums, artists    | DONE             |
| Discovery        | `searchApi`, popular/new/personalized song queries   | search and recommendations              | DONE             |
| Player           | player store uses `Song.file` Cloudinary URL         | metadata URL; no Spring proxy required  | DONE             |
| Favorite         | `favoriteApi`                                        | `/favorites/me`, `/{songId}`            | DONE             |
| Playlist         | `playlistApi`                                        | `/playlists/**`                         | DONE             |
| Follow           | library API                                          | `/artist-follows/**`                    | DONE             |
| Recently played  | no production API service found                      | `/recently-played/**`                   | MISSING CONSUMER |
| Artist workspace | no API service found                                 | `/artist-applications/**`, `/artist/**` | MISSING CONSUMER |
| Admin workspace  | no API service found                                 | `/api/admin/**`                         | MISSING CONSUMER |

`mock-data` is only referenced by `UIPlaygroundPage`, `ArtistPage`, and `AlbumPage`; these routes must be replaced or labelled development-only before the mock-removal gate.
