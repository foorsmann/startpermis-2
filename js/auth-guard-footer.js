/**
 * Auth Guard (FOOTER) - Firebase state check + Snapshot update
 * Start Permis - Driving School Platform
 *
 * This script runs after Firebase SDK loads to verify auth state.
 * Include at the end of <body> after Firebase scripts.
 */

(function() {
  'use strict';

  var root = document.documentElement;

  // Skip in Webflow design mode
  if (root.classList.contains('wf-design-mode')) return;

  function normPath(p) {
    p = String(p || '/');
    p = p.split('?')[0].split('#')[0];
    p = p.replace(/\/+$/, '');
    return p || '/';
  }

  var path = normPath(location.pathname);

  // Pages exempt from redirect (but still update snapshot)
  var EXEMPT_REDIRECT = {
    '/auth': true,
    '/confirmare-email': true,
    '/resetare-parola': true,
    '/verifica-email': true,
    '/login': true,
    '/sign-up': true,
    '/politica-de-confidentialitate': true,
    '/termeni-si-conditii': true,
    '/politica-de-cookie-uri': true,
    '/404': true,
    '/401': true
  };

  var VERIFY_URL = '/verifica-email';
  var SNAP_KEY = 'sp_auth_snapshot_v1';

  function showPage() {
    root.classList.remove('sp-auth-preload');
  }

  function writeSnap(obj) {
    try {
      localStorage.setItem(SNAP_KEY, JSON.stringify(obj));
    } catch(e) {}
  }

  function snapAnon() {
    writeSnap({ a: 0, ev: 0, uid: '', t: Date.now() });
  }

  function snapUser(user) {
    writeSnap({
      a: 1,
      uid: String(user && user.uid || ''),
      ev: (user && user.emailVerified) ? 1 : 0,
      t: Date.now()
    });
  }

  function redirectToVerify() {
    try {
      sessionStorage.setItem('sp_return_after_verify', location.pathname + location.search + location.hash);
    } catch(e) {}
    root.classList.add('sp-auth-preload');
    location.replace(VERIFY_URL);
  }

  // Fail-safe: don't leave blank screen if Firebase doesn't load
  var failSafe = setTimeout(showPage, 12000);

  function waitForAuth(timeoutMs) {
    return new Promise(function(resolve, reject) {
      var t0 = Date.now();
      (function tick() {
        var ok = window.firebase && typeof window.firebase.auth === 'function';
        if (ok) return resolve(window.firebase.auth());
        if (Date.now() - t0 > timeoutMs) return reject(new Error('auth-timeout'));
        setTimeout(tick, 50);
      })();
    });
  }

  // Store unsubscribe function to prevent memory leaks
  var unsubscribeAuth = null;

  waitForAuth(8000).then(function(auth) {
    unsubscribeAuth = auth.onAuthStateChanged(function(user) {
      clearTimeout(failSafe);

      // Anonymous -> allow page, save snapshot
      if (!user) {
        snapAnon();
        showPage();
        return;
      }

      // Logged in -> save snapshot
      snapUser(user);

      // Verified -> allow page
      if (user.emailVerified) {
        showPage();
        return;
      }

      // Unverified -> redirect (except exempt pages)
      if (!EXEMPT_REDIRECT[path]) {
        redirectToVerify();
        return;
      }

      // On exempt pages, just show
      showPage();
    });
  }).catch(function() {
    clearTimeout(failSafe);
    showPage();
  });

  // Cleanup on page unload to prevent memory leaks
  window.addEventListener('pagehide', function() {
    if (typeof unsubscribeAuth === 'function') {
      unsubscribeAuth();
      unsubscribeAuth = null;
    }
  });
})();
