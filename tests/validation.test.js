const assert = require('assert');
const validatePassword = require('../passwordValidator');

function shouldFail(pwd, expectedMessage) {
  const res = validatePassword(pwd);
  assert.strictEqual(res.valid, false, `Expected '${pwd}' to be invalid`);
  assert.strictEqual(res.message, expectedMessage, `Unexpected message for '${pwd}'`);
}

function shouldPass(pwd) {
  const res = validatePassword(pwd);
  assert.strictEqual(res.valid, true, `Expected '${pwd}' to be valid`);
}

// Test cases for special character requirement
shouldFail('Password123', 'Password must contain at least one special character (e.g., !, @, #, $).');
shouldPass('Password123!');

console.log('Validation tests passed');
process.exit(0);
