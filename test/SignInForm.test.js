const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Password toggle persistence', () => {
  test('toggle switches password to text after a failed validation', () => {
    const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
    const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
    const { window } = dom;
    const { document } = window;

    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const form = document.getElementById('loginForm');

    // Enter valid email but invalid (too short) password to trigger validation error
    email.value = 'user@example.com';
    password.value = '123';

    // Submit the form to trigger validation
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.click();

    // Validation should mark the password input with the error class
    expect(password.classList.contains('error')).toBe(true);

    // Click the show/hide toggle
    const toggle = document.getElementById('togglePassword');
    toggle.click();

    // Password input type should change to text
    expect(password.type).toBe('text');
  });
});
