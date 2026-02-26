/**
 * Helpers for Create Client flow: navigate to Clients and open Add/New Client form.
 * Flow: click Clients (nav) → optionally menuitem/link "Clients" if shown → then Add Client / New Client.
 */
import type { Page } from '@playwright/test';

/** Open Create Client form: go to Clients then click Add Client / New Client. */
export async function openCreateClientPage(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Clients' }).click({ timeout: 15000 });
  await page.waitForTimeout(1000);
  const menuitem = page.getByRole('menuitem', { name: 'Clients' });
  const link = page.getByRole('link', { name: 'Clients' });
  if (await menuitem.isVisible().catch(() => false)) {
    await menuitem.click();
    await page.waitForTimeout(1500);
  } else if (await link.isVisible().catch(() => false)) {
    await link.click();
    await page.waitForTimeout(1500);
  } else {
    await page.waitForTimeout(1500);
  }
  const addOrNew = page.getByRole('button', { name: /Add Client|New Client/i });
  await addOrNew.first().click({ timeout: 15000 });
}
