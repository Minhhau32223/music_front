# API gap analysis — SYNC-3

## Resolved / compatible

- Frontend Axios base URL defaults to `http://<host>:8000/api`, matching local Spring Boot.
- Frontend DTO adapters map backend `name`, `file`, `image`, `albumId`, `artistId`, `albumName`, and `artistName` correctly.
- Refresh endpoint and cookie-based session client exist on both sides.
- Frontend error normalizer accepts backend's `message` and `errors` fields.
- Filter pagination fields match `PageResponse`.

## Work queued by integration quota

| Severity | Gap                                                                                                            | Owner        | Quota             |
| -------- | -------------------------------------------------------------------------------------------------------------- | ------------ | ----------------- |
| P0       | Artist workspace has no frontend service, types, routes, or mutations for the implemented moderation contract. | Frontend     | 8                 |
| P0       | Admin moderation/application queue has no frontend consumer.                                                   | Frontend     | 9                 |
| P1       | Recently played API has no frontend playback event integration.                                                | Frontend     | 7                 |
| P1       | `ArtistPage` and `AlbumPage` still consume mock data.                                                          | Frontend     | mock-removal gate |
| P1       | Existing `api_summary.md` does not document refresh/logout, moderation, or canonical status lifecycle.         | Backend docs | SYNC-4            |
| P2       | Catalog list APIs outside songs are unpaginated; retain until data size requires a breaking V2 contract.       | Backend      | future            |

No endpoint, method, or DTO mismatch blocks Quotas 1–6. Do not add Artist/Admin UI until Quotas 1–7 have local integration evidence.
