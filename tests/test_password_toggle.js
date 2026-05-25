const path = require('path');
const { JSDOM } = require('jsdom');
const assert = require('assert');

const indexPath = path.join(__dirname, '..', 'index.html');

JSDOM.fromFile(indexPath, { runScripts: 'dangerously', resources: 'usable' })
  .then(dom => {
    setTimeout(() => {
      const window = dom.window;
      const document = window.document;

      const email = document.getElementById('email');
      const password = document.getElementById('password');
      const toggle = document.getElementById('togglePassword');
      const passwordError = document.getElementById('passwordError');

      try {
        assert.ok(toggle, 'Toggle button should exist');
        assert.strictEqual(password.type, 'password', 'Initial type should be password');

        // Click toggle -> should show password
        toggle.click();
        assert.strictEqual(password.type, 'text', 'Password type should be text after clicking toggle');

        // Enter invalid password and submit form
        email.value = 'user@example.com';
        password.value = 'abcdefg'; // only letters, no digits
        const valid1 = window.validate();
        assert.strictEqual(valid1, false, 'Validation should fail for password with no digits');
        assert.ok(/number/.test(passwordError.textContent), 'Error message should mention number requirement');

        // After validation failure, the toggle should still work
        toggle.click();
        assert.strictEqual(password.type, 'password', 'Password type should toggle back to password after failed submit');
      } catch (err) {
        console.error('Test failed:', err && err.message);
        process.exit(1);
      }

      console.log('Password toggle test passed');
      process.exit(0);
    }, 50);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
