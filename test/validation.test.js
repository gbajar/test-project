import assert from 'assert';
import { validatePassword } from '../src/validation.js';

// Test: passwords without numbers should fail
assert.strictEqual(
  validatePassword('abcdef'),
  'Password must contain at least one numeric character.'
);

// Test: passwords with at least one number should pass
assert.strictEqual(validatePassword('abcde1'), null);

console.log('All validation tests passed.');
