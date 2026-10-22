# Spotify Clone - Music Streaming Web Application

> A high-performance, modern music streaming platform inspired by Spotify, featuring real-time audio playback, interactive lyrics, artist & admin management workspaces, and responsive design.

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646C99?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=flat-square&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
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

**Spotify Clone** is a full-featured music streaming web application designed to replicate and expand upon the core user experience of Spotify. The platform enables users to discover, stream, organize, and interact with music tracks, albums, and playlists seamlessly across devices.

- **Problem Statement:** Building modern streaming web applications requires handling asynchronous streaming playback, complex audio state management across page transitions, dynamic theme backdrop extraction, and multi-tier access control (Listeners, Creators, Administrators) without compromising speed or user experience.
- **Solution:** A decoupled architecture featuring a reactive, state-driven React 19 Single Page Application (SPA) backed by a high-throughput Spring Boot 3 REST API with PostgreSQL, Redis caching, and Cloudinary media delivery.
- **Target Audience:** Casual music listeners, independent music artists seeking a platform to publish and review their tracks, and platform moderators.
- **Main Objectives:** Deliver zero-latency navigation, persistent uninterrupted background audio playback, resilient token refresh authorization, and intuitive content management.

### 1.2 Project Objectives

- **High-Fidelity Audio Experience:** Continuous playback engine with queue management, progress seeking, volume normalization, lyrics display, and MediaSession OS integration.
- **Enterprise-Grade Security:** JWT authentication with short-lived access tokens and secure HttpOnly cookie-based refresh tokens with concurrency-safe silent refreshes.
- **Role-Based Collaboration:** Dedicated workflows allowing standard users to apply for artist status, artists to upload songs/albums, and administrators to review and approve submissions.
- **Modern Performance:** Sub-second route transitions, optimistic UI updates via TanStack Query, code splitting, lazy loading, and CSS token-based dark mode aesthetics.

### 1.3 Project Scope

- **Included Features:** User authentication, personalized music feed, song/album/artist catalog exploration, full audio player, playlist creation & manipulation, artist follow system, favorite tracks, playback history, artist portal, admin review dashboard.
- **Supported Platforms:** Modern web browsers (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari) across Desktop, Tablet, and Mobile viewport sizes.
- **Current Limitations:** Audio streaming relies on progressive download via direct CDN URLs rather than HLS/DASH adaptive bitrate streaming; payment subscriptions are simulated.
- **Future Expansion:** WebSockets for collaborative real-time listening rooms, lossless audio streaming, and personalized AI recommendation feeds.

### 1.4 Project Status

- **Development Stage:** Active Production-Ready Prototype (Phase 10+ Complete).
- **Implemented Modules:** Auth & Session Manager, Audio Player Engine, Catalog & Search Explorer, User Library, Artist Workspace, Admin Verification & Content Portal.
- **Known Limitations:** Offline playback caching is limited by browser storage quotas; background playback on mobile Safari may be throttled when screen locks.

---

## 2. Features

### 2.1 Core Features

- **Continuous Audio Playback:** Seamless playback bar that persists across routing changes without stutter or audio re-buffering.
- **Advanced Queue & Playback Modes:** Supports track queues, shuffle mode, repeat-one, repeat-all, and next-up scheduling.
- **Synchronized Lyrics Display:** Interactive full-screen or side-panel view showing timed song lyrics with auto-scroll.
- **Adaptive Artwork Theming:** Dynamically extracts dominant palette colors from album art to render vibrant atmospheric background gradients.
- **Media Session API Integration:** Native operating system media controls (lock screen controls, hardware media keys, track notifications).

### 2.2 User Features

- **Authentication & Profiles:** User registration, credential login, automatic session revival, and profile customisation.
- **Personalized Music Feed:** Recommended tracks, latest releases, top popular hits, and genre-based categorisation.
- **Playlist Management:** Create public/private playlists, update titles and descriptions, add/remove songs with instant UI feedback.
- **Favorites & Follows:** Quick heart toggle for songs and follow/unfollow functionality for favorite artists.
- **Playback History:** Automatically logs recently played tracks with timestamps for fast resume.

### 2.3 Administrative Features

- **Artist Application Workflow:** Standard users can submit artist portfolios (stage name, biography, avatar) for review.
- **Artist Workspace:** Approved artists can manage their discography, create albums, and upload new songs with audio files and lyrics.
- **Content Moderation:** Platform administrators can review pending song uploads, inspect lyrics, approve or reject submissions with reason notes.
- **Artist Verification System:** Review artist requests with one-click approval or rejection.

### 2.4 Additional Features

- **Instant Search:** Debounced multi-entity search querying songs, artists, and albums simultaneously with query history caching.
- **Keyboard Shortcuts:** Spacebar play/pause, arrow keys for track scrubbing and volume adjustments.
- **Context Menus:** Right-click song items to add to queue, append to existing playlists, or view artist details.
- **Responsive Navigation:** Collapsible desktop sidebar, top app bar with breadcrumbs and history navigation, and mobile bottom bar.

---

## 3. Screenshots

### 3.1 Home Page

```
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

### 3.2 Main Features

- **Interactive Player & Expanded Lyrics:** Full viewport player with synchronized lyrics and animated canvas gradient backdrops.
- **Dynamic Search & Filtering:** Instant filter chips for All, Songs, Artists, and Albums with debounce.
- **Playlist Detail:** Sticky header with play-all button, duration calculations, track listing, and drag-to-reorder.

### 3.3 Administrative Interface

- **Artist Studio:** Dashboard for uploading MP3 audio, uploading cover art, editing synchronized lyrics, and organizing tracks into albums.
- **Admin Review Console:** Dedicated view for moderators to inspect submitted audio files, review user artist applications, and approve songs for public catalog publication.

### 3.4 Responsive Design

- **Desktop (1024px+):** Three-column layout with fixed sidebar, dynamic content viewport, and optional right-hand queue/lyrics drawer.
- **Tablet (768px - 1023px):** Compact sidebar with icon shortcuts and collapsible track list tables.
- **Mobile (< 768px):** Bottom navigation dock, full-screen expandable mini-player drawer, and touch-optimized swipe controls.

---

## 4. System Architecture

### 4.1 Architecture Overview

The system follows a decoupled Single Page Application (SPA) + RESTful API architecture:

```
+-------------------------------------------------------------------------+
|                              CLIENT TIER                                |
|   React 19 SPA (Vite) + Tailwind CSS + Zustand + TanStack Query         |
+------------------------------------+------------------------------------+
                                     |
                                     | HTTPS / JSON / Cookies
                                     v
+-------------------------------------------------------------------------+
|                              SERVER TIER                                |
|   Spring Boot 3 REST API (Spring Security, JPA, Flyway, Redis)          |
+------------------+------------------------------+-----------------------+
                   |                              |
                   v                              v
+------------------------------------+  +---------------------------------+
|           DATABASE TIER            |  |         STORAGE / CDN           |
|      PostgreSQL 16 (Relational)    |  |     Cloudinary / MinIO (S3)     |
|   Redis (Cache & Refresh Tokens)   |  |   (MP3 Audio & Image Assets)    |
+------------------------------------+  +---------------------------------+
```

### 4.2 Main Components

- **Frontend Client (Vite + React):** Handles presentation, routing, optimistic mutations, audio rendering via Web Audio / HTML5 Audio APIs, and cached global state.
- **Backend API (Spring Boot 3):** Encapsulates core business logic, permissions enforcement, token issuance, and metadata persistence following Clean Architecture principles.
- **Persistence Layer (PostgreSQL):** Stores relational data including users, roles, songs, albums, playlists, track orders, and audit logs.
- **Cache Layer (Redis):** Caches frequent queries (popular tracks, catalog listings) and supports session tracking.
- **Media Storage (Cloudinary / S3 / Static):** High-speed content delivery network for binary streaming assets (audio files, album cover artwork, artist avatars).

### 4.3 Request Flow

1. **Authentication Flow:** User logs in via `/api/auth/login`. Server returns a short-lived access token in the response payload and sets a secure HttpOnly refresh token cookie.
2. **Protected Resource Request:** Client attaches `Authorization: Bearer <token>` in headers. If expired, client's Axios interceptor automatically requests `/api/auth/refresh` silently and retries the original request.
3. **Media Streaming:** Client fetches song metadata (stream URL). The browser's native audio element streams the binary audio directly from the CDN with Range header support for seeking.
4. **Mutations (e.g. Liked Songs, Playlists):** TanStack Query performs optimistic updates on the client UI while dispatching POST/PUT/DELETE requests to the backend.

### 4.4 Design Principles

- **Separation of Concerns:** Frontend views are decoupled from data fetching and audio management via custom hooks and dedicated Zustand stores.
- **Domain-Driven & Feature-Sliced Architecture:** Frontend code is structured by domain feature (`features/player`, `features/auth`, `features/workspace`) rather than flat technical categories.
- **Resilient Offline & Error Recovery:** Integrated error boundaries, automatic query retry strategies, and visual fallback toasts.
- **Stateless Application Servers:** Backend nodes retain no session memory; authorization is strictly cryptographically verified via JWT.

---

## 5. Tech Stack

### 5.1 Frontend

| Technology                                                                | Purpose                                                         |
| ------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [React 19](https://react.dev/)                                            | Component-based User Interface library                          |
| [TypeScript 5/6](https://www.typescriptlang.org/)                         | Static type safety and developer ergonomics                     |
| [Vite 8](https://vitejs.dev/)                                             | Next-generation frontend build tool and dev server              |
| [Tailwind CSS v4](https://tailwindcss.com/)                               | Utility-first styling engine and custom design tokens           |
| [TanStack Query v5](https://tanstack.com/query)                           | Server state synchronization, caching, and optimistic mutations |
| [Zustand](https://zustand-demo.pmnd.rs/)                                  | Lightweight global state management for Player and Auth         |
| [React Router v7](https://reactrouter.com/)                               | Client-side routing, protected routes, and layouts              |
| [Framer Motion](https://www.framer.com/motion/)                           | UI micro-interactions, spring animations, and transitions       |
| [Lucide React](https://lucide.dev/)                                       | Consistent, clean icon collection                               |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Form management and runtime schema validation                   |

### 5.2 Backend

| Technology                                                                | Purpose                                                 |
| ------------------------------------------------------------------------- | ------------------------------------------------------- |
| [Spring Boot 3.5](https://spring.io/projects/spring-boot)                 | Core enterprise backend framework                       |
| [Spring Security 6](https://spring.io/projects/spring-security)           | RBAC security, JWT verification, and CORS configuration |
| [Spring Data JPA / Hibernate](https://spring.io/projects/spring-data-jpa) | Relational Object-Relational Mapping and repositories   |
| [Flyway](https://flywaydb.org/)                                           | Automated database migration version control            |
| [Lombok](https://projectlombok.org/)                                      | Java boilerplate reduction (getters, setters, builders) |
| [Springdoc OpenAPI](https://springdoc.org/)                               | Automated Swagger UI and OpenAPI 3.0 documentation      |

### 5.3 Database and Storage

| Technology                                         | Purpose                                            |
| -------------------------------------------------- | -------------------------------------------------- |
| [PostgreSQL 16](https://www.postgresql.org/)       | Primary relational database storage                |
| [Redis](https://redis.io/)                         | Distributed in-memory cache and session management |
| [Cloudinary / S3 / MinIO](https://cloudinary.com/) | Cloud storage and CDN for audio and image assets   |

### 5.4 Development and Deployment Tools

| Technology                                                                      | Purpose                                                            |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [Git](https://git-scm.com/)                                                     | Distributed version control                                        |
| [Docker & Compose](https://www.docker.com/)                                     | Multi-service local virtualization and production containerization |
| [Vitest](https://vitest.dev/) & [Testing Library](https://testing-library.com/) | Unit and component test runner                                     |
| [Playwright](https://playwright.dev/)                                           | End-to-end and accessibility testing                               |
| [Oxlint & ESLint](https://oxc.rs/)                                              | High-speed JavaScript/TypeScript linting                           |
| [Nginx](https://nginx.org/)                                                     | Reverse proxy and production static asset web server               |

---

## 6. Project Structure

```text
spotify-clone/
├── spotify_clone_front/                # Frontend application (React 19 + Vite)
│   ├── .github/workflows/              # GitHub Actions CI/CD pipelines
│   ├── docs/                           # Architecture, API contracts, phase specs
│   ├── e2e/                            # Playwright end-to-end tests
│   ├── public/                         # Static assets (favicons, icons)
│   ├── scripts/                        # Bundle analysis & maintenance scripts
│   ├── src/
│   │   ├── app/                        # App shell, routing, global providers
│   │   ├── components/                 # Shared UI components (Button, Modal, Input)
│   │   ├── features/                   # Feature slices (player, auth, playlists, workspace)
│   │   │   ├── albums/                 # Album components, queries, types
│   │   │   ├── artists/                # Artist profiles and discography
│   │   │   ├── auth/                   # Login/register forms, auth guards, store
│   │   │   ├── catalog/                # Discovery sections and listings
│   │   │   ├── favorites/              # Liked songs toggling & collection
│   │   │   ├── history/                # Recently played tracking & views
│   │   │   ├── library/                # User library and follow management
│   │   │   ├── player/                 # Audio engine, queue, lyrics, controls
│   │   │   ├── playlists/              # Playlist CRUD, track management
│   │   │   ├── search/                 # Multi-entity debounced search
│   │   │   ├── songs/                  # Track rows, card lists, detail views
│   │   │   └── workspace/              # Artist upload studio & Admin moderation
│   │   ├── hooks/                      # Custom hooks (artwork color, window title)
│   │   ├── lib/                        # Axios instance, error normalization, query client
│   │   ├── pages/                      # Page route containers
│   │   ├── styles/                     # Global styles, token palette, Tailwind CSS
│   │   └── types/                      # Shared data contracts
│   ├── .env.example                    # Environment variable template
│   ├── Dockerfile                      # Production multi-stage Docker build
│   ├── nginx.conf                      # Nginx SPA routing and caching configuration
│   ├── package.json                    # Project dependencies and npm scripts
│   ├── vite.config.ts                  # Vite build and proxy settings
│   └── README.md                       # Frontend documentation
│
└── spotify_clone_back/                 # Backend application (Spring Boot 3)
    ├── src/main/java/com/spotify/      # Clean architecture implementation
    │   ├── domain/                     # Core domain entities and value objects
    │   ├── application/                # Application use cases and service interfaces
    │   ├── infrastructure/             # JPA entities, repos, security, cloud storage
    │   └── presentation/               # REST controllers, request/response DTOs
    ├── src/main/resources/
    │   ├── db/migration/               # Flyway SQL migration scripts
    │   └── application.yml             # Spring profile configurations
    ├── pom.xml                         # Maven build descriptors and dependencies
    └── Dockerfile                      # Backend container configuration
```

### Directory Description

| Directory/File                                | Description                                                                |
| --------------------------------------------- | -------------------------------------------------------------------------- |
| `spotify_clone_front/`                        | Complete React 19 Single Page Application                                  |
| `spotify_clone_front/src/features/`           | Domain-driven feature slices isolating API, components, and state          |
| `spotify_clone_front/src/features/player/`    | Custom HTML5 audio engine, lyrics parser, and queue store                  |
| `spotify_clone_front/src/features/workspace/` | Artist content creation studio and Administrator approval portal           |
| `spotify_clone_front/docs/`                   | Technical specifications, phase progress reports, and API contracts        |
| `spotify_clone_back/`                         | Spring Boot 3 enterprise application and business logic                    |
| `docker-compose.yml`                          | Multi-container configuration for PostgreSQL, Redis, Backend, and Frontend |

---

## 7. Getting Started

### 7.1 Prerequisites

Ensure you have the following installed locally:

- **Node.js:** `v20.x` or `v22.x LTS`
- **npm:** `v10.x+` (or `pnpm` / `yarn`)
- **Java Development Kit (JDK):** `JDK 21 LTS`
- **Maven:** `3.9+` (or use bundled `./mvnw`)
- **PostgreSQL:** `15+` or `16`
- **Redis:** `7.x+` (optional for caching)
- **Git**

### 7.2 Clone the Repository

```bash
git clone https://github.com/Minhhau32223/music_front.git
cd music_front
```

_(To run the full stack, also clone the backend alongside in `spotify_clone_back`):_

```bash
git clone https://github.com/Minhhau32223/spotify_clone_back.git
```

### 7.3 Configure Environment Variables

#### Frontend Configuration

Create a `.env` or `.env.local` file inside the frontend folder:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Ensure the variables match your backend server port:

```env
VITE_API_URL=/api
VITE_DEV_API_PROXY_TARGET=http://127.0.0.1:8000
```

### 7.4 Install Dependencies

#### Frontend

```bash
cd spotify_clone_front
npm install
```

#### Backend

```bash
cd spotify_clone_back
./mvnw clean install -DskipTests
```

_(On Windows PowerShell: `.\mvnw.cmd clean install -DskipTests`)_

### 7.5 Database Setup

1. Start your local PostgreSQL instance and create the target database:
   ```sql
   CREATE DATABASE spotify_clone;
   ```
2. Verify credentials in `spotify_clone_back/src/main/resources/application.yml` or export them as environment variables:
   ```bash
   export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/spotify_clone
   export SPRING_DATASOURCE_USERNAME=postgres
   export SPRING_DATASOURCE_PASSWORD=your_password
   ```
3. Flyway will automatically execute database migrations on backend startup.

### 7.6 Run the Application

#### Start the Backend

```bash
cd spotify_clone_back
./mvnw spring-boot:run
```

_(Backend starts at `http://localhost:8000`)_

#### Start the Frontend

```bash
cd spotify_clone_front
npm run dev
```

_(Frontend starts at `http://localhost:5173`)_

### 7.7 Verify the Installation

1. Open your browser and navigate to `http://localhost:5173`.
2. Browse public songs on the **Home Page**.
3. Click any track card to verify that the **Audio Player** starts playing and the waveform/progress bar activates.
4. Register a new user account at `/register` and log in to test user-specific features (Likes, Playlists).
5. Visit `http://localhost:8000/swagger-ui.html` to explore the interactive backend API documentation.

---

## 8. Environment Variables

### 8.1 Configuration Reference

#### Frontend (`spotify_clone_front`)

| Variable                    | Description                                                                           | Required | Example                 |
| --------------------------- | ------------------------------------------------------------------------------------- | -------- | ----------------------- |
| `VITE_API_URL`              | Base API route (use `/api` in local dev with proxy; absolute HTTPS URL in production) | Yes      | `/api`                  |
| `VITE_DEV_API_PROXY_TARGET` | Target backend URL forwarded by the local Vite dev proxy server                       | Dev Only | `http://127.0.0.1:8000` |

#### Backend (`spotify_clone_back`)

| Variable                     | Description                                          | Required | Example                                                |
| ---------------------------- | ---------------------------------------------------- | -------- | ------------------------------------------------------ |
| `SPRING_DATASOURCE_URL`      | PostgreSQL JDBC connection URL                       | Yes      | `jdbc:postgresql://localhost:5432/spotify_clone`       |
| `SPRING_DATASOURCE_USERNAME` | Database username                                    | Yes      | `postgres`                                             |
| `SPRING_DATASOURCE_PASSWORD` | Database password                                    | Yes      | `secret`                                               |
| `JWT_SECRET`                 | Secret key for signing and verifying JSON Web Tokens | Yes      | `verySecureLongRandomSecretKeyForJwtSigning2026`       |
| `CORS_ALLOWED_ORIGINS`       | Permitted frontend origins for CORS                  | Yes      | `http://localhost:5173,https://your-domain.vercel.app` |
| `CLOUDINARY_URL`             | Media storage cloud configuration URI                | Optional | `cloudinary://<api_key>:<api_secret>@<cloud_name>`     |

### 8.2 Security Notes

- **Never Commit Secrets:** Do not commit actual `.env`, `.env.local`, or configuration files containing passwords or JWT secrets to Git.
- **Strict Production Verification:** The Vite production build automatically aborts on Vercel if `VITE_API_URL` is pointing to `localhost` or uses unencrypted `http://`.
- **HttpOnly Cookies:** Refresh tokens are transmitted exclusively inside `HttpOnly; SameSite=Strict` (or `None` with `Secure` in cross-site prod) cookies to prevent XSS credential exfiltration.
- **Credential Rotation:** Rotate production JWT signing keys immediately if any leak occurs.

---

## 9. API Documentation

### 9.1 API Overview

- **Base URL:** `http://localhost:8000/api` (Local) / `https://api.yourdomain.com/api` (Production)
- **API Specification:** OpenAPI 3.0 via Swagger UI (`/swagger-ui.html`)
- **Authentication Scheme:** `Bearer <JWT_ACCESS_TOKEN>` in `Authorization` header
- **Standard Response Envelope:** JSON payloads; pagination follows `{ content: [], totalElements, totalPages, number, size }`
- **Error Conventions:** Standard format `{ timestamp, status, error, message, path }`

### 9.2 API Endpoints

| Method | Endpoint                       | Description                                           | Authentication |
| ------ | ------------------------------ | ----------------------------------------------------- | -------------- |
| `POST` | `/api/auth/register`           | Register a new user                                   | Public         |
| `POST` | `/api/auth/login`              | Authenticate credentials and receive access token     | Public         |
| `POST` | `/api/auth/refresh`            | Silently exchange refresh cookie for new access token | Refresh Cookie |
| `POST` | `/api/auth/logout`             | Invalidate current session and clear cookies          | Bearer Token   |
| `GET`  | `/api/users/me`                | Fetch authenticated user profile details              | Bearer Token   |
| `GET`  | `/api/songs`                   | Paginated song catalog with filtering and sorting     | Public         |
| `GET`  | `/api/songs/{id}`              | Retrieve individual song metadata and lyrics          | Public         |
| `GET`  | `/api/albums`                  | List published albums with pagination                 | Public         |
| `GET`  | `/api/albums/{id}`             | Retrieve album details and track list                 | Public         |
| `GET`  | `/api/artists`                 | Browse public artist profiles                         | Public         |
| `GET`  | `/api/artists/{id}`            | Get artist biography, discography, and top tracks     | Public         |
| `GET`  | `/api/search`                  | Search across songs, artists, and albums              | Public         |
| `GET`  | `/api/favorites/me`            | Retrieve current user's liked tracks                  | User           |
| `POST` | `/api/favorites/{songId}`      | Heart / unheart a song                                | User           |
| `GET`  | `/api/playlists/me`            | List playlists owned or followed by current user      | User           |
| `POST` | `/api/playlists`               | Create a new custom playlist                          | User           |
| `POST` | `/api/playlists/{id}/songs`    | Add a track to an existing playlist                   | User           |
| `GET`  | `/api/recently-played/me`      | Fetch playback history for current user               | User           |
| `POST` | `/api/artist-applications`     | Submit application to become an artist                | User           |
| `POST` | `/api/artist/songs`            | Upload new song track (Multipart audio + metadata)    | Artist         |
| `GET`  | `/api/admin/applications`      | Review pending artist verification requests           | Admin          |
| `PUT`  | `/api/admin/applications/{id}` | Approve or reject artist application                  | Admin          |

### 9.3 Authentication and Authorization

- **User Roles:**
  - `USER`: Default role. Can stream songs, manage favorites, build playlists, follow artists, and apply for Artist status.
  - `ARTIST`: Includes all User permissions plus access to Artist Workspace for song upload and discography management.
  - `ADMIN`: Full access to Admin Console for moderating song submissions, verifying artist profiles, and platform management.
- **Token Lifecycle:** Access tokens expire every 15 minutes. The frontend Axios interceptor transparently refreshes expired tokens via the secure HttpOnly cookie without user interruption.

### 9.4 Request and Response Examples

#### Login Request

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "musiclover",
  "password": "Password123!"
}
```

#### Successful Response (`200 OK`)

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 900,
  "user": {
    "id": 42,
    "username": "musiclover",
    "email": "user@example.com",
    "role": "USER",
    "avatar": "https://res.cloudinary.com/demo/image/upload/avatar.jpg"
  }
}
```

### 9.5 API Testing Tools

- **Swagger UI:** Directly access and run queries at `http://localhost:8000/swagger-ui.html`.
- **Postman Collection:** Use Postman or Insomnia with environment variable `baseUrl = http://localhost:8000/api`.

---

## 10. Testing

### 10.1 Testing Strategy

The repository follows the testing pyramid principle:

- **Unit Testing:** Validates business logic, state reducers, time formatting, and utility helpers.
- **Component Testing:** Validates UI behaviors and component rendering via React Testing Library and Vitest.
- **Integration Testing:** Tests API client layers and interceptors using Mock Service Worker (MSW).
- **End-to-End Testing:** Automates critical user journeys (Login, Playback, Search) via Playwright.

### 10.2 Running Tests

#### Frontend Unit & Component Tests

```bash
cd spotify_clone_front

# Run all unit tests with Vitest
npm test

# Run tests in watch mode
npm run test:watch

# Run TypeScript typechecks
npm run typecheck

# Run linters
npm run lint
```

#### Frontend End-to-End & Accessibility Tests

```bash
# Run Playwright E2E smoke suite
npm run test:e2e

# Run accessibility compliance tests
npm run test:a11y
```

#### Backend Tests

```bash
cd spotify_clone_back

# Execute JUnit unit & integration tests
./mvnw test
```

### 10.3 Test Coverage

- **Authentication Guards:** Protected, guest, and role-based route guard validations.
- **Audio Engine & Stores:** Queue ordering, shuffle algorithms, persistence, and playback state machines.
- **API Interceptor:** Silent refresh queue handling and network error normalization.
- **Form Schemas:** Login and registration input constraint validations.

### 10.4 Known Issues

- In simulated testing environments without hardware audio output, Web Audio API context may initialize in a suspended state until user interaction.
- Playwright E2E tests require backend services or MSW mocks running concurrently.

---

## 11. Deployment

### 11.1 Deployment Architecture

```
                       [Internet / Clients]
                                |
                                v
               +----------------------------------+
               |     Cloudflare / DNS / SSL       |
               +----------------+-----------------+
                                |
        +-----------------------+-----------------------+
        |                                               |
        v                                               v
+-------------------------------+               +-------------------------------+
|       Frontend Hosting        |               |        Backend Hosting        |
|     (Vercel / AWS Amplify)    |               |    (VPS / Docker / Render)    |
|   Static React 19 Bundle      |               |     Spring Boot 3 REST API    |
+---------------+---------------+               +---------------+---------------+
                |                                               |
                +-------------------> API Proxy <---------------+
                                                                |
                                        +-----------------------+-----------------------+
                                        |                                               |
                                        v                                               v
                        +-------------------------------+               +-------------------------------+
                        |        Database Service       |               |         Cloud Storage         |
                        |     Managed PostgreSQL 16     |               |   Cloudinary / AWS S3 CDN     |
                        +-------------------------------+               +-------------------------------+
```

### 11.2 Deployment Prerequisites

- **Frontend:** Vercel account or VPS with Nginx.
- **Backend:** Cloud VM (e.g. AWS EC2, DigitalOcean) or PaaS (Render, Railway).
- **Database:** Managed PostgreSQL (e.g. Supabase, Neon, AWS RDS).
- **Domain & SSL:** Custom domain with HTTPS configured.

### 11.3 Deployment Steps

#### Deploying Frontend to Vercel

1. Import the `music_front` repository into Vercel.
2. Select Framework Preset: **Vite**.
3. Set Build Command: `npm run build`.
4. Set Output Directory: `dist`.
5. Add Environment Variable:
   - `VITE_API_URL`: Set to your production backend URL (e.g. `https://api.yourdomain.com/api`).
     _(Note: Must be an absolute HTTPS URL)._
6. Deploy the project.
7. Update backend `CORS_ALLOWED_ORIGINS` to include the generated Vercel domain.

#### Deploying Frontend with Docker & Nginx

```bash
cd spotify_clone_front
docker build -t spotify-clone-front .
docker run -d -p 80:80 --name spotify-front spotify-clone-front
```

### 11.4 CI/CD Pipeline

The project includes automated GitHub Actions workflows located in `.github/workflows/`:

- **Continuous Integration (`frontend.yml`):** Automatically triggers on pull requests to `main`, validating typechecks, running linters, and executing tests.
- **Continuous Deployment:** Merges to `main` trigger automated builds and deployment to production hosting.

### 11.5 Monitoring and Maintenance

- **Health Checks:** Monitored via Spring Boot Actuator at `/actuator/health`.
- **Application Logs:** Structured JSON log outputs for integration with Grafana / Loki / Datadog.
- **Database Backups:** Automated daily PostgreSQL snapshots and backup retention.

---

## 12. Roadmap

### Completed

- [x] Complete project initialization with React 19, Vite, and Tailwind CSS v4.
- [x] Persistent continuous HTML5 audio playback bar with volume and seek controls.
- [x] Audio queue management: next up, previous, shuffle mode, repeat modes.
- [x] Synchronized lyrics viewer with animated auto-scroll.
- [x] Adaptive album artwork background gradient extraction.
- [x] User authentication with JWT and secure HttpOnly cookie refresh token rotation.
- [x] Role-Based Access Control (`USER`, `ARTIST`, `ADMIN`).
- [x] Liked songs and custom playlist management with optimistic mutations.
- [x] Debounced multi-entity search for songs, artists, and albums.
- [x] Artist Studio: song upload with audio files, cover artwork, and lyrics.
- [x] Admin Console: artist application reviews and content moderation.
- [x] Containerization with Docker and Nginx reverse proxy configuration.

### In Progress

- [ ] Collaborative real-time listening rooms with WebSockets.
- [ ] Drag-and-drop song reordering inside playlists.
- [ ] Offline audio caching using Service Workers and IndexedDB.

### Planned

- [ ] HLS (HTTP Live Streaming) adaptive bitrate audio streaming.
- [ ] Personalized recommendations powered by vector similarity search.
- [ ] Social activity feed to follow what friends are currently listening to.
- [ ] Artist monetization and simulated subscription tiers.

---

## 13. Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Repository**
2. **Create a Feature Branch:**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes:**
   ```bash
   git commit -m "feat: Add amazing new feature"
   ```
4. **Push to the Branch:**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request** describing your changes.

### Code Guidelines

- **TypeScript:** Strict type checking enabled; avoid using `any`.
- **Code Quality:** Ensure `npm run typecheck`, `npm run lint`, and `npm test` pass before committing.
- **Git Commits:** Follow conventional commit conventions (`feat:`, `fix:`, `refactor:`, `docs:`).

---

## 14. License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 15. Contact

- **Author:** Minh Hậu (Minhhau32223)
- **GitHub:** [@Minhhau32223](https://github.com/Minhhau32223)
- **Frontend Repository:** [https://github.com/Minhhau32223/music_front](https://github.com/Minhhau32223/music_front)
- **Backend Repository:** [https://github.com/Minhhau32223/spotify_clone_back](https://github.com/Minhhau32223/spotify_clone_back)

---

## Acknowledgements

- [Spotify Web Player](https://open.spotify.com) for visual and user experience inspiration.
- [Lucide Icons](https://lucide.dev) for minimalist open-source iconography.
- [Tailwind CSS](https://tailwindcss.com) for modern styling capabilities.
- [TanStack Query](https://tanstack.com) for client asynchronous state management.
- The open source communities behind React, Vite, and Spring Boot.
