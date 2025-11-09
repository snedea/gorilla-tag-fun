import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration
 * Gorilla Tag Fun Math Game
 *
 * Tests run on Chrome, Firefox, Safari, and iPad viewport
 * to ensure cross-browser compatibility for 2nd grade students.
 */
export default defineConfig({
  testDir: './tests/e2e',

  // Run tests in parallel for faster execution
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html'],
    ['list'],
    ...(process.env.CI ? [['github']] : [])
  ],

  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: 'http://localhost:5173',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Record video on failure
    video: 'retain-on-failure',

    // Maximum time each action can take
    actionTimeout: 10000,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 }
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 }
      },
    },

    // Test against iPad Pro viewport (primary target device)
    {
      name: 'ipad',
      use: {
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 1366 }
      },
    },

    // Test against standard tablet viewport (minimum supported)
    {
      name: 'tablet',
      use: {
        viewport: { width: 1024, height: 768 },
        hasTouch: true
      },
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    stdout: 'ignore',
    stderr: 'pipe',
  },

  // Global timeout for each test
  timeout: 60000,

  // Expect timeout for assertions
  expect: {
    timeout: 5000
  },
});
