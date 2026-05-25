const path = require('path');
const { JSDOM } = require('jsdom');
const assert = require('assert');

const indexPath = path.join(__dirname, '..', 'index.html');

JSDOM.fromFile(indexPath, { runScripts: 'dangerously', resources: 'usable' })
  .then(dom => {
    // Wait for the inline script to execute and attach to window
    setTimeout(() => {
      const window = dom.window;
      const document = window.document;

      const email = document.getElementById('email');
      const password = document.getElementById('password');
      const passwordError = document.getElementById('passwordError');

      // Test: password with letters only should fail
      email.value = 'user@example.com';
      password.value = 'abcdefg'; // only letters, no digits
      const valid1 = window.validate();
      try {
        assert.strictEqual(valid1, false, 'Validation should fail for password with no digits');
        assert.ok(/number/.test(passwordError.textContent), 'Error message should mention number requirement');
      } catch (err) {
        console.error('Test failed: letters-only password should be invalid');
        console.error(err && err.message);
        process.exit(1);
      }

      // Test: password with at least one digit and special character should pass (and length >= 6)
      password.value = 'abcde1!';
      const valid2 = window.validate();
      try {
        assert.strictEqual(valid2, true, 'Validation should pass for password with a digit and special character');
      } catch (err) {
        console.error('Test failed: password with digit and special character should be valid');
        console.error(err && err.message);
        process.exit(1);
      }

      console.log('All tests passed');
      process.exit(0);
    }, 50);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
