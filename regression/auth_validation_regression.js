const assert = require('assert');
const { validateLogin } = require('../js/validation');

function createClassList() {
  const classes = new Set();
  return {
    add(name) {
      classes.add(name);
    },
    remove(name) {
      classes.delete(name);
    },
    contains(name) {
      return classes.has(name);
    },
  };
}

function createInput(value = '') {
  return {
    value,
    classList: createClassList(),
  };
}

function createError() {
  return {
    textContent: '',
  };
}

function buildDocument(emailValue = 'user@example.com', passwordValue = '') {
  const email = createInput(emailValue);
  const password = createInput(passwordValue);
  const emailError = createError();
  const passwordError = createError();

  return {
    email,
    password,
    emailError,
    passwordError,
    getElementById(id) {
      switch (id) {
        case 'email':
          return email;
        case 'password':
          return password;
        case 'emailError':
          return emailError;
        case 'passwordError':
          return passwordError;
        default:
          return null;
      }
    },
  };
}

function testPasswordWhitespaceOnly() {
  const originalDocument = global.document;
  const doc = buildDocument('user@example.com', '      ');
  global.document = doc;

  try {
    const isValid = validateLogin();
    assert.strictEqual(isValid, false, 'Whitespace-only passwords should not pass validation');
    assert.strictEqual(
      doc.passwordError.textContent,
      'Password must not be blank.',
      'Expected blank password error message for whitespace-only passwords'
    );
    assert.strictEqual(doc.password.classList.contains('error'), true, 'Password field should be marked in error');
  } finally {
    global.document = originalDocument;
  }
}

testPasswordWhitespaceOnly();
console.log('Auth validation regression tests passed.');
