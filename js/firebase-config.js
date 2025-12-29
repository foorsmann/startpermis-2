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
        console.error('[appcheck] firebase.appCheck is not a function');
        return;
      }
      if (window.__spAppCheckActivated) {
        console.log('[appcheck] Already activated, skipping');
        return;
      }

      // Use ReCaptchaV3Provider as per official Firebase documentation
      const appCheck = firebase.appCheck();
      const provider = new firebase.appCheck.ReCaptchaV3Provider(RECAPTCHA_SITE_KEY);

      appCheck.activate(provider, true);
      window.__spAppCheckActivated = true;
      console.log('[appcheck] Firebase App Check activated successfully');
    } catch (e) {
      console.error('[appcheck] Activation failed:', e);
    }
  }

  // Load App Check SDK - must be loaded before activation
  console.log('[appcheck] Checking SDK availability...');
  if (typeof firebase.appCheck === 'function') {
    console.log('[appcheck] SDK already loaded');
    activateAppCheck();
  } else {
    console.log('[appcheck] Loading SDK dynamically...');
    var appCheckScript = document.createElement('script');
    appCheckScript.src = 'https://www.gstatic.com/firebasejs/10.10.0/firebase-appcheck-compat.js';
    appCheckScript.onload = function() {
      console.log('[appcheck] SDK loaded successfully');
      setTimeout(activateAppCheck, 50);
    };
    appCheckScript.onerror = function(e) {
      console.error('[appcheck] Failed to load SDK:', e);
    };
    document.head.appendChild(appCheckScript);
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
