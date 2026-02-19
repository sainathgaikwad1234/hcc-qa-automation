import { test as setup, expect } from '@playwright/test';
import * as path from 'path';

const authFile = path.join(__dirname, '../../.auth/user.json');

setup('authenticate', async ({ page }) => {
  const loginUrl = process.env.LOGIN_URL || 'https://emr.eva.5280humancarecenter.com/counselor/clinician/login';
  const username = process.env.QA_USERNAME;
  const password = process.env.QA_PASSWORD;

  if (!username || !password) {
    throw new Error('QA_USERNAME and QA_PASSWORD must be set in .env file');
  }

  console.log('Starting authentication setup...');

  // Navigate to login page
  await page.goto(loginUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const currentUrl = page.url();
  console.log('Current URL after navigation:', currentUrl);

  // Check if we're on the login page
  if (currentUrl.includes('login')) {
    console.log('On login page, authenticating...');

    // Try common email/username field selectors
    // Update these selectors after running discovery tests
    const emailField = page.locator('input[type="email"], input[name="email"], input[name="username"], #email, #username').first();
    await emailField.waitFor({ state: 'visible', timeout: 30000 });
    await emailField.fill(username);

    // Fill password
    const passwordField = page.locator('input[type="password"], input[name="password"], #password').first();
    await passwordField.fill(password);

    // Click login/submit button
    const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign in"), button:has-text("Log in")').first();
    await loginButton.click();

    // Wait for redirect after login (update URL pattern after discovery)
    await page.waitForURL(/dashboard|home|counselor|clinician/, { timeout: 60000 });
    await page.waitForTimeout(3000);

    console.log('Authentication complete, on:', page.url());
  } else {
    console.log('Not on login page, current URL:', currentUrl);
  }

  // Save signed-in state to reuse in all tests
  await page.context().storageState({ path: authFile });
  console.log('Session saved to:', authFile);
});
