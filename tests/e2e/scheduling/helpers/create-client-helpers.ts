/**
 * Helpers for Create Client flow: navigate to Clients and open Add/New Client form.
 * Flow: click Clients (nav) → optionally menuitem/link "Clients" if shown → then Add Client / New Client.
 */
import type { Page } from '@playwright/test';

/** Open Create Client form: go to Clients then click Add Client / New Client. */
export async function openCreateClientPage(page: Page): Promise<void> {
  // Dismiss any open dialogs/overlays left from previous steps
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Check if the 'Clients' nav button is immediately visible
  const clientsBtn = page.getByRole('button', { name: 'Clients' });
  const isVisible = await clientsBtn.isVisible({ timeout: 3000 }).catch(() => false);

  if (!isVisible) {
    // The page may be in a modal/overlay state (e.g., after scheduling setup).
    // Press Escape once more, then navigate to the app home to reset state.
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    const baseUrl = process.env.BASE_URL || 'https://emr.eva.5280humancarecenter.com';
    await page.goto(baseUrl, { waitUntil: 'commit', timeout: 60000 }).catch(() => {});
    await page.waitForLoadState('domcontentloaded', { timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(2000);
    // Dismiss any dialog that appears after navigation
    const okBtn = page.getByRole('button', { name: 'OK' }).or(page.getByText('OK', { exact: true }));
    await okBtn.click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(1000);
  }

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
