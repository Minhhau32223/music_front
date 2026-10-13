import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
  projects:
    process.platform === 'win32'
      ? [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
      : [
          { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
          { name: 'mobile-webkit', use: { ...devices['iPhone 13'] } },
        ],
})
