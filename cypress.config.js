import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/integration/**/*.spec.js',
    supportFile: 'cypress/support/e2e.js',
  },
  projectId: "t1jdwb",
  video: true,
  waitForAnimations: true,
  viewportWidth: 1366,
  viewportHeight: 768,
  defaultCommandTimeout: 25000,
  requestTimeout: 10000,
  pageLoadTimeout: 60000,
  responseTimeout: 25000,
  retries: {
    runMode: 2,
  },
});
