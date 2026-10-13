const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()
const isProduction = import.meta.env.PROD
const isLocalhostUrl = configuredApiUrl?.match(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\b/i)

if (isProduction && isLocalhostUrl) {
  throw new Error(
    'VITE_API_URL points to localhost in production. Set the public backend URL in Vercel and redeploy.',
  )
}

export const env = {
  apiBaseUrl: configuredApiUrl || '/api',
} as const


