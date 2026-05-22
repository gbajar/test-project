function passwordHasSpecialChar(password) {
  if (typeof password !== 'string') return false;
  // At least one special character from the set: ! @ # $ % ^ & * ( ) , . ? " : { } | < >
  return /[!@#$%^&*(),.?":{}|<>]/.test(password);
}

// Export for Node (tests) and attach to window for browser usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { passwordHasSpecialChar };
} else {
  window.passwordHasSpecialChar = passwordHasSpecialChar;
}
