import { test, expect } from '@playwright/test';
import { register, registerAndLogin } from './helpers/auth';

const BASE = 'http://localhost:8080';
test.beforeAll(async ({ request }) => {
  await request.post(`${BASE}/test/reset-db`);
});

test('profile + password change + re-login flow', async ({ page }) => {

  // 1. LOGIN
  const user = await registerAndLogin(page);
  await page.addInitScript((token) => {
    localStorage.setItem('token', token);
}, user.token);
  // 2. PROFILE PAGE
  await page.goto(`${BASE}/profile.html`);
  await expect(page.locator('#profile_first_name')).toBeVisible();

  await page.fill('#profile_first_name', 'Updated');
  await page.fill('#profile_last_name', 'User');
  await page.fill('#profile_email', `test${Date.now()}@mail.com`);
  await page.fill('#profile_username', user.username);

  await Promise.all([
    page.waitForResponse(res =>
      res.url().includes('/users/me') &&
      res.request().method() === 'PUT'
    ),
    page.click('button[type="submit"]')
  ]);

  await expect(page.locator('#message'))
    .toContainText(/updated|success/i);

  // 3. CHANGE PASSWORD
  await page.fill('#current_password', user.password);

  const newPassword = 'newpassword123456';

  await page.fill('#new_password', newPassword);

  await Promise.all([
    page.waitForResponse(res =>
      res.url().includes('/users/change-password') &&
      res.request().method() === 'PUT'
    ),
    page.locator('#passwordForm button[type="submit"]').click()
  ]);

  // 4. WAIT FOR REDIRECT AFTER PASSWORD CHANGE
  await page.waitForURL(/login\.html/, {
    timeout: 10000
});

  // 5. LOGIN AGAIN WITH NEW PASSWORD
  await page.fill('#username', user.username);
  await page.fill('#password', newPassword);

  await Promise.all([
    page.waitForURL(/dashboard.html/),
    page.click('button[type="submit"]')
  ]);

  // 6. VERIFY TOKEN STABILITY (OPTIONAL BUT SAFE)
  const token = await page.evaluate(() =>
    localStorage.getItem('token')
  );

  expect(token).toBeTruthy();
});

test('profile update fails when email already exists', async ({ browser }) => {
  const context1 = await browser.newContext();
  const page1 = await context1.newPage();
  const user1 = await registerAndLogin(page1);

  const context2 = await browser.newContext();
  const page2 = await context2.newPage();
  const user2 = await registerAndLogin(page2);

  await page1.goto(`${BASE}/profile.html`);

  await page1.fill('#profile_first_name', 'Updated');
  await page1.fill('#profile_last_name', 'User');
  await page1.fill('#profile_email', user2.email);
  await page1.fill('#profile_username', user1.username);

  await page1.click('button[type="submit"]');

  await expect(page1.locator('#message'))
    .toContainText(/email already in use/i);
});

test('profile update fails when username already exists', async ({ browser }) => {
  const context1 = await browser.newContext();
  const page1 = await context1.newPage();
  const user1 = await registerAndLogin(page1);

  const context2 = await browser.newContext();
  const page2 = await context2.newPage();
  const user2 = await registerAndLogin(page2);

  await page1.goto(`${BASE}/profile.html`);

  await page1.fill('#profile_first_name', 'Updated');
  await page1.fill('#profile_last_name', 'User');
  await page1.fill('#profile_email', user1.email);
  await page1.fill('#profile_username', user2.username);

  await page1.click('button[type="submit"]');

  await expect(page1.locator('#message'))
    .toContainText(/username already in use/i);
});


test('password change fails when new password equals current password', async ({ page }) => {
  const user = await registerAndLogin(page);

  await page.goto(`${BASE}/profile.html`);

  await page.fill('#current_password', user.password);
  await page.fill('#new_password', user.password);

  await page.click('#passwordForm button');

  await expect(page.locator('#message'))
    .toContainText(/cannot be same/i);
});
test('password change fails when password is too short', async ({ page }) => {
  await registerAndLogin(page);

  await page.goto(`${BASE}/profile.html`);

  await page.fill('#current_password', 'password12334567890');
  await page.fill('#new_password', 'short');

  await page.click('#passwordForm button');

  await expect(page.locator('#message'))
    .toContainText(/12 characters/i);
});
test('password change fails with wrong current password', async ({ page }) => {
  await registerAndLogin(page);

  await page.goto(`${BASE}/profile.html`);

  await page.fill('#current_password', 'wrongpass');
  await page.fill('#new_password', 'newpassword123456');

  await page.click('#passwordForm button');

  await expect(page.locator('#message'))
    .toContainText(/current password incorrect/i);
});

test('password change fails with empty fields', async ({ page }) => {
  await registerAndLogin(page);

  await page.goto(`${BASE}/profile.html`);

  await page.click('#passwordForm button');

  await expect(page.locator('#message'))
    .toContainText(/required/i);
});
test('password change logs out user', async ({ page }) => {
  await registerAndLogin(page);

  await page.goto(`${BASE}/profile.html`);

  await page.fill('#current_password', 'password12334567890');
  await page.fill('#new_password', 'newpassword123456');

  await page.click('#passwordForm button');

  await expect(page).toHaveURL(/login.html/);

  const token = await page.evaluate(() =>
    localStorage.getItem('token')
  );

  expect(token).toBeNull();
});