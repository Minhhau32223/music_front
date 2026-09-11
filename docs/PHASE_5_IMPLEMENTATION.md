# NOCTURNE Phase 5 implementation

## Delivered routes

- `/artist/:artistId`: real artist profile, top songs sorted by backend `playCount`, releases, biography and context-aware playback.
- `/album/:albumId`: real album hero, artist relationship derived from returned tracks, ordered track list, description and context-aware playback.
- `/song/:songId`: real song metadata plus play now, play next and add-to-queue actions.

All three routes validate positive integer IDs before querying, use cancellable React Query requests, cache detail data for five minutes and never retry a `400` or `404` response.

## Backend contract decisions

- `GET /api/albums/{id}/` does not expose artist, release date, release year, release type or track count. The UI does not invent these fields. It derives the artist and count only after `GET /api/albums/{id}/songs/` succeeds.
- Album songs do not expose `trackNumber`, disc number or an explicit ordering contract. The UI preserves the array order returned by `/api/albums/{id}/songs/` and uses its one-based display position only as a list index.
- There is no artist-releases endpoint. Artist discography is derived from distinct album relationships returned by the artist's songs endpoint. It remains a separate query so its loading/error state is isolated from the artist header and popular songs.
- Lyrics, follows, likes, downloads, credits and other unsupported mutations are intentionally absent.

## Navigation and playback

- Artist, album and song cards prefetch primary detail data after a 150 ms mouse/keyboard intent delay; touch hover does not trigger prefetch.
- Track rows and global Now Playing metadata provide semantic links to real artist, album and song routes.
- Track-row playback replaces the queue with the visible artist/album context and begins at the selected row. Song detail uses only the Phase 4 Player Commands API.
- Forward navigation scrolls the main workspace to the top; browser Back/Forward restores the remembered position for each history entry.

## Verification

- API mapping and route-ID guard tests.
- Detail page rendering, unsupported-metadata omission and player queue behavior tests.
- Album order preservation and artwork-color sanitization tests.
- Full frontend lint, formatting, test and production build checks.
