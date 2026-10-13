# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Music App deployment

The frontend reads the backend URL only from the Vite variable `VITE_API_URL`.

Local development:

```env
# .env.local
VITE_API_URL=http://localhost:8000/api
```

Vercel:

1. Import this repository as a Vite project.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Add `VITE_API_URL=https://<backend-domain>/api` in the Production environment variables.
5. Redeploy after changing the variable; Vite injects it at build time.

Do not commit real credentials or `.env` files. The backend must allow the final Vercel origin in `CORS_ALLOWED_ORIGINS` and use secure cross-site cookies in production.

