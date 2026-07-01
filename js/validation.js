function validateLogin() {
  const email    = document.getElementById('email');
  const password = document.getElementById('password');
  const emailErr = document.getElementById('emailError');
  const passErr  = document.getElementById('passwordError');
  let valid = true;

  emailErr.textContent = '';
  passErr.textContent  = '';
  email.classList.remove('error');
  password.classList.remove('error');

  const passwordValue = password.value.trim();

  if (!email.value.trim()) {
    emailErr.textContent = 'Email is required.';
    email.classList.add('error');
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    emailErr.textContent = 'Enter a valid email address.';
    email.classList.add('error');
    valid = false;
  }

  if (!passwordValue) {
    passErr.textContent = 'Password must not be blank.';
    password.classList.add('error');
    valid = false;
  } else if (passwordValue.length < 6) {
    passErr.textContent = 'Password must be at least 6 characters.';
    password.classList.add('error');
    valid = false;
  }

  return valid;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateLogin };
}
