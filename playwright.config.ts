import { defineConfig } from '@playwright/test';

// Run against a fresh production build, or an explicitly supplied preview URL.
const external = process.env.PLAYWRIGHT_BASE_URL;
export default defineConfig({
  testDir: './tests',
  testMatch: '**/portal.spec.ts',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: 2,
  retries: process.env.CI ? 1 : 0,
  outputDir: 'test-results/portal',
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    browserName: 'chromium',
    baseURL: external || 'http://127.0.0.1:4321',
    colorScheme: 'light',
    permissions: ['clipboard-read', 'clipboard-write'],
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {},
  },
  webServer: external ? undefined : {
    command: 'npm run build && npm run preview -- --port 4321 --ignore-lock',
    env: { ASTRO_TELEMETRY_DISABLED: '1' },
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
