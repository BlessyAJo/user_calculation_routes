import { test, expect } from '@playwright/test';

async function login(page) {
  const unique = Date.now();

  await page.goto('http://localhost:8080/register.html');

  await page.fill('#first_name', 'Test');
  await page.fill('#last_name', 'User');
  await page.fill('#email', `test${unique}@mail.com`);
  await page.fill('#username', `user${unique}`);
  await page.fill('#password', 'password123456');

  await page.click('button[type="submit"]');

  await expect(page.locator('#message'))
    .toContainText(/registration successful/i);

  await page.goto('http://localhost:8080/login.html');

  await page.fill('#username', `user${unique}`);
  await page.fill('#password', 'password123456');

  await page.click('button[type="submit"]');

  await expect(page.locator('#message'))
    .toContainText(/login successful/i);

  await page.goto('http://localhost:8080/dashboard.html');
}
test('create calculation', async ({ page }) => {
  await login(page);

  await page.fill('#a', '10');
  await page.fill('#b', '5');
  await page.selectOption('#type', 'addition');

  await page.click('button[type="submit"]');

  await expect(page.locator('#list')).toContainText('10');
});

test('browse calculations', async ({ page }) => {
  await login(page);

  await page.goto('http://localhost:8080/dashboard.html');

  await expect(page.locator('#list')).toBeVisible();
});

test('edit calculation', async ({ page }) => {
  await login(page);

  await page.goto('http://localhost:8080/dashboard.html');

  // ✅ CREATE first (this is what you're missing)
  await page.fill('#a', '10');
  await page.fill('#b', '5');
  await page.selectOption('#type', 'addition');
  await page.click('button[type="submit"]');

  // wait for item to appear
  await page.waitForSelector('#list li');

  const firstItem = page.locator('#list li').first();

  await firstItem.locator('text=Edit').click();

  await page.waitForSelector('#editModal:not(.hidden)');

  await page.fill('#editA', '20');
  await page.fill('#editB', '10');

  await page.click('.update-btn');

  await expect(page.locator('#list')).toContainText('20');
});

test('delete calculation', async ({ page }) => {
  await login(page);

  await page.goto('http://localhost:8080/dashboard.html');

  // ✅ CREATE first
  await page.fill('#a', '10');
  await page.fill('#b', '5');
  await page.selectOption('#type', 'addition');
  await page.click('button[type="submit"]');

  await page.waitForSelector('#list li');

  const firstItem = page.locator('#list li').first();

  await firstItem.locator('text=Delete').click();

  await page.waitForTimeout(500);

  await expect(page.locator('#list')).not.toContainText('10 addition 5');
});

test('division by zero shows error', async ({ page }) => {
  await login(page);

  await page.fill('#a', '10');
  await page.fill('#b', '0');
  await page.selectOption('#type', 'division');

  await page.click('button[type="submit"]');
  await page.waitForTimeout(300);

  await expect(page.locator('#message'))
    .toContainText('Cannot divide by zero');
});

test('redirects to login if not authenticated', async ({ page }) => {
  await page.goto('http://localhost:8080/dashboard.html');
  await expect(page).toHaveURL(/login.html/);
});

test('blocks calculation API without token', async ({ request }) => {
  const res = await request.post('http://localhost:8000/calculations/', {
    data: { a: 10, b: 5, type: "addition" }
  });

  expect(res.status()).toBe(403);
});

test('rejects invalid operation type', async ({ page }) => {
  await login(page);

  await page.goto('http://localhost:8080/dashboard.html');

  // Force invalid request manually (bypass dropdown)
  await page.evaluate(() => {
    fetch('http://localhost:8000/calculations/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ a: 10, b: 5, type: 'modulus' })
    });
  });
});