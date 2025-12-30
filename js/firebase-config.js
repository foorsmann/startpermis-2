/**
 * Firebase Configuration and Initialization
 * Start Permis - Driving School Platform
 *
 * This file centralizes Firebase setup to avoid duplication across pages.
 * Include this file AFTER the Firebase SDK scripts.
 */

(function() {
  'use strict';

  // Production-safe logger - only logs in development
  var IS_DEV = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  var logger = {
    log: IS_DEV ? console.log.bind(console) : function() {},
    warn: IS_DEV ? console.warn.bind(console) : function() {},
    error: IS_DEV ? console.error.bind(console) : function() {}
  };

  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCQRl-U7rJPgEC083Ra1oEL_pOVTNJL0FM",
    authDomain: "scaoalauto.firebaseapp.com",
    projectId: "scaoalauto",
    storageBucket: "scaoalauto.firebasestorage.app",
    messagingSenderId: "698835669482",
    appId: "1:698835669482:web:038234f137a1497beae293",
    databaseURL: "https://scaoalauto-default-rtdb.europe-west1.firebasedatabase.app"
  };

  // Initialize Firebase only once
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  // Firebase App Check - Security layer
  // Protects backend resources from abuse
  // Uses reCAPTCHA v3 for web attestation
  const RECAPTCHA_SITE_KEY = '6LcIcDosAAAAAI2dKCE7c-15ioM6N3CnUac5BNrg';

  function isCompatSDK() {
    // Compat SDK exposes firebase.initializeApp + firebase.apps[]
    return typeof firebase !== 'undefined' && typeof firebase.initializeApp === 'function' && Array.isArray(firebase.apps);
  }

  function activateAppCheck() {
    logger.log('[appcheck] Attempting activation...');
    try {
      if (!isCompatSDK()) {
        logger.error('[appcheck] Compat SDK not detected. App Check activation skipped to avoid modular API mismatch.');
        return;
      }

      if (typeof firebase.appCheck !== 'function') {
        logger.error('[appcheck] firebase.appCheck is not available on this SDK build. App Check protection is OFF.');
        logger.log('[appcheck] Available firebase methods:', Object.keys(firebase).filter(k => typeof firebase[k] === 'function'));
        window.__spAppCheckUnavailable = true;
        return;
      }
      if (window.__spAppCheckActivated) {
        logger.log('[appcheck] Already activated, skipping');
        return;
      }

      // Use ReCaptchaV3Provider as per official Firebase documentation
      const appCheck = firebase.appCheck();
      logger.log('[appcheck] Creating ReCaptchaV3Provider...');
      const provider = new firebase.appCheck.ReCaptchaV3Provider(RECAPTCHA_SITE_KEY);

      logger.log('[appcheck] Calling activate()...');
      appCheck.activate(provider, true);
      window.__spAppCheckActivated = true;
      logger.log('[appcheck] Firebase App Check activated successfully!');
    } catch (e) {
      logger.error('[appcheck] Activation failed:', e.message || e);
      logger.error('[appcheck] Full error:', e);
      if (e && e.code === 'appCheck/recaptcha-error') {
        logger.error('[appcheck] ReCAPTCHA error usually means the domain is not in the App Check allowlist or the site key is invalid for this origin.');
        try {
          const instance = firebase.appCheck && firebase.appCheck();
          if (instance && typeof instance.setTokenAutoRefreshEnabled === 'function') {
            instance.setTokenAutoRefreshEnabled(false);
            logger.warn('[appcheck] Disabled token auto-refresh to avoid repeated ReCAPTCHA errors.');
          }
        } catch (inner) {
          logger.warn('[appcheck] Failed to disable auto-refresh after error:', inner);
        }
      }
      window.__spAppCheckUnavailable = true;
    }
  }

  // Initialize App Check after a short delay to ensure SDK is fully loaded
  function initAppCheck() {
    logger.log('[appcheck] Initializing...');

    // Check if App Check SDK is available
    if (typeof firebase.appCheck === 'function') {
      logger.log('[appcheck] SDK is available, activating...');
      activateAppCheck();
    } else {
      logger.warn('[appcheck] SDK not found, will retry...');
      // Retry after a delay in case the script is still loading
      setTimeout(function() {
        if (typeof firebase.appCheck === 'function') {
          logger.log('[appcheck] SDK now available after retry');
          activateAppCheck();
        } else {
          logger.error('[appcheck] SDK still not available after retry. App Check protection is OFF.');
          window.__spAppCheckUnavailable = true;
        }
      }, 500);
    }
  }

  // Run App Check initialization after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAppCheck);
  } else {
    // DOM already loaded, run with small delay
    setTimeout(initAppCheck, 100);
  }

  // Initialize Firestore with stability settings
  window.db = firebase.firestore();

  try {
    if (!window.__spFirestoreSettingsApplied) {
      if (!isCompatSDK()) {
        logger.warn('[firestore] Compat SDK not detected, skipping settings() to avoid modular API mismatch.');
      } else if (typeof window.db.settings === 'function') {
        // Keep long-polling enabled for restrictive networks where websockets are blocked.
        // See https://firebase.google.com/docs/reference/js/firestore_.settings for compat options.
        window.db.settings({
          // Use merge to preserve any pre-existing host/ssl settings (e.g., emulator).
          experimentalAutoDetectLongPolling: true,
          merge: true
        });
        window.__spFirestoreSettingsApplied = true;
      } else {
        logger.warn('[firestore] db.settings is not available on this SDK build, skipping settings().');
      }
    }
  } catch (e) {
    logger.warn('[firestore] settings() skipped:', e);
  }

  // Fullscreen orientation handling for mobile
  document.addEventListener('fullscreenchange', function() {
    if (document.fullscreenElement) {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(function() {});
      }
    } else {
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    }
  });

  logger.log("[firebase] Initialized:", firebase.apps.length, "app(s)");

  // Export for global access
  window.firebaseConfig = firebaseConfig;
})();
