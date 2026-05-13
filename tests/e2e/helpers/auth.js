const BASE = 'http://localhost:8080';

export async function registerAndLogin(page) {
  const unique = Date.now();
  const username = `user${unique}`;
  const email = `test${unique}@mail.com`;
  const password = 'password12334567890';

  // REGISTER
  await page.goto(`${BASE}/register.html`);

  await page.fill('#first_name', 'Test');
  await page.fill('#last_name', 'User');
  await page.fill('#email', email);
  await page.fill('#username', username);
  await page.fill('#password', password);

  await Promise.all([
    page.waitForResponse(r => r.url().includes('/users/register')),
    page.click('button[type="submit"]')
  ]);

//   console.log("➡️ Going to login page");
  await page.goto(`${BASE}/login.html`);
  
//   console.log("➡️ Filling login form");

  await page.fill('#username', username);
  await page.fill('#password', password);

  await Promise.all([
    page.waitForResponse(r => r.url().includes('/users/login')),
    page.click('button[type="submit"]')
  ]);
  // VERIFY TOKEN EXISTS (SAFE CHECK)
  await page.waitForURL(/dashboard.html/);

  const token = await page.evaluate(() =>
    localStorage.getItem('token')
  );
  return { username, password, token, email };
}

export async function register(page, username) {
  const password = 'password12334567890';
  const unique = Date.now();

  await page.goto('http://localhost:8080/register.html');

  await page.fill('#first_name', 'Test');
  await page.fill('#last_name', 'User');
  await page.fill('#email', `test${unique}@mail.com`);
  await page.fill('#username', username);
  await page.fill('#password', password);

  await Promise.all([
    page.waitForResponse(r => r.url().includes('/users/register')),
    page.click('button[type="submit"]')
  ]);

  return { username, password };
}