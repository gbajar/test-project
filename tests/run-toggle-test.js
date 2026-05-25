// Simple test runner to reproduce password toggle issue and verify fix
const fs = require('fs');
const assert = require('assert');

const INDEX_HTML = __dirname + '/../index.html';
const html = fs.readFileSync(INDEX_HTML, 'utf8');

// Find CSS rule for hiding the toggle when input has error
let toggleCssDisplay = null;
const cssRuleMatch = html.match(/\.input-wrap\s+input\.error\s*~\s*\.toggle-pw\s*\{([\s\S]*?)\}/);
if (cssRuleMatch) {
  const body = cssRuleMatch[1];
  const displayMatch = body.match(/display\s*:\s*([^;\n]+)/);
  if (displayMatch) toggleCssDisplay = displayMatch[1].trim();
}

// Minimal fake DOM elements used by the functions
function createElement(id) {
  return {
    id,
    value: '',
    type: 'text',
    textContent: '',
    style: { display: '' },
    attributes: {},
    classList: {
      _set: new Set(),
      add(name) { this._set.add(name); },
      remove(name) { this._set.delete(name); },
      contains(name) { return this._set.has(name); }
    },
    setAttribute(name, value) { this.attributes[name] = value; }
  };
}

const elements = new Map();
['email','password','emailError','passwordError','eyeIcon','eyeOffIcon','togglePassword'].forEach(id => {
  elements.set(id, createElement(id));
});

// Setup initial state: password is short to trigger validation error
const emailEl = elements.get('email');
const passwordEl = elements.get('password');
const emailErr = elements.get('emailError');
const passErr = elements.get('passwordError');
const eyeIcon = elements.get('eyeIcon');
const eyeOffIcon = elements.get('eyeOffIcon');
const togglePassword = elements.get('togglePassword');

emailEl.value = ''; // empty email to also trigger email error
passwordEl.value = '123';
passwordEl.type = 'password';

// Minimal document implementation
const documentFake = {
  getElementById(id) {
    return elements.get(id);
  }
};

// Copy of validateLogin from index.html, adapted to use documentFake
function validateLogin() {
  const email = documentFake.getElementById('email');
  const password = documentFake.getElementById('password');
  const emailErr = documentFake.getElementById('emailError');
  const passErr = documentFake.getElementById('passwordError');
  let valid = true;

  emailErr.textContent = '';
  passErr.textContent = '';
  // emulate classList behavior
  password.classList.remove('error');
  email.classList.remove('error');

  if (!email.value.trim()) {
    emailErr.textContent = 'Email is required.';
    email.classList.add('error');
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    emailErr.textContent = 'Enter a valid email address.';
    email.classList.add('error');
    valid = false;
  }

  if (!password.value) {
    passErr.textContent = 'Password is required.';
    password.classList.add('error');
    valid = false;
  } else if (password.value.length < 6) {
    passErr.textContent = 'Password must be at least 6 characters.';
    password.classList.add('error');
    valid = false;
  }

  return valid;
}

// Copy of togglePasswordVisibility from index.html, adapted to use documentFake
function togglePasswordVisibility() {
  const input = documentFake.getElementById('password');
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  documentFake.getElementById('eyeIcon').style.display = isHidden ? 'none' : '';
  documentFake.getElementById('eyeOffIcon').style.display = isHidden ? '' : 'none';
  documentFake.getElementById('togglePassword').setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
}

// Run the reproduction steps
(function runTest() {
  // 1. Trigger validation error
  const valid = validateLogin();
  assert.strictEqual(valid, false, 'validateLogin should return false for invalid input');

  // 2. Apply CSS simulation: if the CSS rule sets display:none for the toggle when input has error, simulate that
  if (passwordEl.classList.contains('error')) {
    if (toggleCssDisplay) {
      togglePassword.style.display = toggleCssDisplay;
    } else {
      // default: visible
      togglePassword.style.display = '';
    }
  }

  // 3. Simulate clicking the toggle
  function simulateClickOnToggle() {
    if (togglePassword.style.display === 'none') {
      throw new Error('Toggle is hidden (display:none) and cannot be clicked');
    }
    // otherwise, perform the action
    togglePasswordVisibility();
  }

  // The test asserts that after a validation error we can still toggle the password visibility
  try {
    simulateClickOnToggle();
  } catch (err) {
    console.error('Test failed: ', err.message);
    process.exit(1);
  }

  // After clicking, the password input type should be 'text'
  assert.strictEqual(passwordEl.type, 'text', 'Password input type should be text after toggling');

  console.log('Test passed: password visibility toggle works after validation error');
})();
