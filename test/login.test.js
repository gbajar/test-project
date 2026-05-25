const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Sign-in password toggle', () => {
  let dom, window, document;

  beforeEach(async () => {
    const html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf8');
    dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
    window = dom.window;
    document = window.document;

    // Wait for scripts to run
    await new Promise(resolve => {
      if (document.readyState === 'complete') return resolve();
      window.addEventListener('load', () => setTimeout(resolve, 0));
    });
  });

  afterEach(() => {
    if (dom && dom.window && dom.window.close) dom.window.close();
  });

  test('preserves password toggle after failed sign-in', () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const toggle = document.getElementById('togglePassword');

    // Fill form with invalid password
    email.value = 'test@example.com';
    password.value = '123';

    const form = document.getElementById('loginForm');
    form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));

    // Validation error should be shown
    const passErr = document.getElementById('passwordError');
    expect(passErr.textContent).toBe('Password must be at least 6 characters.');

    // Toggle should still work: type changes from password -> text
    expect(password.type).toBe('password');

    toggle.dispatchEvent(new window.Event('click', { bubbles: true, cancelable: true }));
    expect(password.type).toBe('text');
  });
});
