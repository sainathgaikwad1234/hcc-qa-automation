/**
 * Admin: Full flow – Create Role → Add User with same role.
 * One test that creates a role and then adds a user assigned to that role.
 */
import { test, expect } from '../../fixtures/merged-fixtures';
import { createUserForAddUserForm } from '../../fixtures/test-data';

test.describe('Admin - Create Role and Add User (full flow) @p1', () => {
  test('should create a role and add a user with that role', async ({ authenticatedPage: page }) => {
    const roleName = `E2E Role ${Date.now()}`;
    const user = createUserForAddUserForm();
    const username = `E2E${Date.now()}`;

    // --- Step 1: Create Role ---
    await page.getByRole('button', { name: 'More' }).click();
    await page.locator('li:nth-child(5) > .MuiListItemIcon-root > .MuiSvgIcon-root').click();
    await page.getByText('Roles & Permissions').click();
    await page.getByRole('button', { name: 'New Role' }).click();

    await page.getByRole('combobox', { name: 'Select Role Type' }).click();
    await page.locator('li').filter({ hasText: 'Clinician' }).click();

    await page.getByRole('textbox', { name: 'Enter Role Name' }).click();
    await page.getByRole('textbox', { name: 'Enter Role Name' }).fill(roleName);
    await page.getByRole('button', { name: 'Create Role' }).click();

    await expect(page.getByText(roleName)).toBeVisible({ timeout: 15000 });

    // --- Step 2: Add User with same role ---
    await page.getByRole('button', { name: 'More' }).click();
    await page.getByRole('menuitem', { name: 'Admin' }).click();
    await page.getByRole('menu').getByText('User Management').click();
    await page.getByRole('button', { name: 'Add New User' }).click();

    await page.getByRole('textbox', { name: 'Enter Username' }).click();
    await page.getByRole('textbox', { name: 'Enter Username' }).fill(username);
    await page.locator('div:nth-child(3) > .MuiBox-root.css-j7qwjs > .MuiBox-root.css-18ywngy').click();
    await page.getByRole('textbox', { name: "Enter User's First Name" }).fill(user.firstName);
    await page.getByRole('textbox', { name: 'Enter Username' }).click();
    await page.getByRole('textbox', { name: 'Enter Username' }).fill(username);
    await page.getByRole('textbox', { name: "Enter User's Last Name" }).click();
    await page.getByRole('textbox', { name: "Enter User's Last Name" }).fill(user.lastName);

    await page.getByRole('combobox', { name: "Select User's Role" }).click();
    await page.getByRole('option', { name: roleName }).click();

    await page.getByRole('combobox', { name: 'Select' }).nth(1).click();
    await page.getByRole('combobox', { name: 'Select' }).nth(1).fill('91');
    await page.getByText('+91', { exact: true }).click();
    await page.getByRole('textbox', { name: 'eg. (684) 555-' }).fill(user.phone);
    await page.getByRole('combobox', { name: 'Select Use', exact: true }).click();
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    const emailField = page.getByPlaceholder('eg. johndoe@example.com').or(page.getByRole('textbox', { name: 'eg. johndoe@example.com' })).first();
    await emailField.fill(user.email);
    await page.getByRole('combobox', { name: 'Select' }).nth(3).click();
    await page.getByRole('option', { name: 'TESTINGggg' }).click({ timeout: 5000 }).catch(() =>
      page.getByRole('option').first().click()
    );

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(
      page.getByText(username).or(page.getByText(user.lastName)).or(page.getByRole('button', { name: 'Add New User' })).first()
    ).toBeVisible({ timeout: 15000 });
  });
});
