import { test as base, Page } from '@playwright/test';
import * as path from 'path';

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
    // If session expired, re-authenticate instead of throwing
    if (url.includes('/login') || url.includes('openid-connect/auth') || url.includes('/admin/master/')) {
      const username = process.env.QA_USERNAME;
      const password = process.env.QA_PASSWORD;
      if (!username || !password) {
        throw new Error(`Authenticated fixture landed on wrong page: ${url}. Run auth setup and check .env credentials.`);
      }

      console.log(`Session expired (landed on ${url}), re-authenticating...`);

      const emailField = page
        .getByRole('textbox', { name: /Enter your username|Username or email/i })
        .first();
      await emailField.waitFor({ state: 'visible', timeout: 30000 });
      await emailField.fill(username);

      const passwordField = page
        .getByRole('textbox', { name: /Enter your password|^Password$/i })
        .first();
      await passwordField.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      await passwordField.fill(password);

      const loginButton = page
        .locator(
          'button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In"), button:has-text("Sign in"), button:has-text("Log in")'
        )
        .first();
      await loginButton.click();

      await page.waitForURL((u) => !u.pathname.includes('/login'), { timeout: 60000 });
      await page.waitForTimeout(2000);

      // Dismiss any browser dialogs after login
      const okBtn2 = page.getByRole('button', { name: 'OK' }).or(page.getByText('OK', { exact: true }));
      await okBtn2.click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(1000);

      // Navigate to the app base URL to get a stable, known starting page before saving state.
      // This ensures subsequent tests start from the dashboard rather than some mid-flow URL.
      const baseUrl = process.env.BASE_URL || 'https://emr.eva.5280humancarecenter.com';
      await page.goto(baseUrl, { waitUntil: 'commit', timeout: navTimeout }).catch(() => {});
      await page.waitForLoadState('domcontentloaded', { timeout: 45000 }).catch(() => {});
      await page.waitForTimeout(2000);

      // Update the stored auth state so future tests in this run benefit from fresh cookies
      const authFile = path.join(__dirname, '../../.auth/user.json');
      await page.context().storageState({ path: authFile });
      console.log('Re-authentication complete, auth state refreshed.');
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
