import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

function validateVercelApiUrl(value: string | undefined) {
  if (!value) {
    throw new Error(
      'VITE_API_URL is required for Vercel. Set it to your public backend API URL, for example https://api.example.com/api.',
    )
  }

  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new Error('VITE_API_URL must be an absolute HTTPS backend URL when deploying to Vercel.')
  }

  if (url.protocol !== 'https:' || /^(localhost|127\.0\.0\.1)$/i.test(url.hostname)) {
    throw new Error(
      'VITE_API_URL must point to a public HTTPS backend, never localhost, on Vercel.',
    )
  }

  if (!url.pathname.replace(/\/+$/, '').endsWith('/api')) {
    throw new Error(
      'VITE_API_URL must include the /api path, for example https://api.example.com/api.',
    )
  }
}

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), '')
  if (process.env.VERCEL === '1') validateVercelApiUrl(environment.VITE_API_URL)

  return {
    plugins: [react(), tailwindcss()],
    resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
    server: {
      proxy: {
        '/api': {
          target: environment.VITE_DEV_API_PROXY_TARGET || 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
      },
    },
  }
})
