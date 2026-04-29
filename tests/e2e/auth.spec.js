import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:8080';

// -------------------------
// REGISTER SUCCESS
// -------------------------
test('user can register successfully', async ({ page }) => {
  await page.goto(`${BASE}/register.html`);

  await page.fill('#first_name', 'John');
  await page.fill('#last_name', 'Doe');
  const unique = Date.now();
  await page.fill('#email', `john${unique}@test.com`);
  await page.fill('#username', `john${unique}`);
  await page.fill('#password', 'password123234567890');

  await page.click('button[type="submit"]');

  const message = page.locator('#message');
  await page.waitForTimeout(300);
  await expect(message).toBeVisible();
  await expect(message).toContainText(/registration successful/i);
});

// -------------------------
// REGISTER FAILURE (invalid email / missing data handled by backend)
// -------------------------
test('register fails when fields are empty', async ({ page }) => {
  await page.goto('http://localhost:8080/register.html');

  await page.click('button[type="submit"]');
  await expect(page.locator('#message'))
    .toContainText(/all fields are required/i);
});

test('register fails with short password', async ({ page }) => {
  await page.goto('http://localhost:8080/register.html');

  await page.fill('#first_name', 'John');
  await page.fill('#last_name', 'Doe');
  await page.fill('#email', `john${Date.now()}@test.com`);
  await page.fill('#username', `john${Date.now()}`);
  await page.fill('#password', '123'); // invalid

  await page.click('button[type="submit"]');

  await expect(page.locator('#message'))
    .toHaveText(/password must be minimum 12 characters/i);
});

test('register fails with invalid email', async ({ page }) => {
  await page.goto('http://localhost:8080/register.html');

  await page.fill('#first_name', 'John');
  await page.fill('#last_name', 'Doe');
  await page.fill('#email', 'invalid-email');
  await page.fill('#username', `john${Date.now()}`);
  await page.fill('#password', 'password12334567890');

  await page.click('button[type="submit"]');

  await expect(page.locator('#message'))
    .toHaveText(/invalid email/i);
});

// -------------------------
// LOGIN SUCCESS
// -------------------------
test('login succeeds and stores token', async ({ page }) => {
  const unique = Date.now();
  const username = `user${unique}`;

  await page.goto(`${BASE}/register.html`);

  await page.fill('#first_name', 'Test');
  await page.fill('#last_name', 'User');
  await page.fill('#email', `test${unique}@mail.com`);
  await page.fill('#username', username);
  await page.fill('#password', 'password12334567890');

  await page.click('button[type="submit"]');

  await expect(page.locator('#message')).toHaveText(/registration successful/i);

  await page.goto(`${BASE}/login.html`);

  await page.fill('#username', username);
  await page.fill('#password', 'password12334567890');

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/dashboard.html/);
  const token = await page.evaluate(() =>
    localStorage.getItem('token')
  );

  expect(token).toBeTruthy();
});


// -------------------------
// LOGIN FAILURE
// -------------------------
test('login fails with wrong credentials', async ({ page }) => {
  await page.goto(`${BASE}/login.html`);

  await page.fill('#username', 'wronguser');
  await page.fill('#password', 'wrongpass');

  await page.click('button[type="submit"]');

  const message = page.locator('#message');
  await expect(message).toContainText('Invalid credentials');
});

test('blocks dashboard access without login', async ({ page }) => {
  await page.goto('http://localhost:8080/dashboard.html');
  await expect(page).toHaveURL(/login.html/);
});
test('redirects to login if not authenticated', async ({ page }) => {
  await page.goto('http://localhost:8080/dashboard.html');

  await expect(page).toHaveURL(/login.html/);
});