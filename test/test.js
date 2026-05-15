const { validatePassword } = require('../src/validators');
const assert = require('assert');

function run() {
  // Password without special character should be rejected
  let r = validatePassword('abc123');
  assert.strictEqual(r.valid, false, 'Password without special char should be invalid');
  assert.strictEqual(r.error, 'Password must contain at least one special character (e.g., !, @, #, $).');

  // Password with special character should be accepted
  r = validatePassword('abc123!');
  assert.strictEqual(r.valid, true, 'Password with special char should be valid');

  // Empty password
  r = validatePassword('');
  assert.strictEqual(r.valid, false, 'Empty password should be invalid');
  assert.strictEqual(r.error, 'Password is required.');

  // Too short password
  r = validatePassword('a!2');
  assert.strictEqual(r.valid, false, 'Too short password should be invalid');
  assert.strictEqual(r.error, 'Password must be at least 6 characters.');

  console.log('All tests passed');
}

run();
