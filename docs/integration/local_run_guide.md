# Local run guide

1. In backend: `docker compose -f docker-compose.local.yml up -d`.
2. Start backend with `SPRING_PROFILES_ACTIVE=local` and its required `.env` values.
3. Frontend `.env.development` sets `VITE_API_URL=http://localhost:8000/api`.
4. Run `npm run dev` in the frontend repository.

Check `/actuator/health`, then register/login and open Home, Search, Library and a Song page. Docker runs PostgreSQL and Redis only; Spring Boot and Vite run directly for debugging.

