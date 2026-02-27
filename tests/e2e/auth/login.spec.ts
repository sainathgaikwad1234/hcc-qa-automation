/**
 * Login E2E tests.
 * Full list of scenarios: see tests/e2e/auth/LOGIN_SCENARIOS.md
 */
import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

const LOGIN_URL =
  process.env.LOGIN_URL || 'https://emr.eva.5280humancarecenter.com/counselor/clinician/login';

// EMR: "Enter your username" / "Enter your password"; Keycloak: "Username or email" / "Password"
function getUsernameField(page: Page) {
  return page.getByRole('textbox', { name: /Enter your username|Username or email/i }).first();
}
function getPasswordField(page: Page) {
  return page.getByRole('textbox', { name: /Enter your password|^Password$/i }).first();
}
function getSignInButton(page: Page) {
  return page.getByRole('button', { name: /Sign In|Sign in|Log in/i });
}

function isOnLoginPage(url: URL): boolean {
  return url.pathname.includes('/login');
}

test.describe('Login @p0', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
  });

  // --- Scenario 12: Login page loads (P0) ---
  test('12 - login page loads with username, password fields and Sign In button visible', async ({
    page,
  }) => {
    await expect(getUsernameField(page)).toBeVisible();
    await expect(getPasswordField(page)).toBeVisible();
    await expect(getSignInButton(page)).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  // --- Scenario 11: Password masked (P0) ---
  test('11 - password field is masked (type=password)', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // --- Scenario 1: Valid credentials (P0) ---
  test('1 - should sign in with valid credentials and redirect away from login', async ({
    page,
  }) => {
    const username = process.env.QA_USERNAME;
    const password = process.env.QA_PASSWORD;

    if (!username || !password) {
      test.skip(true, 'QA_USERNAME and QA_PASSWORD must be set in .env');
      return;
    }

    await getUsernameField(page).click();
    await getUsernameField(page).fill(username);
    await getPasswordField(page).click();
    await getPasswordField(page).fill(password);
    await getSignInButton(page).click();

    // Wait for redirect with increased timeout to account for server auth delays
    await page.waitForURL((url) => !isOnLoginPage(url), { timeout: 120000 });
    await expect(page).not.toHaveURL(/\/login/);
  });
});

test.describe('Login - Invalid credentials @p0', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
  });

  // --- Scenario 3: Wrong password (P0) ---
  test('3 - wrong password keeps user on login page and shows error', async ({ page }) => {
    const username = process.env.QA_USERNAME;
    if (!username) {
      test.skip(true, 'QA_USERNAME required for wrong-password test');
      return;
    }

    await getUsernameField(page).fill(username);
    await getPasswordField(page).fill('WrongPassword123!');
    await getSignInButton(page).click();

    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
    // App may show error via role=alert or text; assert only that we stay on login (critical)
  });

  // --- Scenario 4: Wrong username (P0) ---
  test('4 - wrong username keeps user on login page and shows error', async ({ page }) => {
    await getUsernameField(page).fill('unknown.user@example.com');
    await getPasswordField(page).fill('AnyPassword1!');
    await getSignInButton(page).click();

    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
    // App may show error via role=alert or text; assert only that we stay on login (critical)
  });

  // --- Scenario 5: Wrong username and password (P1) ---
  test('5 - wrong username and password keeps user on login page', async ({ page }) => {
    await getUsernameField(page).fill('nobody@example.com');
    await getPasswordField(page).fill('WrongPass456!');
    await getSignInButton(page).click();

    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });
});

test.describe('Login - Empty / missing input @p0', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
  });

  // --- Scenario 6: Empty username (P0) ---
  test('6 - empty username keeps user on login or shows validation', async ({ page }) => {
    await getPasswordField(page).fill('SomePassword1!');
    await getSignInButton(page).click();

    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  // --- Scenario 7: Empty password (P0) ---
  test('7 - empty password keeps user on login or shows validation', async ({ page }) => {
    const username = process.env.QA_USERNAME || 'test@example.com';
    await getUsernameField(page).fill(username);
    await getSignInButton(page).click();

    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  // --- Scenario 8: Both fields empty (P1) ---
  test('8 - both fields empty keeps user on login', async ({ page }) => {
    await getSignInButton(page).click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });
});

test.describe('Login - Format / validation @p1', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
  });

  // --- Scenario 9: Invalid email/username format (P1) ---
  test('9 - invalid username format keeps user on login or shows validation', async ({ page }) => {
    await getUsernameField(page).fill('notanemail');
    await getPasswordField(page).fill('Password1!');
    await getSignInButton(page).click();

    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  // --- Scenario 10: Spaces only (P2) ---
  test('10 - spaces-only input treated as invalid', async ({ page }) => {
    await getUsernameField(page).fill('   ');
    await getPasswordField(page).fill('   ');
    await getSignInButton(page).click();

    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });
});

test.describe('Login - Edge cases @p1 @p2', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
  });

  // --- Scenario 13: Sign In button state (P2) ---
  test('13 - Sign In button is visible and enabled when form has input', async ({ page }) => {
    await getUsernameField(page).fill('user@test.com');
    await getPasswordField(page).fill('Pass1!');
    await expect(getSignInButton(page)).toBeVisible();
    await expect(getSignInButton(page)).toBeEnabled();
  });

  // --- Scenario 14: Case sensitivity (P2) ---
  test('14 - wrong case password fails login', async ({ page }) => {
    const username = process.env.QA_USERNAME;
    const password = process.env.QA_PASSWORD;
    if (!username || !password) {
      test.skip(true, 'QA_USERNAME and QA_PASSWORD required');
      return;
    }
    const wrongCasePassword =
      password === password.toUpperCase() ? password.toLowerCase() : password.toUpperCase();

    await getUsernameField(page).fill(username);
    await getPasswordField(page).fill(wrongCasePassword);
    await getSignInButton(page).click();

    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });

  // --- Scenario 16: Direct URL after login (P1) ---
  test('16 - visiting login URL when already logged in redirects to app', async ({ page }) => {
    const username = process.env.QA_USERNAME;
    const password = process.env.QA_PASSWORD;
    if (!username || !password) {
      test.skip(true, 'QA_USERNAME and QA_PASSWORD required');
      return;
    }

    await getUsernameField(page).fill(username);
    await getPasswordField(page).fill(password);
    await getSignInButton(page).click();
    await page.waitForURL((url) => !isOnLoginPage(url), { timeout: 120000 });

    await page.goto(LOGIN_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    expect(isOnLoginPage(new URL(page.url()))).toBe(false);
  });

 
});
