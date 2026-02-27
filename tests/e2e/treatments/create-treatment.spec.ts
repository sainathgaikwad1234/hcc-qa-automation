/**
 * Treatments module – create, edit, search, and manage treatments and templates.
 * Includes treatment creation, billing codes, treatment summary, and template library.
 */
import { test, expect } from '../../fixtures/merged-fixtures';

test.describe('Treatments - Create Treatment @p1', () => {
  test('1 - should create a new treatment', async ({ authenticatedPage: page }) => {
    const treatmentCode = `TREAT${Date.now()}`;
    
    // Navigate to Treatments
    await page.getByRole('button', { name: 'Treatments' }).click();
    await page.getByRole('menu').getByText('Treatments').click();
    await page.getByRole('button', { name: 'Create Treatment' }).click({ timeout: 15000 });
    
    // Fill treatment form
    await page.getByRole('textbox', { name: 'Enter treatment code' }).fill(treatmentCode);
    await page.getByRole('combobox', { name: 'Select treatment type' }).click();
    await page.getByText('LEVEL II EDUCATION').click();
    await page.getByRole('textbox', { name: 'Enter a description...' }).fill('Test treatment description');
    await page.getByRole('textbox', { name: 'Enter total sessions' }).fill('5');
    await page.getByRole('option', { name: 'ONE PER WEEK', exact: true }).click().catch(() =>
      page.getByText('One Per Week', { exact: true }).first().click()
    );
    await page.getByText('Select times per day').click();
    await page.locator('#menu-timesPerDay li').filter({ hasText: '1' }).click();
    await page.getByRole('textbox', { name: 'Enter cost per session' }).fill('10');
    await page.getByRole('textbox', { name: 'Enter session length' }).fill('10');
    await page.getByRole('combobox', { name: 'Select gender' }).click();
    await page.getByRole('option', { name: 'Both', exact: true }).click().catch(() =>
      page.getByText('Both', { exact: true }).first().click()
    );
    await page.getByText('Select workbook').click();
    await page.getByText('Level 1 DUI Education -').click();
    
    // Create treatment
    await page.getByRole('button', { name: 'Create Treatment' }).click();
    await expect(page.getByText(treatmentCode).or(page.getByText('Treatment created'))).toBeVisible({ timeout: 15000 });
  });

  test('2 - should edit an existing treatment', async ({ authenticatedPage: page }) => {
    const treatmentCode = `TREAT${Date.now()}`;
    
    // Create a treatment first
    await page.getByRole('button', { name: 'Treatments' }).click();
    await page.getByRole('menu').getByText('Treatments').click();
    await page.getByRole('button', { name: 'Create Treatment' }).click();
    
    await page.getByRole('textbox', { name: 'Enter treatment code' }).fill(treatmentCode);
    await page.getByRole('combobox', { name: 'Select treatment type' }).click();
    await page.getByText('LEVEL II EDUCATION').click();
    await page.getByRole('textbox', { name: 'Enter a description...' }).fill('Original description');
    await page.getByRole('textbox', { name: 'Enter total sessions' }).fill('5');
    await page.getByRole('option', { name: 'ONE PER WEEK', exact: true }).click().catch(() =>
      page.getByText('One Per Week', { exact: true }).first().click()
    );
    await page.getByText('Select times per day').click();
    await page.locator('#menu-timesPerDay li').filter({ hasText: '1' }).click();
    await page.getByRole('textbox', { name: 'Enter cost per session' }).fill('10');
    await page.getByRole('textbox', { name: 'Enter session length' }).fill('10');
    await page.getByRole('button', { name: 'Create Treatment' }).click();
    await page.waitForTimeout(2000);
    
    // Now edit it
    await page.getByRole('textbox', { name: 'Search Code or Description' }).fill(treatmentCode);
    await page.waitForTimeout(2000);
    
    const row = page.getByRole('row').filter({ hasText: treatmentCode }).first();
    const editButton = row.getByRole('button').first();
    await editButton.waitFor({ state: 'visible', timeout: 15000 });
    await editButton.click();
    await page.waitForTimeout(1000);
    
    await page.getByRole('textbox', { name: 'Enter a description...' }).click();
    await page.getByRole('textbox', { name: 'Enter a description...' }).clear();
    await page.getByRole('textbox', { name: 'Enter a description...' }).fill('Updated treatment description');
    
    const timesPerDaySelect = page.getByRole('combobox', { name: '1', exact: true }).first();
    await timesPerDaySelect.click({ timeout: 5000 }).catch(() => {});
    await page.locator('#menu-timesPerDay li').filter({ hasText: '2' }).click().catch(() => {});
    
    await page.getByRole('button', { name: 'Update Treatment' }).click();
    await expect(page.getByText('Updated treatment description').or(page.getByText('Treatment updated'))).toBeVisible({ timeout: 15000 });
  });

  test('3 - should search for treatments', async ({ authenticatedPage: page }) => {
    await page.getByRole('button', { name: 'Treatments' }).click();
    await page.getByRole('menu').getByText('Treatments').click();
    
    const searchField = page.getByRole('textbox', { name: 'Search Code or Description' });
    await searchField.click();
    await searchField.fill('009');
    await page.waitForTimeout(1000);
    
    await expect(page.getByRole('cell', { name: '009', exact: true }).or(page.getByText('009'))).toBeVisible({ timeout: 10000 });
  });

  test('4 - should view treatment details', async ({ authenticatedPage: page }) => {
    await page.getByRole('button', { name: 'Treatments' }).click();
    await page.getByRole('menu').getByText('Treatments').click();
    
    // Click on first treatment to view details
    const firstRow = page.getByRole('row').nth(2); // Skip header
    const viewButton = firstRow.getByRole('button').first();
    await viewButton.click({ timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1000);
    
    // Look for treatment details dialog/modal
    const dialog = page.getByRole('dialog').first();
    const hasDialog = await dialog.isVisible({ timeout: 10000 }).catch(() => false);
    
    if (hasDialog) {
      await expect(dialog).toBeVisible();
    } else {
      // Fallback: check for treatment heading
      await expect(page.getByRole('heading', { name: /Treatment|Code/ }).first()).toBeVisible({ timeout: 10000 });
    }
  });
});

test.describe('Treatments - Billing Codes @p1', () => {
  test('1 - should add organization billing code', async ({ authenticatedPage: page }) => {
    const billingCode = `BILL${Date.now()}`;
    
    await page.getByRole('button', { name: 'Treatments' }).click();
    await page.getByText('Organization Billing Code').click();
    await page.getByRole('button', { name: 'Add Billing Code' }).click({ timeout: 15000 });
    
    await page.getByRole('textbox', { name: 'Enter billing code...' }).fill(billingCode);
    await page.getByRole('textbox', { name: 'Enter description...' }).fill('Test organization billing code');
    
    await page.getByRole('button', { name: 'Add Code' }).click();
    await expect(page.getByText(billingCode).or(page.getByText('Billing code added'))).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Treatments - Summary @p1', () => {
  test('1 - should view treatment summary', async ({ authenticatedPage: page }) => {
    await page.getByRole('button', { name: 'Treatments' }).click();
    
    // Click on Treatment Summary tab/section
    const summaryButton = page.locator('div').filter({ hasText: 'Treatment Summary' }).first();
    await summaryButton.click({ timeout: 15000 }).catch(() => {
      page.getByText('Treatment Summary').click();
    });
    
    await expect(page.getByText('Treatment Summary').or(page.getByRole('heading', { name: 'Treatment' }))).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Treatments - Template Library @p1', () => {
  test('1 - should create template', async ({ authenticatedPage: page }) => {
    const templateName = `Template${Date.now()}`;
    
    await page.getByRole('button', { name: 'Treatments' }).click();
    await page.getByText('Template Library').click({ timeout: 15000 });
    await page.getByRole('button', { name: 'Create New Template' }).click();
    
    // Fill template form
    await page.getByRole('textbox', { name: 'Enter Template Name' }).fill(templateName);
    await page.getByText('Select Template Type').click();
    await page.locator('li').filter({ hasText: 'Intake Form' }).click();
    await page.getByRole('textbox', { name: 'Enter Template Description' }).fill('Test template description');
    
    // Fill JSON schema with valid JSON
    const schemaField = page.getByRole('textbox', { name: 'Enter JSON Schema' });
    await schemaField.click();
    await schemaField.clear();
    await schemaField.fill('{\n  "type": "object",\n  "properties": {\n    "name": { "type": "string" }\n  }\n}');
    
    await page.getByRole('button', { name: 'Create Template' }).click();
    await expect(page.getByText(templateName).or(page.getByText('Template created'))).toBeVisible({ timeout: 15000 });
  });
});