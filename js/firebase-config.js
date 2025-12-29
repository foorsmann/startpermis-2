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
  // Dynamically loads App Check SDK if not already present
  function activateAppCheck() {
    try {
      if (!firebase.appCheck) {
        console.warn('[appcheck] SDK not available after load');
        return;
      }
      if (window.__spAppCheckActivated) {
        console.log('[appcheck] Already activated, skipping');
        return;
      }

      const appCheck = firebase.appCheck();
      appCheck.activate(
        '6LcIcDosAAAAAI2dKCE7c-15ioM6N3CnUac5BNrg',  // reCAPTCHA v3 site key
        true  // isTokenAutoRefreshEnabled
      );
      window.__spAppCheckActivated = true;
      console.log('[appcheck] Firebase App Check activated');
    } catch (e) {
      console.error('[appcheck] App Check activation failed:', e.message || e);
    }
  }

  // Load App Check SDK dynamically if not present
  if (typeof firebase.appCheck === 'function') {
    console.log('[appcheck] SDK already loaded');
    activateAppCheck();
  } else {
    console.log('[appcheck] Loading SDK dynamically...');
    var script = document.createElement('script');
    script.src = 'https://www.gstatic.com/firebasejs/10.10.0/firebase-appcheck-compat.js';
    script.onload = function() {
      console.log('[appcheck] SDK loaded successfully');
      // Small delay to ensure firebase.appCheck is registered
      setTimeout(activateAppCheck, 100);
    };
    script.onerror = function() {
      console.error('[appcheck] Failed to load App Check SDK');
    };
    document.head.appendChild(script);
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
