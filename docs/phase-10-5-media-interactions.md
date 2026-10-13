# Phase 10.5 — Backend-aligned media interactions

## Implemented

- Shared song-action registry for cards, rows, player and queue. Right-click is scoped to song surfaces; More offers the same actions. Keyboard navigation, Escape and focus restoration; mobile bottom sheet.
- Audio sources use the configured API base plus `/stream/song/{id}/play`. Runtime duration comes from audio metadata, independently of legacy DTO duration. Restored queues migrate their URLs and remain paused.
- Queue entries have distinct identities even for duplicate songs. Play Next takes priority in shuffle; append and Clear Upcoming preserve the active source.
- Play history is recorded after real playing, once per audio generation, authenticated only. Resume, time updates and repeat-one do not duplicate recording; failed history writes are not blindly retried.
- Lyrics use cached song detail (`lyrics`), preserve line breaks, follow the active song from the player, and expose loading/empty/error/retry states without storing full lyrics in player state.
- Playlist picker remains owner-filtered; empty mutation responses remain valid and 403 gives permission-specific feedback.
- Catalog and playback allow guests; private library and mutations require authentication. Artist albums inferred from loaded songs are explicitly labeled as partial.

## Validation

- Vitest: 24 files, 88 tests passed.
- Lint and TypeScript/Vite production build passed.
- Browser: real Docker-backed Home catalog; right-click menu; real lyrics; playback/resume with metadata duration; mobile 390×844 bottom sheet; playlist picker; expanded player.
- Existing Docker database and Redis volumes retained. No schema migration, import, or data reset performed.

## Boundaries

- No download, synchronized lyrics, persisted playlist reorder, private-playlist feature, playlist search, or invented artist-albums endpoint.
- Mutation permission failures and playback edge cases are covered with automated tests; no destructive edits to real playlists were performed during browser QA.
- Browser smoke checks are not an exhaustive device/accessibility audit.
