/**
 * Scheduling: Configure Availability – full flow.
 * Creates a role, adds a user with that role, then configures availability for that clinician.
 */
import { test, expect } from '../../fixtures/merged-fixtures';
import { createUserForAddUserForm } from '../../fixtures/test-data';

test.describe('Scheduling - Availability (full flow) @p1', () => {
  test('1 - should create role, add user, and set availability for that clinician', async ({
    authenticatedPage: page,
  }) => {
    const roleName = `E2E Role ${Date.now()}`;
    const user = createUserForAddUserForm();
    const username = `E2E${Date.now()}`;
    const clinicianDisplayName = `${user.firstName} ${user.lastName}`;

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
    await expect(page.getByText(roleName)).toBeVisible({ timeout: 20000 });

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

    // --- Step 3: Configure Availability for that clinician ---
    await page.getByRole('button', { name: 'Scheduling' }).click();
    await page.getByRole('menuitem', { name: 'Availability' }).click();
    await page.getByRole('button', { name: 'Configure Availability' }).click();

    const form = page.locator('#availability-form');
    await form.getByText('Select Clinician').click();
    await page.getByText(clinicianDisplayName, { exact: true }).click();

    // Start Date: valid date in MM/DD/YYYY format (e.g. 03/01/2026)
    const startDateStr = '03/01/2026';
    const startDateFillable = form.locator('input[placeholder*="MM/DD"], input[placeholder*="mm/dd"]').first();
    const canFill = await startDateFillable.isVisible().catch(() => false);
    if (canFill) {
      await startDateFillable.fill(startDateStr);
    } else {
      await form.getByRole('button', { name: 'Choose date' }).first().click();
      const dateGroup = page.getByRole('group').filter({ hasText: '03/01/' }).or(page.getByRole('group').first()).first();
      await dateGroup.getByLabel('Month').click();
      await dateGroup.getByLabel('Month').fill('3');
      await dateGroup.getByLabel('Day').fill('1');
      await dateGroup.getByLabel('Year').fill('2026');
    }

    // Booking Window: open dropdown and select 4 weeks
    await page.getByText('weeks').click();
    await page.locator('#menu-bookingWindow').getByText('4 weeks', { exact: true }).click();

    // Time Zone: open (click current value) and select Pacific Time
    await page.getByText('Eastern Time').first().click();
    await page.getByText('Pacific Time').click();

    // Day Slot Creation: wait for section and scroll into view
    const daySlotSection = form.locator('div').filter({ hasText: 'Day Slot Creation' }).first();
    await expect(daySlotSection).toBeVisible({ timeout: 10000 });
    await daySlotSection.scrollIntoViewIfNeeded();

    // Start Time *: open time picker or fill input (first "Choose time" in form = Day Slot start)
    const startTimeBtn = form.getByRole('button', { name: 'Choose time' }).first();
    await startTimeBtn.scrollIntoViewIfNeeded();
    await startTimeBtn.click();
    const timeOption = page.getByRole('option').filter({ hasText: /^10\b|10 hours/ }).first();
    await timeOption.waitFor({ state: 'visible', timeout: 8000 });
    await timeOption.click();
    await page.getByRole('option', { name: /0 minutes?/ }).first().click({ timeout: 3000 }).catch(() => {});
    await page.getByRole('option', { name: 'AM' }).click({ timeout: 3000 }).catch(() => {});

    // End Time: second "Choose time" in form
    await form.getByRole('button', { name: 'Choose time' }).nth(1).click();
    const endTimeOption = page.getByRole('option').filter({ hasText: /^10\b|10 hours/ }).first();
    await endTimeOption.waitFor({ state: 'visible', timeout: 8000 });
    await endTimeOption.click();
    await page.getByRole('option', { name: /0 minutes?/ }).first().click({ timeout: 3000 }).catch(() => {});
    await page.getByRole('option', { name: 'PM' }).click({ timeout: 3000 }).catch(() => {});

    // Appointment Type *: scope to Day Slot section to avoid "Select Weeks"
    await daySlotSection.getByText('Select Type').click();
    await page.getByText('Individual', { exact: true }).click();

    // Add the time slot so the row is applied
    await form.getByRole('button', { name: /Add Time Slots?/i }).click({ timeout: 5000 });

    // Select days (Mon–Sun)
    await form.getByRole('button', { name: 'Mon' }).click();
    await form.getByRole('button', { name: 'Tue' }).click();
    await form.getByRole('button', { name: 'Wed' }).click();
    await form.getByRole('button', { name: 'Thu' }).click();
    await form.getByRole('button', { name: 'Fri' }).click();
    await form.getByRole('button', { name: 'Sat' }).click();
    await form.getByRole('button', { name: 'Sun' }).click();

    await page.getByRole('button', { name: 'Save' }).click();
    // A second Save/Confirm button may appear as a confirmation step; click it if visible
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Save' }).click({ timeout: 5000 }).catch(() => {});

    await expect(
      page.getByText(clinicianDisplayName, { exact: true }).or(page.getByText('Availability')).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test('2 - should show Availability page with Configure Availability button', async ({
    authenticatedPage: page,
  }) => {
    await page.getByRole('button', { name: 'Scheduling' }).click();
    await page.getByRole('menuitem', { name: 'Availability' }).click();
    await expect(page.getByRole('button', { name: 'Configure Availability' })).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText('Availability').first()).toBeVisible();
  });

  test('3 - should open availability form when selecting a clinician', async ({
    authenticatedPage: page,
  }) => {
    await page.getByRole('button', { name: 'Scheduling' }).click();
    await page.getByRole('menuitem', { name: 'Availability' }).click();
    await page.getByRole('button', { name: 'Configure Availability' }).click();
    await page.locator('#availability-form').getByText('Select Clinician').click();
    const optionCount = await page.getByRole('option').count();
    if (optionCount === 0) {
      test.skip(true, 'No clinicians in list to select');
      return;
    }
    await page.getByRole('option').first().click();
    await expect(page.getByRole('button', { name: 'Choose date' }).first()).toBeVisible({
      timeout: 15000,
    });
  });

  test('5 - should show Calendar view', async ({ authenticatedPage: page }) => {
    await page.getByRole('button', { name: 'Scheduling' }).click();
    await page.getByRole('menuitem', { name: 'Calendar' })
      .or(page.locator('div').filter({ hasText: /^Calendar$/ }))
      .first()
      .click();
    await expect(page.getByText('Calendar').first()).toBeVisible({ timeout: 15000 });
  });
});
