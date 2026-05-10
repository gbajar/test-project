const assert = require('assert');

function isValidPassword(pw) {
  if (!pw) return false;
  if (pw.length < 6) return false;
  if (!/\d/.test(pw)) return false;
  return true;
}

// Tests: passwords without numbers should be rejected
assert.strictEqual(isValidPassword('abcdef'), false, 'should reject password without numbers');
assert.strictEqual(isValidPassword('abcde'), false, 'should reject short password even if numbers absent');

// Tests: passwords with numbers should be accepted (if length >= 6)
assert.strictEqual(isValidPassword('abc123'), true, 'should accept password with numbers');
assert.strictEqual(isValidPassword('123456'), true, 'should accept numeric password');

console.log('All password validation tests passed.');
