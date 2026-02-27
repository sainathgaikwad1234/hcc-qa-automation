import { test as setup, expect } from '@playwright/test';
import * as path from 'path';

const authFile = path.join(__dirname, '../../.auth/user.json');

setup('authenticate', async ({ page }) => {
  setup.setTimeout(180000);

  const loginUrl = process.env.LOGIN_URL || 'https://emr.eva.5280humancarecenter.com/counselor/clinician/login';
  const username = process.env.QA_USERNAME;
  const password = process.env.QA_PASSWORD;

  if (!username || !password) {
    throw new Error('QA_USERNAME and QA_PASSWORD must be set in .env file');
  }

  console.log('Starting authentication setup...');

  // Use 'commit' so we don't wait for full DOM – login page can be slow (SPA, Keycloak redirects, remote server).
  // Then we wait only for the username field to be visible.
  const navTimeout = parseInt(process.env.NAV_TIMEOUT || '120000', 10);
  await page.goto(loginUrl, { waitUntil: 'commit', timeout: navTimeout });
  await page.waitForLoadState('domcontentloaded', { timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(1000);

  const currentUrl = page.url();
  console.log('Current URL after navigation:', currentUrl);

  // Check if we're on the login page
  if (currentUrl.includes('login') || currentUrl.includes('openid-connect')) {
    console.log('On login page, authenticating...');

    // EMR form: "Enter your username" / "Enter your password"; Keycloak: "Username or email" / "Password"
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

    // Click login/submit button
    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In"), button:has-text("Sign in"), button:has-text("Log in")').first();
    await loginButton.click();

    // Wait until we have left the login page (URL must not contain /login)
    // Use multiple detection methods with fallback logic
    let authComplete = false;
    try {
      await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 60000 });
      authComplete = true;
      console.log('Auth: Redirect detected via URL change');
    } catch (err) {
      console.log('Auth: URL wait timed out, checking for error or alternative indicators');
      
      // Check for error message
      const errorElement = page.locator('[role="alert"], .error, .notification.error, [class*="error"]').first();
      const errorText = await errorElement.textContent({ timeout: 5000 }).catch(() => null);
      if (errorText) {
        const lowerError = errorText.toLowerCase();
        if (lowerError.includes('password') || lowerError.includes('credential') || lowerError.includes('invalid')) {
          throw new Error(`Authentication failed: ${errorText}`);
        }
      }
      
      // Fallback: Check if dashboard/admin nav is visible (sign of successful login)
      const dashboardElements = page.getByRole('button', { name: /Scheduling|Admin|Dashboard|Settings/ }).first();
      authComplete = await dashboardElements.isVisible({ timeout: 30000 }).catch(() => false);
      
      if (!authComplete) {
        // Last resort: just check the URL manually
        const currentUrl = page.url();
        authComplete = !currentUrl.includes('/login');
        console.log('Auth: Fallback check - URL contains /login:', currentUrl.includes('/login'));
      }
    }

    if (!authComplete) {
      throw new Error(`Authentication did not complete. Final URL: ${page.url()}`);
    }

    await page.waitForTimeout(2000);

    // Dismiss Google Password Manager "Change your password" dialog if it appears (blocks interaction)
    const okButton = page.getByRole('button', { name: 'OK' }).or(page.getByText('OK', { exact: true }));
    await okButton.click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(1000);

    console.log('Authentication complete, on:', page.url());
  } else {
    console.log('Not on login page, current URL:', currentUrl);
  }

  // Save signed-in state to reuse in all tests
  await page.context().storageState({ path: authFile });
  console.log('Session saved to:', authFile);
});
