const { defineConfig } = require('@playwright/test');

const python = process.platform === 'win32' ? 'python' : 'python3';

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:4173',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: `${python} -m http.server 4173 --bind 127.0.0.1`,
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false
  }
});
