import { test as base, Page } from '@playwright/test';

type AuthFixtures = {
  authenticatedPage: Page;
};

const authFixture = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Same entry point as codegen: login URL (with storage state we get redirected to app)
    const loginUrl =
      process.env.LOGIN_URL ||
      'https://emr.eva.5280humancarecenter.com/counselor/clinician/login';

    // Use 'commit' so we don't block on full DOM – with storage state the app may redirect quickly.
    const navTimeout = parseInt(process.env.NAV_TIMEOUT || '120000', 10);
    await page.goto(loginUrl, { waitUntil: 'commit', timeout: navTimeout });
    await page.waitForLoadState('domcontentloaded', { timeout: 45000 }).catch(() => {});

    // Wait for SPA and ensure we're on the EMR app (not login, Keycloak, or admin console)
    await page.waitForTimeout(3000);

    // Dismiss Google Password Manager "Change your password" dialog if it appears (blocks interaction)
    const okButton = page.getByRole('button', { name: 'OK' }).or(page.getByText('OK', { exact: true }));
    await okButton.click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(1000);

    const url = page.url();
    // Reject login page, Keycloak auth, or Keycloak admin console. Allow EMR app (e.g. /counselor/admin/dashboard).
    if (url.includes('/login') || url.includes('openid-connect/auth') || url.includes('/admin/master/')) {
      throw new Error(`Authenticated fixture landed on wrong page: ${url}. Run auth setup and check .env credentials.`);
    }

    // Wait for main app shell (More button) so tests can interact
    await page.getByRole('button', { name: 'More' }).waitFor({ state: 'visible', timeout: 20000 }).catch(() => {
      // Proceed anyway; test will fail with a clear error when clicking More
    });

    await use(page);
  },
});

export const test = authFixture;
export { expect } from '@playwright/test';
