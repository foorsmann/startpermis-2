/**
 * Firebase Configuration and Initialization
 * Start Permis - Driving School Platform
 *
 * This file centralizes Firebase setup to avoid duplication across pages.
 * Include this file AFTER the Firebase SDK scripts.
 */

(function() {
  'use strict';

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

  function activateAppCheck() {
    console.log('[appcheck] Attempting activation...');
    try {
      if (typeof firebase.appCheck !== 'function') {
        console.error('[appcheck] firebase.appCheck is not available');
        console.log('[appcheck] Available firebase methods:', Object.keys(firebase).filter(k => typeof firebase[k] === 'function'));
        return;
      }
      if (window.__spAppCheckActivated) {
        console.log('[appcheck] Already activated, skipping');
        return;
      }

      // Use ReCaptchaV3Provider as per official Firebase documentation
      const appCheck = firebase.appCheck();
      console.log('[appcheck] Creating ReCaptchaV3Provider...');
      const provider = new firebase.appCheck.ReCaptchaV3Provider(RECAPTCHA_SITE_KEY);

      console.log('[appcheck] Calling activate()...');
      appCheck.activate(provider, true);
      window.__spAppCheckActivated = true;
      console.log('[appcheck] Firebase App Check activated successfully!');
    } catch (e) {
      console.error('[appcheck] Activation failed:', e.message || e);
      console.error('[appcheck] Full error:', e);
    }
  }

  // Initialize App Check after a short delay to ensure SDK is fully loaded
  function initAppCheck() {
    console.log('[appcheck] Initializing...');

    // Check if App Check SDK is available
    if (typeof firebase.appCheck === 'function') {
      console.log('[appcheck] SDK is available, activating...');
      activateAppCheck();
    } else {
      console.warn('[appcheck] SDK not found, will retry...');
      // Retry after a delay in case the script is still loading
      setTimeout(function() {
        if (typeof firebase.appCheck === 'function') {
          console.log('[appcheck] SDK now available after retry');
          activateAppCheck();
        } else {
          console.error('[appcheck] SDK still not available after retry');
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
      window.db.settings({
        experimentalAutoDetectLongPolling: true,
        merge: true
      });
      window.__spFirestoreSettingsApplied = true;
    }
  } catch (e) {
    console.warn('[firestore] settings() skipped:', e);
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

  console.log("[firebase] Initialized:", firebase.apps.length, "app(s)");

  // Export for global access
  window.firebaseConfig = firebaseConfig;
})();
