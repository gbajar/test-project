(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.validatePassword = factory();
  }
})(this, function () {
  return function (password) {
    // Required
    if (!password) {
      return { valid: false, message: 'Password is required.' };
    }

    // Minimum length
    if (password.length < 6) {
      return { valid: false, message: 'Password must be at least 6 characters.' };
    }

    // Must contain at least one digit
    if (!/\d/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }

    return { valid: true };
  };
});
