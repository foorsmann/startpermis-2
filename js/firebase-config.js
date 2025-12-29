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
