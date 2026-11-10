# Musicapp - Modern Music Streaming Web Application

> A high-performance, responsive music streaming Single Page Application inspired by Spotify. Built with React 19, TypeScript, Vite 8, and Tailwind CSS v4, featuring uninterrupted audio playback, synchronized lyrics, adaptive artwork backdrops, and creator/admin workspaces.

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646C99?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=flat-square&logo=react-query&logoColor=white)](https://tanstack.com/query)
[![Zustand](https://img.shields.io/badge/Zustand-v5-764ABC?style=flat-square&logoColor=white)](https://zustand-demo.pmnd.rs/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

---

## Table of Contents

- [Project Overview](#1-project-overview)
- [Features](#2-features)
- [Screenshots](#3-screenshots)
- [System Architecture](#4-system-architecture)
- [Tech Stack](#5-tech-stack)
- [Project Structure](#6-project-structure)
- [Getting Started](#7-getting-started)
- [Environment Variables](#8-environment-variables)
- [API Documentation](#9-api-documentation)
- [Testing](#10-testing)
- [Deployment](#11-deployment)
- [Roadmap](#12-roadmap)
- [Contributing](#13-contributing)
- [License](#14-license)
- [Contact](#15-contact)
- [Acknowledgements](#acknowledgements)

---

## 1. Project Overview

### 1.1 Introduction

**Musicapp Frontend** is a modern music streaming client application designed to deliver an authentic Spotify desktop and mobile web experience. It provides listeners with real-time audio playback, interactive synchronized lyrics, a personalized catalog, and complete playlist management. In addition to standard listener capabilities, it includes dedicated portals for verified Artists to publish songs and for Administrators to moderate content.

- **Problem Statement:** Building a web audio streaming application requires solving complex front-end challenges: maintaining persistent audio across client-side page transitions, extracting dynamic color palettes from artwork without performance degradation, synchronizing line-by-line lyrics with audio element timestamps, and managing JWT access token refreshes concurrently without disrupting user playback.
- **Solution:** A decoupled React 19 Single Page Application (SPA) powered by Vite, Zustand for audio and session state, TanStack Query for server cache synchronization, and custom HTML5 Audio / MediaSession integrations.
- **Target Users:** Music listeners, independent artists publishing audio tracks, and platform content moderators.
- **Main Objectives:** Ensure zero playback interruption, instantaneous page transitions, responsive design across mobile/desktop, and robust error recovery.

### 1.2 Project Objectives

- **Uninterrupted Audio Engine:** Global playback state machine persisting through all client route navigations, supporting track queueing, repeat modes, shuffle algorithms, and OS-level media keys.
- **Adaptive Visual Aesthetics:** Dynamic backdrop engine that samples dominant color palettes from album artwork in real time to generate soft gradient atmospheres.
- **Interactive Lyrics:** Timed, scroll-synchronized lyrics view supporting both full-screen theater mode and compact sidebar panels.
- **Resilient Network Architecture:** Concurrency-safe Axios interceptor that queues pending requests during silent token refresh cycles, ensuring zero 401 logout loops.

### 1.3 Project Scope

- **Included Features:** User authentication, personalized music feeds, song/album/artist discovery, persistent audio player bar, custom playlist CRUD, artist follow system, liked songs, playback tracking, artist application workflow, and admin moderation dashboard.
- **Supported Platforms:** Modern web browsers (Chrome, Firefox, Safari, Edge) across Desktop, Tablet, and Mobile viewport sizes.
- **Backend Service:** Connects to the [Musicapp Backend REST API](https://github.com/Minhhau32223/Music_project) (Spring Boot 3 + PostgreSQL + Cloudinary).
- **Future Scope:** Offline audio caching via Service Workers and WebSockets for collaborative listening parties.

### 1.4 Project Status

- **Development Stage:** Production-Ready Client Application.
- **Implemented Modules:** Auth & Role Guard System, Audio Engine & MediaSession, Full Catalog Explorer, User Library, Artist Studio, and Admin Moderation.

---

## 2. Features

### 2.1 Core Features

- **Continuous Audio Playback:** Sticky global player bar that remains active across all routing changes with zero stutter or buffer loss.
- **Queue & Playback Modes:** Supports dynamic queue management, track scrubbing, volume control, shuffle, repeat-all, and repeat-single.
- **Synchronized Lyrics Viewer:** Real-time synchronized lyrics highlighting the active singing line with smooth auto-scrolling.
- **Dynamic Artwork Palette Extraction:** Automatically calculates dominant colors from album covers to tint the top banner and backdrop.
- **Media Session Integration:** Native OS integration supporting lock-screen controls, notification thumbnails, and keyboard hardware media keys.

### 2.2 User Features

- **Authentication & Authorization:** Credential login, registration with Zod schema validation, and automatic session revival on browser reload.
- **Personalized Music Discovery:** Home feeds displaying popular hits, new releases, personalized recommendations, and artist discographies.
- **Custom Playlists:** Create playlists, edit titles and descriptions, add/remove songs with optimistic UI updates.
- **Favorites & Follows:** One-click heart toggle for songs and follow/unfollow functionality for artist profiles.
- **Recently Played History:** Automatically captures played tracks and provides quick-resume listings.

### 2.3 Administrative & Creator Features

- **Artist Application Portal:** Allows listeners to apply for verified artist status by submitting a bio, stage name, and portfolio image.
- **Artist Workspace:** Approved artists can upload MP3 audio files, cover artwork, and lyrics, and organize songs into albums.
- **Admin Moderation Console:** Review pending artist applications and inspect submitted audio tracks with one-click approval or rejection.

### 2.4 Additional Features

- **Debounced Instant Search:** Multi-entity query engine searching songs, artists, and albums simultaneously with query history caching.
- **Keyboard Shortcuts:** Spacebar play/pause, arrow keys for track scrubbing, and volume adjustment shortcuts.
- **Song Context Menus:** Right-click context menus for quick actions (Add to Queue, Add to Playlist, Go to Artist).
- **Responsive Layout:** Adaptive sidebar for desktop, top bar with breadcrumb history, and bottom tab bar on mobile screens.

---

## 3. Screenshots

### 3.1 Home Page

```text
+------------------------------------------------------------------------------------+
|  [Sidebar]       |  [TopBar: Search, Navigation, Profile]                         |
|  - Home          +-----------------------------------------------------------------+
|  - Search        |  Good evening                                                   |
|  - Your Library  |  [Liked Songs] [Top Hits 2026] [Chill Vibes] [Acoustic Daily]   |
|  - Playlists     +-----------------------------------------------------------------+
|                  |  Featured Charts                                                |
|                  |  [Card: Top 50]  [Card: Viral Hits]  [Card: New Releases]       |
+------------------+-----------------------------------------------------------------+
|  [PlayerBar: Album Art | Song Title - Artist | Play/Pause/Seek | Volume & Queue]   |
+------------------------------------------------------------------------------------+
```

_Rich atmospheric home screen with adaptive background gradients and personalized cards._

### 3.2 Main Features (Player & Synchronized Lyrics)

```text
+------------------------------------------------------------------------------------+
|  [Expanded Player / Lyrics View]                                                  |
|                                                                                    |
|       [Album Artwork]             Line 1: In the quiet of the morning...          |
|                                 > Line 2: The melody begins to rise... < (Active)  |
|                                   Line 3: Carrying memories of yesterday...        |
|                                   Line 4: Through the open window...               |
|                                                                                    |
+------------------------------------------------------------------------------------+
|  [PlayerBar: Song Title | 01:24 ━━━●──────────── 03:45 | Shuffle / Repeat / Volume]|
+------------------------------------------------------------------------------------+
```

_Synchronized lyrics viewer with auto-scroll and full-screen theater backdrop._

### 3.3 Administrative Interface

- **Artist Studio:** Manage track uploads, upload audio files, and edit lyrics.
- **Admin Review Console:** Dedicated view to approve or reject pending artist applications and song uploads.

### 3.4 Responsive Design

- **Desktop (1024px+):** Three-column layout with sidebar, main viewport, and collapsible queue/lyrics drawer.
- **Tablet (768px - 1023px):** Compact sidebar with icon shortcuts and responsive track tables.
- **Mobile (< 768px):** Bottom navigation dock, full-screen expandable mini-player drawer, and touch-optimized controls.

---

## 4. System Architecture

### 4.1 Architecture Overview

The frontend is architected as a modular, feature-driven Single Page Application (SPA):

```
+-------------------------------------------------------------------------+
|                               UI LAYER                                  |
|         Pages / AppShell / Dynamic Backdrop / Modals / PlayerBar        |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                        APPLICATION STATE LAYER                          |
|   Zustand (Player & Auth Stores)  |  TanStack Query (Server Cache)      |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                       NETWORK & DATA ACCESS LAYER                       |
|       Axios Client | Silent Refresh Queue | Normalized API Errors       |
+------------------------------------+------------------------------------+
                                     |
                                     | HTTPS / JSON / Cookies
                                     v
+-------------------------------------------------------------------------+
|                     BACKEND REST API & CDN MEDIA                        |
|        Spring Boot 3 REST API      |       Cloudinary Audio CDN         |
+------------------------------------+------------------------------------+
```

### 4.2 Main Components

- **Player Engine (`features/player`):** Custom HTML5 Audio manager handling audio buffer events, time updates, error recovery, and MediaSession OS metadata.
- **Auth Store (`features/auth`):** Zustand store maintaining user session, authentication status, and token lifecycle.
- **Server Cache (`lib/query-client`):** TanStack Query coordinating queries, automatic invalidation scopes, and optimistic cache mutations.
- **API Client (`lib/api`):** Central Axios instance with interceptors for attaching Bearer tokens and orchestrating concurrency-safe silent token refreshes via HttpOnly cookies.

### 4.3 Request Flow

1. **API Requests:** Application queries trigger requests via Axios through `/api/**`.
2. **Local Development Proxy:** Vite forwards `/api` requests to the local Spring Boot backend running on `http://127.0.0.1:8000`.
3. **Token Interception:** If a 401 error occurs, the refresh manager queues pending calls, requests `/api/auth/refresh` silently, updates the token, and replays all original requests.
4. **Media Streaming:** Song playback streams MP3 files directly from Cloudinary CDN URLs with HTTP Range request support for instant seeking.

### 4.4 Design Principles

- **Feature-Sliced Organization:** Logic is grouped by domain features (`features/player`, `features/playlists`, `features/workspace`) rather than generic technical roles.
- **Decoupled Business Logic:** UI components consume custom hooks; API calls and data mappers are isolated from rendering components.
- **Optimistic Updates:** Library actions (likes, playlist updates) reflect immediately in the UI before network requests complete.
- **Design Token System:** Global CSS custom properties (`styles/tokens.css`) power consistent typography, colors, and dark mode styling.

---

## 5. Tech Stack

### 5.1 Frontend Core

| Technology                                    | Version   | Purpose                                                   |
| --------------------------------------------- | --------- | --------------------------------------------------------- |
| [React](https://react.dev/)                   | 19.x      | Component-based User Interface library                    |
| [TypeScript](https://www.typescriptlang.org/) | 5.x / 6.x | Static typing and compile-time error detection            |
| [Vite](https://vitejs.dev/)                   | 8.x       | High-speed frontend build tool and dev server             |
| [Tailwind CSS](https://tailwindcss.com/)      | v4        | Utility-first styling engine and design token integration |
| [React Router](https://reactrouter.com/)      | v7        | Declarative client-side routing and protected routes      |

### 5.2 State Management & Networking

| Technology                                   | Version | Purpose                                                      |
| -------------------------------------------- | ------- | ------------------------------------------------------------ |
| [TanStack Query](https://tanstack.com/query) | v5      | Asynchronous server state caching, pagination, and mutations |
| [Zustand](https://zustand-demo.pmnd.rs/)     | v5      | Lightweight global state for Player and Auth sessions        |
| [Axios](https://axios-http.com/)             | 1.x     | HTTP client with automatic silent refresh interceptors       |

### 5.3 UI & Animation

| Technology                                                                | Purpose                                                |
| ------------------------------------------------------------------------- | ------------------------------------------------------ |
| [Framer Motion](https://www.framer.com/motion/)                           | Smooth spring physics animations and modal transitions |
| [Lucide React](https://lucide.dev/)                                       | Consistent, lightweight SVG icon collection            |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Form handling and runtime validation schemas           |

### 5.4 Testing & Quality Tools

| Technology                                                                      | Purpose                                                 |
| ------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [Vitest](https://vitest.dev/) & [Testing Library](https://testing-library.com/) | Unit and component testing framework                    |
| [Playwright](https://playwright.dev/)                                           | End-to-end browser testing and accessibility compliance |
| [Oxlint](https://oxc.rs/) & [ESLint](https://eslint.org/)                       | High-speed code quality and linting verification        |
| [Prettier](https://prettier.io/)                                                | Automated code formatting                               |

---

## 6. Project Structure

```text
spotify_clone_front/
├── .github/workflows/          # GitHub Actions CI/CD workflows
├── e2e/                        # Playwright end-to-end tests
├── public/                     # Static public assets (icons, favicons)
├── scripts/                    # Bundle analysis & maintenance scripts
├── src/
│   ├── app/                    # Application shell, router, providers
│   │   ├── config/             # Environment configuration parser
│   │   ├── App.tsx             # Root component
│   │   ├── providers.tsx       # QueryClient and Toast providers
│   │   └── router.tsx          # Route definitions & guards
│   ├── components/             # Reusable UI components
│   │   ├── layout/             # AppShell, Sidebar, TopBar, MobileNav
│   │   ├── shared/             # MusicCard, SongRow, Artwork, DynamicBackdrop
│   │   └── ui/                 # Button, Input, Modal, Avatar, Badge, Toast
│   ├── features/               # Feature-sliced domain modules
│   │   ├── albums/             # Album detail, hooks, queries, DTOs
│   │   ├── artists/            # Artist discography, hooks, queries
│   │   ├── auth/               # Login/Register forms, auth store, guards
│   │   ├── catalog/            # Catalog sections, recommendations
│   │   ├── favorites/          # Liked songs hook and mutation toggles
│   │   ├── history/            # Playback tracking & recently played
│   │   ├── library/            # User library & followed artists
│   │   ├── player/             # Audio engine, queue, lyrics, controls
│   │   ├── playlists/          # Playlist CRUD dialogs and hooks
│   │   ├── search/             # Debounced multi-entity search
│   │   ├── songs/              # Song cards, lists, detail views
│   │   └── workspace/          # Artist upload studio & Admin moderation
│   ├── hooks/                  # Custom React hooks (artwork color, online status)
│   ├── lib/                    # Core utilities (Axios client, refresh queue, cn)
│   ├── pages/                  # Page route containers
│   ├── styles/                 # Tailwind CSS tokens and global styles
│   ├── test/                   # Test setup and MSW mock configurations
│   ├── types/                  # Shared data models and contracts
│   ├── main.tsx                # Client entry point
│   └── vite-env.d.ts           # Vite type declarations
├── Dockerfile                  # Multi-stage production container build
├── nginx.conf                  # Production Nginx reverse proxy configuration
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── vercel.json                 # Vercel deployment routing configuration
├── vite.config.ts              # Vite configuration and dev proxy settings
└── README.md                   # Project documentation
```

---

## 7. Getting Started

### 7.1 Prerequisites

Ensure you have the following installed on your local development machine:

- **Node.js:** `v20.x` or `v22.x LTS`
- **npm:** `v10.x+` (or `pnpm` / `yarn`)
- **Git**
- **Backend Service:** Running instance of [Musicapp Backend](https://github.com/Minhhau32223/spotify_clone_back) at `http://localhost:8000` (optional if using mock data).

### 7.2 Clone the Repository

```bash
git clone https://github.com/Minhhau32223/music_front.git
cd music_front
```

### 7.3 Configure Environment Variables

Create a local environment file `.env.local` in the project root:

```env
# .env.local
VITE_API_URL=/api
VITE_DEV_API_PROXY_TARGET=http://127.0.0.1:8000
```

> **Note:** During local development (`npm run dev`), Vite proxies all `/api` requests to `VITE_DEV_API_PROXY_TARGET` to prevent CORS issues.

### 7.4 Install Dependencies

```bash
npm install
```

### 7.5 Run the Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173`.

### 7.6 Build for Production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

### 7.7 Verify the Installation

1. Navigate to `http://localhost:5173` in your browser.
2. Verify that song cards render on the Home page.
3. Click any track card to verify that the **Player Bar** appears and begins playing audio.
4. Click the lyrics icon to toggle the **Synchronized Lyrics** panel.
5. Register a new account at `/register` to test authentication and library features.

---

## 8. Environment Variables

### 8.1 Configuration Reference

| Variable                    | Description                                                                                                                                    | Required | Default / Example                                               |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------- |
| `VITE_API_URL`              | Base API URL. In local development, use `/api` to leverage the Vite proxy. In production (e.g. Vercel), set to the absolute backend HTTPS URL. | Yes      | `/api` _(Local)_ <br> `https://api.yourdomain.com/api` _(Prod)_ |
| `VITE_DEV_API_PROXY_TARGET` | Target backend URL forwarded by the local Vite dev proxy server.                                                                               | Dev Only | `http://127.0.0.1:8000`                                         |

### 8.2 Security & Build Verification

- **No Secrets in Frontend:** The frontend is a client-side Single Page Application; never place private API secrets or private encryption keys in `VITE_` variables.
- **Strict Vercel Build Gate:** The Vite build configuration automatically fails if deployed to production with `VITE_API_URL` set to `localhost`, `127.0.0.1`, or unencrypted `http://`. Production deployments must target an absolute HTTPS URL ending in `/api`.
- **Environment Isolation:** Do not commit `.env` or `.env.local` files to Git. The `.gitignore` file is configured to exclude all environment files.

---

## 9. API Documentation & Integration

### 9.1 API Overview

- **Base URL:** `/api` (local proxy) or `https://<backend-domain>/api` (production)
- **Response Format:** JSON
- **Authentication:** `Authorization: Bearer <access_token>` header
- **Session Refresh:** Handled automatically via `withCredentials: true` using a secure `HttpOnly` refresh token cookie.

### 9.2 API Endpoints Consumed by Frontend

| Feature       | Method | Endpoint                   | Description                            |
| ------------- | ------ | -------------------------- | -------------------------------------- |
| **Auth**      | `POST` | `/api/auth/login`          | Authenticate user credentials          |
| **Auth**      | `POST` | `/api/auth/register`       | Register a new account                 |
| **Auth**      | `POST` | `/api/auth/refresh`        | Silently issue fresh access token      |
| **Auth**      | `POST` | `/api/auth/logout`         | Invalidate session                     |
| **Catalog**   | `GET`  | `/api/songs`               | Fetch paginated songs with filters     |
| **Catalog**   | `GET`  | `/api/songs/{id}`          | Fetch song metadata and lyrics         |
| **Catalog**   | `GET`  | `/api/albums/{id}`         | Fetch album details and track list     |
| **Catalog**   | `GET`  | `/api/artists/{id}`        | Fetch artist biography and discography |
| **Search**    | `GET`  | `/api/search`              | Multi-entity debounced search          |
| **Favorites** | `GET`  | `/api/favorites/me`        | Fetch user liked songs                 |
| **Favorites** | `POST` | `/api/favorites/{songId}`  | Heart / unheart a track                |
| **Playlists** | `GET`  | `/api/playlists/me`        | List user playlists                    |
| **Playlists** | `POST` | `/api/playlists`           | Create custom playlist                 |
| **History**   | `GET`  | `/api/recently-played/me`  | Fetch recently played tracks           |
| **Workspace** | `POST` | `/api/artist-applications` | Submit artist application              |
| **Workspace** | `POST` | `/api/artist/songs`        | Upload new song with audio & lyrics    |
| **Admin**     | `GET`  | `/api/admin/applications`  | Review artist applications             |

### 9.3 Authentication Lifecycle

```text
[User Action] ──> API Call (Bearer Token)
                     │
              (401 Unauthorized?)
              ├── No  ──> Render Data
              └── Yes ──> Queue Request
                            │
                            v
                  POST /api/auth/refresh (Cookie)
                            │
                     (Refresh Success?)
                     ├── Yes ──> Update Token & Replay Queued Requests
                     └── No  ──> Clear Session & Redirect to /login
```

---

## 10. Testing

### 10.1 Testing Strategy

- **Unit & Component Testing:** Tests individual UI components, formatters, and utility functions using Vitest and React Testing Library.
- **Store & Hook Testing:** Validates Zustand player state transitions, queue shuffling algorithms, and authentication stores.
- **Integration Testing:** Tests API client interceptors and error handling via Mock Service Worker (MSW).
- **End-to-End Testing:** Automates critical user journeys (login, song playback, search) using Playwright.

### 10.2 Running Tests

```bash
# Run unit and component tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run TypeScript type check
npm run typecheck

# Run linters
npm run lint

# Run Playwright E2E smoke tests
npm run test:e2e

# Run accessibility compliance tests
npm run test:a11y
```

### 10.3 Test Coverage

- Route guard access control (`ProtectedRoute`, `GuestRoute`, `RoleRoute`).
- Audio playback engine, shuffle utilities, and queue mutations.
- Silent token refresh queue and network error normalization.
- Form validation schemas for login and registration.

---

## 11. Deployment

### 11.1 Deployment Architecture

```
                       [Users / Clients]
                               │
                               ▼
               +-------------------------------+
               |    Cloudflare / Vercel Edge   |
               +---------------+---------------+
                               │
                +--------------+--------------+
                │                             │
                ▼                             ▼
+-------------------------------+ +-------------------------------+
|       Frontend (SPA)          | |        Backend API Node       |
|    Vercel / Nginx Container   | |     Spring Boot REST API      |
+-------------------------------+ +---------------+---------------+
                                                  │
                                                  ▼
                                  +-------------------------------+
                                  |    Cloudinary / Media CDN     |
                                  |      (MP3s & Artwork)         |
                                  +-------------------------------+
```

### 11.2 Deploying to Vercel

1. Import this repository into **Vercel**.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Under **Settings → Environment Variables**, add:
   - `VITE_API_URL`: `https://<your-backend-domain>/api`
     _(Must be an absolute HTTPS URL)._
6. Deploy the project.
7. Add the generated Vercel domain (e.g. `https://your-project.vercel.app`) to the backend `CORS_ALLOWED_ORIGINS`.

### 11.3 Deploying with Docker & Nginx

```bash
# Build the production Docker image
docker build -t spotify-clone-front .

# Run the container on port 80
docker run -d -p 80:80 --name spotify-front spotify-clone-front
```

The bundled `nginx.conf` handles client-side SPA routing (`try_files $uri $uri/ /index.html`) and enables gzip compression for static assets.

### 11.4 CI/CD Pipeline

The repository includes automated GitHub Actions workflows (`.github/workflows/frontend.yml`) running:

- Type checking (`npm run typecheck`)
- Lint checks (`npm run lint`)
- Automated test suites (`npm run test`)

---

## 12. Roadmap

### Completed

- [x] Responsive layout with adaptive desktop sidebar and mobile navigation.
- [x] Continuous audio playback engine with volume, progress seeking, and queue modes.
- [x] Synchronized lyrics viewer with animated auto-scrolling.
- [x] Real-time adaptive backdrop color extraction from artwork.
- [x] JWT authentication with concurrency-safe silent refresh interceptors.
- [x] Role-Based Access Control (`USER`, `ARTIST`, `ADMIN`).
- [x] Debounced multi-entity search across songs, artists, and albums.
- [x] Custom playlist creation and track manipulation.
- [x] Artist Studio (audio upload, cover artwork, and lyrics).
- [x] Admin Content Moderation and artist verification console.
- [x] Production Dockerfile and Nginx SPA routing.

### In Progress

- [ ] Drag-and-drop playlist reordering.
- [ ] Offline audio playback using IndexedDB and Service Workers.

### Planned

- [ ] WebSockets for collaborative real-time listening rooms.
- [ ] Adaptive bitrate audio streaming via HLS.
- [ ] Equalizer audio customization filters.

---

## 13. Contributing

Contributions are welcomed. To ensure quality:

1. **Fork the Repository**
2. **Create a Feature Branch:**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes:**
   ```bash
   git commit -m "feat: Add new audio visualization wave"
   ```
4. **Push to the Branch:**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request** describing your additions and test results.

### Code Guidelines

- Strict TypeScript mode enabled; avoid `any`.
- Adhere to the feature-sliced folder structure.
- Verify that `npm run typecheck` and `npm run lint` pass cleanly before submitting PRs.

---

## 14. License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 15. Contact

- **Author:** Minh Hậu (Minhhau32223)
- **GitHub:** [@Minhhau32223](https://github.com/Minhhau32223)
- **Frontend Repository:** [https://github.com/Minhhau32223/music_front](https://github.com/Minhhau32223/music_front)
- **Backend Repository:** [https://github.com/Minhhau32223/Music_project](https://github.com/Minhhau32223/Music_project)

---

## Acknowledgements

- [Spotify Web Player](https://open.spotify.com) for visual and interaction design inspiration.
- [Lucide Icons](https://lucide.dev) for lightweight iconography.
- [Tailwind CSS](https://tailwindcss.com) for utility styling and modern tokens.
- [TanStack](https://tanstack.com) and [Poimandres](https://github.com/pmndrs) for state and query tooling.
- The open source communities behind React and Vite.
