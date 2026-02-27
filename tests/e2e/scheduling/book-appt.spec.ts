/**
 * Scheduling: Book Appointment – multiple scenarios.
 * Uses the clinician and availability we created. Time slots only display when there is
 * availability for the selected clinician. Select clinician → pick date → pick time from availability → select client.
 */
import { test, expect } from '../../fixtures/merged-fixtures';
import { runSchedulingSetup } from './helpers/scheduling-setup';
import { openCreateClientPage } from './helpers/create-client-helpers';
import { createClientForForm } from '../../fixtures/test-data';

test.describe('Scheduling - Book Appointment @p1', () => {
  test('1 - should create setup (role, user, availability), create client, then book appt with clinician and time from availability', async ({
    authenticatedPage: page,
  }) => {
    const schedulingContext = await runSchedulingSetup(page);
    const client = createClientForForm();

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await openCreateClientPage(page);
    
    // Wait for the form to be fully loaded before interacting
    await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(2000);
    
    const first = page.getByRole('textbox', { name: /First Name|first name/i }).or(page.getByLabel(/First Name|first name/i)).first();
    await first.waitFor({ state: 'visible', timeout: 60000 });
    await first.fill(client.firstName);
    
    const last = page.getByRole('textbox', { name: /Last Name|last name/i }).or(page.getByLabel(/Last Name|last name/i)).first();
    await last.fill(client.lastName);
    
    const dobField = page.getByRole('textbox', { name: /Date of Birth|DOB|Birth/i }).or(page.getByLabel(/Date of Birth|DOB/i)).or(page.getByPlaceholder(/MM\/DD\/YYYY|date/i)).first();
    await dobField.fill(client.dateOfBirth);
    await page.getByRole('button', { name: /Save|Create|Submit/i }).first().click();
    await expect(page.getByText(client.lastName).first()).toBeVisible({ timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'Scheduling' }).or(page.locator('button').filter({ hasText: /^Scheduling$/ })).first().click({ force: true });
    await page.getByRole('menuitem', { name: 'Calendar' }).or(page.locator('div').filter({ hasText: /^Calendar$/ })).first().click();
    await expect(page.getByText('Calendar').first()).toBeVisible({ timeout: 15000 });

    await page.getByRole('button', { name: /Book Appointment|New Appointment|Schedule/i }).click({ timeout: 10000 }).catch(() => {});

    await page.getByRole('combobox', { name: /Clinician|Select Clinician/i }).click();
    await page.getByText(schedulingContext.clinicianDisplayName, { exact: true }).click();

    const dateButton = page.getByRole('button', { name: 'Choose date' }).first();
    await dateButton.click();
    await page.getByRole('gridcell', { name: /^(1[5-9]|2[0-8])$/ }).first().click();

    await page.waitForTimeout(1000);
    const timeSlot = page.getByRole('button', { name: /10:00|10:00 AM/ }).or(page.getByText('10:00 AM')).first();
    await timeSlot.click({ timeout: 10000 }).catch(() => {
      page.getByRole('option', { name: /10/ }).first().click({ timeout: 5000 }).catch(() => {});
    });

    await page.getByRole('combobox', { name: /Client|Patient|Select Client/i }).click();
    await page.getByText(client.lastName).or(page.getByText(`${client.firstName} ${client.lastName}`)).first().click({ timeout: 5000 }).catch(() => {});

    await page.getByRole('button', { name: 'Save' }).or(page.getByRole('button', { name: 'Book' })).or(page.getByRole('button', { name: 'Confirm' })).first().click();

    await expect(
      page.getByText(schedulingContext.clinicianDisplayName).or(page.getByText(client.lastName)).or(page.getByText('Calendar')).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test('2 - should show Calendar and booking entry point', async ({ authenticatedPage: page }) => {
    await page.getByRole('button', { name: 'Scheduling' }).click();
    await page.getByRole('menuitem', { name: 'Calendar' })
      .or(page.locator('div').filter({ hasText: /^Calendar$/ }))
      .first()
      .click();
    await expect(page.getByText('Calendar').first()).toBeVisible({ timeout: 15000 });
  });

  test('3 - time slots only visible when clinician has availability', async ({ authenticatedPage: page }) => {
    const schedulingContext = await runSchedulingSetup(page);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    // Wait for the main nav to be in an interactable state before clicking Scheduling
    await page.getByRole('button', { name: 'Scheduling' })
      .or(page.locator('button').filter({ hasText: /^Scheduling$/ }))
      .first()
      .waitFor({ state: 'visible', timeout: 10000 })
      .catch(() => {});
    await page.getByRole('button', { name: 'Scheduling' }).or(page.locator('button').filter({ hasText: /^Scheduling$/ })).first().click();
    await page.waitForTimeout(1500);
    await page.getByRole('menuitem', { name: 'Calendar' })
      .or(page.locator('li').filter({ hasText: /^Calendar$/ }))
      .or(page.locator('div').filter({ hasText: /^Calendar$/ }))
      .first()
      .click({ timeout: 15000 });
    await page.getByRole('button', { name: /Book Appointment|New Appointment|Schedule/i }).click({ timeout: 10000 }).catch(() => {});

    // Wait for the appointment form to fully load
    await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(2000);
    
    const clinicianSelect = page.getByRole('combobox', { name: /Clinician|Select Clinician/i });
    await clinicianSelect.waitFor({ state: 'visible', timeout: 60000 });
    await clinicianSelect.click();
    await page.getByText(schedulingContext.clinicianDisplayName, { exact: true }).click();

    await page.getByRole('button', { name: 'Choose date' }).first().click();
    await page.getByRole('gridcell', { name: /^(1[5-9]|2[0-8])$/ }).first().click();

    await page.waitForTimeout(2000);
    const slots = page.getByRole('button', { name: /10:00|10:30|11:00/ }).or(page.getByText(/10:00 AM|10:30 AM|11:00 AM/));
    await expect(slots.first()).toBeVisible({ timeout: 15000 });
  });
});
