import { defineConfig, devices } from '@playwright/test'

const port = 4173

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    // Serve the web-apps root: the harness loads apps/ and vendor/ from source.
    command: `npx http-server ../.. -a 127.0.0.1 -p ${port} -c-1 --silent`,
    url: `http://127.0.0.1:${port}/test/playwright/harness/index.html`,
    reuseExistingServer: !process.env.CI,
  },
})
