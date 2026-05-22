const assert = require('assert');
const { passwordHasSpecialChar } = require('../src/validation');

// Test: password without special characters should be rejected
assert.strictEqual(passwordHasSpecialChar('Password123'), false, 'Expected password without special char to be rejected');

// Test: password with at least one special character should be accepted
assert.strictEqual(passwordHasSpecialChar('Password123!'), true, 'Expected password with special char to be accepted');

console.log('Tests passed: password special character validation');
