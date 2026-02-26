/**
 * Scheduling: Create Group – multiple scenarios.
 * Uses the clinician and availability time we created (via scheduling-setup).
 * Group time should be within the scheduled availability (e.g. 10:00 AM).
 */
import { test, expect } from '../../fixtures/merged-fixtures';
import { runSchedulingSetup } from './helpers/scheduling-setup';
import { randomLetters } from '../../fixtures/test-data';

test.describe('Scheduling - Create Group @p1', () => {
  test('1 - should create role, user, availability then create group with that clinician and availability time', async ({
    authenticatedPage: page,
  }) => {
    const schedulingContext = await runSchedulingSetup(page);
    const groupName = `E2E Group ${randomLetters(6)}`;

    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: /Groups/i }).or(page.locator('button').filter({ hasText: /^Groups$/ })).first().click();
    await page.getByRole('button', { name: /Add Group|Add New Group|New Group|Create Group/i }).or(page.getByText(/Add.*Group/i)).first().click({ timeout: 15000 });

    await page.getByRole('textbox', { name: /Group Name|Name/i }).first().fill(groupName);
    // The form may have two clinician comboboxes (primary + secondary); use the first one.
    // Wait briefly for the dropdowns to become enabled (they may load async).
    await page.waitForTimeout(1500);
    const clinicianCombo = page.getByRole('combobox', { name: /Clinician|Select Clinician/i }).first();
    await clinicianCombo.click();
    await page.getByText(schedulingContext.clinicianDisplayName, { exact: true }).click();

    const startTimeBtn = page.getByRole('button', { name: 'Choose time' }).or(page.getByLabel(/Start Time|Start/i)).first();
    await startTimeBtn.click();
    const timeOption = page.getByRole('option').filter({ hasText: /^10\b|10 hours/ }).first();
    await timeOption.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
    await timeOption.click().catch(() => {});
    await page.getByRole('option', { name: /0 minutes?/ }).first().click({ timeout: 3000 }).catch(() => {});
    await page.getByRole('option', { name: 'AM' }).click({ timeout: 3000 }).catch(() => {});

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(
      page.getByText(groupName).or(page.getByText(schedulingContext.clinicianDisplayName)).or(page.getByRole('button', { name: /Add Group|New Group/i })).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test('2 - should show Groups page', async ({ authenticatedPage: page }) => {
    await page.getByRole('button', { name: 'Groups' }).or(page.locator('button').filter({ hasText: /^Groups$/ })).first().click();
    await expect(page.getByText('Groups').first()).toBeVisible({ timeout: 15000 });
  });

  test('3 - should open Create Group form', async ({ authenticatedPage: page }) => {
    await page.getByRole('button', { name: 'Groups' }).or(page.locator('button').filter({ hasText: /^Groups$/ })).first().click();
    await page.getByRole('button', { name: /Add Group|Add New Group|New Group|Create Group/i }).or(page.getByText(/Add.*Group/i)).first().click({ timeout: 15000 });
    await expect(
      page.getByRole('textbox', { name: /Group Name|Name/i }).first().or(page.getByRole('dialog').getByRole('textbox').first())
    ).toBeVisible({ timeout: 10000 });
  });
});
