function validatePassword(password) {
  if (!password) {
    return { valid: false, error: 'Password is required.' };
  }

  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters.' };
  }

  // Require at least one special character
  const specialCharRegex = /[!@#$%^&*(),.?\":{}|<>]/;
  if (!specialCharRegex.test(password)) {
    return { valid: false, error: 'Password must contain at least one special character (e.g., !, @, #, $).' };
  }

  return { valid: true, error: null };
}

// Support CommonJS for tests and attach to window for browser usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validatePassword };
} else {
  window.validatePassword = validatePassword;
}
