# Phase 4 implementation record

## Audio delivery contract

- `Song.file` is mapped once from the backend DTO to `Song.audioUrl`, then converted to the stable `PlayableTrack` contract.
- Current catalog audio is delivered from public Cloudinary `https` URLs; player controls never read a raw backend DTO.
- A live catalog audio URL was verified with `Content-Type: audio/mpeg`, `Accept-Ranges: bytes`, permissive CORS, and a `206 Partial Content` response for a byte-range request.
- Backend catalog durations can currently be `00:00`; the player uses that value only as an initial fallback and replaces it with valid browser metadata after `loadedmetadata`.

## Implemented scope

- One reusable `HTMLAudioElement` behind `AudioEngine`.
- Global Zustand player state, context-aware queue, previous/next, repeat, Fisher-Yates shuffle, add/play-next/remove/clear queue behavior, and stale-generation guards.
- Play, pause, resume, seek, drag preview, duration/progress, volume, mute, retry, buffering, offline, source, network, and format error handling.
- Desktop/tablet player bar, responsive queue drawer, mobile mini player, mobile expanded player, safe-area handling, keyboard controls, and Media Session progressive enhancement.
- Validated local persistence for queue, current track/index, position, volume, mute, shuffle, and repeat. Reload restores a paused session and never autoplays.
- Player is mounted in `AppShell`, outside routed page content, and Home song sections call the player command API with their full list context.

## Verification and known limits

- Automated queue, shuffle, store, engine, component, catalog integration, auth, and API tests pass.
- Lint, formatting, and production TypeScript/Vite build pass.
- Direct audio MIME/CORS/range behavior was verified against the real CDN source.
- Cross-tab pausing through `BroadcastChannel` remains the optional Phase 4 enhancement and is not enabled.
- Physical Android/iOS and Safari device playback were not available in this environment and remain device QA items.
