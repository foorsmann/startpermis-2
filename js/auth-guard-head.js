/**
 * Auth Guard (HEAD) - Anti-flicker + Cache-based redirect
 * Start Permis - Driving School Platform
 *
 * This script runs BEFORE page render to prevent flicker.
 * Include in <head> section of protected pages.
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

  // Pages exempt from auth guard
  var EXEMPT = {
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

  if (EXEMPT[path]) return;

  var VERIFY_URL = '/verifica-email';
  var SNAP_KEY = 'sp_auth_snapshot_v1';

  // TTL values
  var TTL_VERIFIED_MS   = 24 * 60 * 60 * 1000; // 24h
  var TTL_ANON_MS       = 24 * 60 * 60 * 1000; // 24h
  var TTL_UNVERIFIED_MS = 10 * 60 * 1000;      // 10 min

  function readSnap() {
    try {
      var raw = localStorage.getItem(SNAP_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch(e) {
      return null;
    }
  }

  function isFresh(s) {
    if (!s || !s.t) return false;
    var age = Date.now() - Number(s.t || 0);
    if (!isFinite(age) || age < 0) return false;

    // s.a = 1 (logged), 0 (anon)
    // s.ev = 1 (verified), 0 (unverified)
    if (s.a === 0) return age <= TTL_ANON_MS;
    if (s.a === 1 && s.ev === 1) return age <= TTL_VERIFIED_MS;
    if (s.a === 1 && s.ev === 0) return age <= TTL_UNVERIFIED_MS;
    return false;
  }

  var snap = readSnap();

  // Fresh + logged + unverified -> redirect immediately
  if (snap && isFresh(snap) && snap.a === 1 && snap.ev === 0) {
    try {
      sessionStorage.setItem('sp_return_after_verify', location.pathname + location.search + location.hash);
    } catch(e) {}
    root.classList.add('sp-auth-preload');
    location.replace(VERIFY_URL);
    return;
  }

  // Fresh + anon or verified -> allow page load
  if (snap && isFresh(snap) && (snap.a === 0 || (snap.a === 1 && snap.ev === 1))) {
    return;
  }

  // Unknown/expired -> hide page until Firebase decides
  root.classList.add('sp-auth-preload');
})();
