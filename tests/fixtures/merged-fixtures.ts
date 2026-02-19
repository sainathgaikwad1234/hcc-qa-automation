import { test as base, Page } from '@playwright/test';

type AuthFixtures = {
  authenticatedPage: Page;
};

const authFixture = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const baseUrl = process.env.BASE_URL || 'https://emr.eva.5280humancarecenter.com';

    // Navigate to base URL - storage state automatically handles authentication
    await page.goto(baseUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    // Wait for SPA to initialize
    await page.waitForTimeout(3000);

    // Provide the authenticated page to the test
    await use(page);
  },
});

export const test = authFixture;
export { expect } from '@playwright/test';
