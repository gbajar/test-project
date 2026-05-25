const assert = require('assert');
const validatePassword = require('./passwordValidator');

// Basic sanity
assert.strictEqual(typeof validatePassword, 'function', 'validatePassword should be a function');

function shouldFail(pwd, expectedMessage) {
  const res = validatePassword(pwd);
  assert.strictEqual(res.valid, false, `Expected '${pwd}' to be invalid`);
  assert.strictEqual(res.message, expectedMessage, `Unexpected message for '${pwd}'`);
}

function shouldPass(pwd) {
  const res = validatePassword(pwd);
  assert.strictEqual(res.valid, true, `Expected '${pwd}' to be valid`);
}

// Tests
shouldFail('', 'Password is required.');
shouldFail('abc', 'Password must be at least 6 characters.');
shouldFail('abcdef', 'Password must contain at least one number');
shouldPass('abcd1f!');
shouldPass('123456!');

console.log('All tests passed');
