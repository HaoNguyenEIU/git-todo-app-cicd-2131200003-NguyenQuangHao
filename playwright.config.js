const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 60 * 1000, // 60 seconds
  expect: {
    timeout: 5000
  },
  use: {
    headless: true, // Run tests without opening a visible browser window
    launchOptions: {
      slowMo: 50, // Slow down operations to see them more clearly if needed
    },
  },
});
