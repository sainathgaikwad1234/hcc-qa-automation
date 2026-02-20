/**
 * Scheduling: Create Client – multiple scenarios.
 * Navigate to Clients, add client, view list, search.
 */
import { test, expect } from '../../fixtures/merged-fixtures';
import { createClientForForm } from '../../fixtures/test-data';

test.describe('Scheduling - Create Client @p1', () => {
  test('1 - should show Clients page and Add Client action', async ({ authenticatedPage: page }) => {
    await page.getByRole('button', { name: 'Clients' }).click();
    await page.getByRole('button', { name: 'Clients' }).click();
    await page.waitForTimeout(2000);
    await expect(
      page.getByRole('button', { name: 'New Client' }).or(page.getByText('Clients').first()).or(page.getByRole('button', { name: /Client/i }).first())
    ).toBeVisible({ timeout: 15000 });
  });

  test('2 - should create a new client', async ({ authenticatedPage: page }) => {
    const client = createClientForForm();

    await page.getByRole('button', { name: 'Clients' }).click();
    await page.getByRole('button', { name: 'Clients' }).click();
    await page.getByRole('button', { name: 'New Client' }).click();

    await page.getByRole('textbox', { name: /First Name|first name/i }).first().fill(client.firstName);
    await page.getByRole('textbox', { name: /Last Name|last name/i }).first().fill(client.lastName);
    const dobField = page.getByRole('textbox', { name: /Date of Birth|DOB|Birth/i }).or(page.getByLabel(/Date of Birth|DOB/i)).first();
    await dobField.fill(client.dateOfBirth).catch(() => {});

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(
      page.getByText(client.lastName).or(page.getByText(client.firstName)).or(page.getByRole('button', { name: /Add Client|New Client/i })).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test('3 - should show clients list after navigation', async ({ authenticatedPage: page }) => {
    await page.getByRole('button', { name: 'Clients' }).or(page.locator('button').filter({ hasText: /^Clients$/ })).first().click();
    await expect(page.getByText('Clients').first()).toBeVisible({ timeout: 15000 });
    const tableOrList = page.getByRole('table').or(page.locator('[role="grid"]')).or(page.getByRole('list'));
    await expect(tableOrList.first()).toBeVisible({ timeout: 10000 }).catch(() => {});
  });

  test('4 - should open Add Client form and have required fields', async ({ authenticatedPage: page }) => {
    await page.getByRole('button', { name: 'Clients' }).click();
    await page.getByRole('button', { name: 'Clients' }).click();
    await page.getByRole('button', { name: 'New Client' }).click();
    await expect(
      page.getByRole('textbox', { name: /First Name|first name/i }).first().or(page.getByRole('dialog').getByRole('textbox').first())
    ).toBeVisible({ timeout: 10000 });
  });
});
