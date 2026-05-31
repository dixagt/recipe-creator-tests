import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['playwright-testrail-reporter', {
      host: 'https://qaericka.testrail.io',
      username: 'dixagt@gmail.com',
      password: 'l38zbjuWvLfhf0MeEYWq-/rMmZChN1TPiRXMLvXy1',
      projectId: 1,
      runName: 'Recipe Creator - Automated Run',
    }]
  ],
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
})
