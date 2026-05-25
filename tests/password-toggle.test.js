/* eslint-disable no-console */
// Regression test for password visibility toggle
// This test uses jsdom if available. If jsdom is not installed, the test will skip.

const fs = require('fs');
const path = require('path');

async function run() {
  let JSDOM;
  try {
    JSDOM = require('jsdom').JSDOM;
  } catch (err) {
    console.log('SKIPPED: jsdom not installed. To run this test, install jsdom (npm i -D jsdom).');
    process.exit(0);
  }

  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
  const { window } = dom;
  const { document } = window;

  // wait for scripts to execute
  await new Promise((res) => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') return res();
    window.addEventListener('load', () => res());
    setTimeout(() => res(), 200);
  });

  const password = document.getElementById('password');
  const toggle = document.getElementById('togglePassword');
  const eye = document.getElementById('eyeIcon');
  const eyeOff = document.getElementById('eyeOffIcon');
  const form = document.getElementById('loginForm');

  if (!password || !toggle || !eye || !eyeOff || !form) {
    console.error('ERROR: required elements not found in DOM');
    process.exit(2);
  }

  // Ensure initial state
  if (password.type !== 'password') {
    console.error('FAIL: initial password type should be password');
    process.exit(2);
  }

  // Toggle once (before failed submission)
  toggle.click();
  if (password.type !== 'text') {
    console.error('FAIL: password should be visible after toggle (before failed submit)');
    process.exit(2);
  }

  // Simulate failed submit (empty email)
  // Clear email, set short password to trigger validation
  const email = document.getElementById('email');
  email.value = '';
  password.value = '123';

  // dispatch submit
  const evt = new window.Event('submit', { bubbles: true, cancelable: true });
  form.dispatchEvent(evt);

  // After failed validation, the password input type should remain as 'text'
  if (password.type !== 'text') {
    console.error('FAIL: password visibility should persist after failed submit');
    process.exit(2);
  }

  // Try toggling again (after failed submission)
  toggle.click();
  if (password.type !== 'password') {
    console.error('FAIL: password should be hidden after second toggle (after failed submit)');
    process.exit(2);
  }

  console.log('PASS: password toggle works before and after failed submission');
  process.exit(0);
}

run().catch(err => {
  console.error('ERROR:', err);
  process.exit(3);
});
