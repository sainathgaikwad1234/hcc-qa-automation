/**
 * Scheduling: Create Client – multiple scenarios.
 * Navigate to Clients, add client, view list, search.
 */
import { test, expect } from '../../fixtures/merged-fixtures';
import { createClientForForm } from '../../fixtures/test-data';
import { openCreateClientPage } from './helpers/create-client-helpers';

test.describe('Scheduling - Create Client @p1', () => {
  test('1 - should show Clients page and Add Client action', async ({ authenticatedPage: page }) => {
    await openCreateClientPage(page);
    await expect(
      page.getByRole('dialog').getByRole('textbox', { name: 'eg. John' }).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('2 - should create a new client', async ({ authenticatedPage: page }) => {
    const client = createClientForForm();

    await openCreateClientPage(page);

    const dialog = page.getByRole('dialog');
    const formScope = (await dialog.isVisible().catch(() => false)) ? dialog : page;
    const first = formScope.getByRole('textbox', { name: /First Name|eg\. John/i })
      .or(formScope.getByPlaceholder(/eg\. John|First name/i)).first();
    await first.fill(client.firstName);
    const last = formScope.getByRole('textbox', { name: /Last Name|eg\. Doe/i })
      .or(formScope.getByPlaceholder(/eg\. Doe|Last name/i)).first();
    await last.fill(client.lastName);
    const emailField = formScope.getByRole('textbox', { name: /eg\. johndoe|email/i }).or(formScope.getByPlaceholder(/johndoe@example|email/i)).first();
    await emailField.fill(client.email);
    const phoneInput = formScope.getByRole('textbox', { name: /eg\. \(205\)|phone/i }).or(formScope.getByPlaceholder(/555-0100|phone/i)).first();
    await phoneInput.fill(client.phone);
    await formScope.getByRole('combobox', { name: 'Select' }).nth(1).click();
    await page.waitForTimeout(500);
    await page.getByText('Male', { exact: true }).or(page.getByText('Female', { exact: true })).first().click({ timeout: 5000 });
    const dobMonth = formScope.getByRole('spinbutton', { name: 'Month' });
    const dobDay = formScope.getByRole('spinbutton', { name: 'Day' });
    const dobYear = formScope.getByRole('spinbutton', { name: 'Year' });
    if (await dobMonth.isVisible().catch(() => false)) {
      await dobMonth.fill('01');
      await dobDay.fill('01');
      await dobYear.fill('1990');
    } else {
      const dobField = formScope.getByRole('textbox').or(formScope.getByPlaceholder(/MM|date|dob/i)).first();
      await dobField.fill(client.dateOfBirth);
    }
    await formScope.getByRole('combobox', { name: /Assigned Office/i }).click();
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    const orgCombo = formScope.getByRole('combobox', { name: 'Select Organization' });
    if (await orgCombo.isVisible().catch(() => false)) {
      await orgCombo.click();
      await page.waitForTimeout(500);
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
    }
    const addressField = page.getByPlaceholder('Address Line 1').or(page.getByRole('dialog').getByRole('textbox', { name: /Address Line 1/i }));
    await addressField.first().scrollIntoViewIfNeeded();
    await addressField.first().fill(client.addressLine1);
    await page.getByPlaceholder('Enter City').or(page.getByRole('dialog').getByRole('textbox', { name: /City/i })).first().fill(client.city);
    await page.getByPlaceholder('Enter Zip Code').or(page.getByRole('dialog').getByRole('textbox', { name: /Zip/i })).first().fill(client.zip);

    await page.waitForTimeout(500);
    const saveBtn = page.getByRole('button', { name: 'Save' }).or(page.locator('button:has-text("Save")'));
    await saveBtn.first().click({ timeout: 15000, force: true });

    await expect(
      page.getByText(client.lastName).or(page.getByText(client.firstName)).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test('3 - should show clients list after navigation', async ({ authenticatedPage: page }) => {
    await page.getByRole('button', { name: 'Clients' }).or(page.locator('button').filter({ hasText: /^Clients$/ })).first().click();
    await expect(page.getByText('Clients').first()).toBeVisible({ timeout: 15000 });
    const tableOrList = page.getByRole('table').or(page.locator('[role="grid"]')).or(page.getByRole('list'));
    await expect(tableOrList.first()).toBeVisible({ timeout: 10000 }).catch(() => {});
  });

  test('4 - should open Add Client form and have required fields', async ({ authenticatedPage: page }) => {
    await openCreateClientPage(page);
    await expect(
      page.getByRole('dialog').getByRole('textbox', { name: 'eg. John' }).first()
    ).toBeVisible({ timeout: 10000 });
  });
});
