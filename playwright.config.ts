/*
 * Tests de la web con Playwright (RAD-47): npm run test:e2e
 * Se lanzan contra el entorno completo de Docker de minimafm-api (web, API y datos de prueba):
 *   cd ../minimafm-api && docker compose up -d --build
 * Otra dirección: WEB_URL=https://... npm run test:e2e
 * Navegador: WebKit (el de Safari). La primera vez: npx playwright install webkit
 */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: process.env.WEB_URL ?? 'http://localhost:8080',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'webkit', use: { ...devices['Desktop Safari'] } }],
});
