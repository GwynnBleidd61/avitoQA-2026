import "dotenv/config";
import { defineConfig, devices } from "@playwright/test";


const BASE_URL = "https://cerulean-praline-8e5aa6.netlify.app/";

export default defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: "html",

    use: {
        baseURL: BASE_URL,
        trace: "on-first-retry",
        headless: true,
        viewport: { width: 1920, height: 1080 },
    },

    projects: [
      {
        name: "chromium",
        use: { ...devices["Desktop Chrome"] },
      },
      {
        name: "firefox",
        use: { ...devices["Desktop Firefox"] },
      },
      {
        name: "webkit",
        use: { ...devices["Desktop Safari"] },
      },
    ],
});
