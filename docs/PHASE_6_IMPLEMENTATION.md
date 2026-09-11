# Phase 6 — Playlist, Library & Favorites

## Backend contract used

- Playlists: `GET /playlists/`, `GET /playlists/{id}`, `GET /playlists/{id}/songs`, `POST /playlists/create`, `PUT /playlists/{id}` as multipart form data, `DELETE /playlists/{id}`, and owner-only add/remove-song endpoints.
- Favorites: `GET /favorites/me`, `POST /favorites/{songId}`, and `DELETE /favorites/{songId}`.
- Followed artists: `GET /artist-follows/me/`, `POST /artist-follows/{artistId}/`, and `DELETE /artist-follows/{artistId}/`.

The public playlist list returns every playlist, so the personal Library and Sidebar filter by the authenticated user's `id`. Deep-linked playlists owned by another user remain read-only and playable.

## Implemented behavior

- Real Library tabs for Playlists, Liked Songs, and Followed Artists, with URL-backed type and A–Z sort state.
- Playlist create, rename, delete, add-song, and remove-song flows with owner permission gating.
- Shared favorite state and artist follow state backed by TanStack Query.
- Optimistic favorite, follow, rename, delete, add, and remove updates with rollback and scoped cache invalidation.
- Duplicate add/favorite `409` responses are reconciled as an already-complete state.
- Playlist deletion does not modify the global player queue.
- Accessible dialogs support Escape, focus trapping, focus return, and destructive confirmation.

## Contract-limited behavior

- No saved-album tab because there is no saved-album endpoint.
- No playlist description, owner name, timestamps, or reliable track count because the response does not expose them.
- No drag reorder because the backend exposes neither position metadata nor a reorder endpoint. The UI preserves the order returned by the backend.
- No public playlist discovery or collaboration features.
