# Phase 10 performance baseline

## Method

- Local Docker stack, production frontend build, desktop viewport (1440 × 900).
- Cold and warm cache are evaluated with the browser's normal cache state; API timing is captured from the local proxy.
- Core Web Vitals need a production field-data source in Phase 12, so this phase records local build and request baselines rather than inventing LCP, CLS, or INP figures.

## Before changes

| Area               | Measurement            |                   Before |                   Target / after | Notes                                                   |
| ------------------ | ---------------------- | -----------------------: | -------------------------------: | ------------------------------------------------------- |
| Initial JavaScript | Vite production output |                647.21 KB |            331.98 KB entry chunk | Feature pages now load only when their route is opened. |
| Home API requests  | Catalog sections       | 5 catalog + current user |            no duplicate requests | TanStack Query already dedupes equal keys.              |
| Search cache       | `staleTime`            |                     45 s |                 45 s / 10 min GC | Query is normalized and cancellation-aware.             |
| Audio              | HTML audio preload     |                 metadata |                         metadata | No full-queue preload.                                  |
| Redis top songs    | backend TTL            |                    5 min | frontend remains shorter (3 min) | Frontend must not outlive backend freshness.            |
| Redis new releases | backend TTL            |                   10 min | frontend remains shorter (5 min) | Verified in `RedisConfig`.                              |

## Cache policy

| Data                          | Cache scope                     | `staleTime` | `gcTime` |
| ----------------------------- | ------------------------------- | ----------: | -------: |
| Current user                  | private, cleared on logout      |       2 min |   30 min |
| Song / album / artist detail  | public catalog                  |       5 min |   30 min |
| Top songs                     | public catalog                  |       3 min |   30 min |
| New releases                  | public catalog                  |       5 min |   30 min |
| Search                        | query-normalized public catalog |        45 s |   10 min |
| Personalized songs            | user-id key                     |       1 min |   10 min |
| Playlists, favorites, follows | private, cleared on logout      |     1–2 min |   30 min |

## Decisions

- Keep pagination and do not virtualize: current API payloads and visible list sizes are small; virtualizing now would hurt keyboard navigation and scroll restoration without measured benefit.
- Keep player progress isolated in Zustand selectors; route pages do not select `currentTimeMs`.
- Use intent-only prefetch (150 ms, non-touch) for song, artist, and album detail; no catalog-wide prefetch.
- Cloudinary URLs receive size-aware transforms; other image origins remain untouched.
- Backend Redis currently caches only top songs (5 min) and new releases (10 min). Detail and personalized responses have no verified Redis TTL, so their frontend cache stays bounded but is not presented as Redis-aligned.

## Regression budget

| Signal                   |                            Budget | Guard                                                       |
| ------------------------ | --------------------------------: | ----------------------------------------------------------- |
| Router entry JavaScript  |         ≤ 350 KB (raw Vite chunk) | production build output                                     |
| Feature route chunk      |          ≤ 15 KB for normal pages | production build output                                     |
| Home initial data        |                  ≤ 6 API requests | browser network audit                                       |
| Duplicate query requests |            0 for equal query keys | TanStack Query/request-count tests                          |
| Search requests          |      one per settled 350 ms query | manual/request-count test                                   |
| LCP / CLS / INP          | ≤ 2.5 s / ≤ 0.1 / ≤ 200 ms at p75 | Phase 12 field data; local tests do not fabricate field CWV |
