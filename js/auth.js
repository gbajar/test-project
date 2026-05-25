document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  if (!validateLogin()) return;
  currentUser = document.getElementById('email').value.trim();
  document.getElementById('navUser').textContent = currentUser;
  showView('appShell');
  showPage('dashboard');
});

function logout() {
  currentUser = '';
  document.getElementById('email').value    = '';
  document.getElementById('password').value = '';
  showView('loginView');
}

function togglePasswordVisibility() {
  const input    = document.getElementById('password');
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  document.getElementById('eyeIcon').style.display    = isHidden ? 'none' : '';
  document.getElementById('eyeOffIcon').style.display = isHidden ? ''     : 'none';
  document.getElementById('togglePassword').setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
}
