(function () {
  function getExpirySeconds(remember) {
    return remember ? 30 * 24 * 3600 : 3600; // 30 days vs 1 hour
  }

  function fakeServerAuthenticate(email, password, remember) {
    // Simulate a server response with a token and expiry
    const token = (typeof btoa !== 'undefined') ? btoa(email + ':' + Date.now()) : Buffer.from(email + ':' + Date.now()).toString('base64');
    const expiresIn = getExpirySeconds(remember);
    return Promise.resolve({ token: token, expiresIn: expiresIn });
  }

  function setAuthCookie(token, expiresIn) {
    if (typeof document !== 'undefined') {
      let cookie = 'auth_token=' + encodeURIComponent(token) + '; path=/; samesite=lax';
      if (typeof expiresIn === 'number' && expiresIn > 0) {
        cookie += '; max-age=' + expiresIn;
      }
      document.cookie = cookie;
    }
  }

  function login(email, password, remember) {
    return fakeServerAuthenticate(email, password, remember).then(res => {
      setAuthCookie(res.token, res.expiresIn);
      return res;
    });
  }

  // Expose for browser
  if (typeof window !== 'undefined') {
    window.Auth = window.Auth || {};
    window.Auth.getExpirySeconds = getExpirySeconds;
    window.Auth.login = login;
  }

  // Export for Node tests
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getExpirySeconds: getExpirySeconds, login: login };
  }
})();
