# API contract V1 — local integration freeze

Base URL: `VITE_API_URL=http://localhost:8000/api`.

## Rules

- Send `Authorization: Bearer <accessToken>` for protected calls. The refresh cookie is HttpOnly; frontend must use `withCredentials`.
- Roles are `USER`, `ARTIST`, and `ADMIN`; the backend enforces role plus ownership.
- Catalog, search, recommendations, album songs, and streaming only expose `PUBLISHED` content.
- Song list uses zero-based `page`, `size` from 1 to 100, whitelisted sort fields, and `PageResponse`.
- Error body is `{ timestamp, status, error, message, path, errors? }`.
- Artist create/update requests use multipart form data; client must not submit `artistId`, `status`, `publishedAt`, or moderation fields.

## Canonical local commands

```powershell
docker compose -f docker-compose.local.yml up -d
$env:SPRING_PROFILES_ACTIVE='local'; .\mvnw.cmd spring-boot:run
```

```env
VITE_API_URL=http://localhost:8000/api
```

Production packaging, deployment, and CI/CD changes are intentionally out of this contract freeze.

