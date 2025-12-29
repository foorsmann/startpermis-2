/**
 * Single Active Lock Helper
 * Start Permis - Driving School Platform
 *
 * Prevents same content from being open in multiple tabs.
 * Uses Firebase Realtime Database for cross-tab communication.
 */

(function() {
  'use strict';

  function sanitizeKey(k) {
    // eslint-disable-next-line no-useless-escape
    return String(k || "global").replace(/[.#$\[\]\/]/g, "-");
  }

  /**
   * Install a single-active lock for content
   * @param {Object} opts Configuration options
   * @param {string} opts.lockKey - Unique key for this content (e.g., "chapter-1")
   * @param {string} opts.redirectUrl - URL to redirect if kicked out
   * @param {string} [opts.userId] - User ID (will use auth.currentUser if not provided)
   * @param {number} [opts.redirectDelayMs=0] - Delay before redirect
   */
  window.installSingleActiveLock = function installSingleActiveLock(opts) {
    var lockKey = opts && opts.lockKey;
    var redirectUrl = opts && opts.redirectUrl;
    var userId = opts && opts.userId;
    var redirectDelayMs = (opts && opts.redirectDelayMs) || 0;

    if (!firebase || !firebase.database) {
      console.warn("[lock] RTDB unavailable.");
      return;
    }

    if (!lockKey || !redirectUrl) {
      console.warn("[lock] lockKey/redirectUrl missing.");
      return;
    }

    var auth = firebase.auth();
    var userReady = userId
      ? Promise.resolve({ uid: userId })
      : (auth.currentUser
          ? Promise.resolve(auth.currentUser)
          : new Promise(function(res) { auth.onAuthStateChanged(res); }));

    userReady.then(function(user) {
      if (!user || !user.uid) {
        console.warn("[lock] User not logged in; lock will apply after login.");
        return;
      }

      var db = firebase.database();
      var SID = (crypto.randomUUID && crypto.randomUUID()) ||
                (Math.random().toString(36).slice(2) + "-" + Date.now());
      var key = sanitizeKey(lockKey);
      var lockRef = db.ref("chapterLocks").child(user.uid).child(key);

      function claim() {
        try {
          lockRef.set({
            uid: user.uid,
            sessionId: SID,
            ts: firebase.database.ServerValue.TIMESTAMP
          });
          try {
            lockRef.onDisconnect().remove();
          } catch(_) {}
        } catch(e) {
          console.warn("[lock] set failed:", e);
        }
      }

      function kick() {
        setTimeout(function() {
          location.replace(redirectUrl);
        }, redirectDelayMs);
      }

      lockRef.on("value", function(snap) {
        var v = snap.val();
        if (!v) {
          if (!document.hidden) claim();
          return;
        }
        if (v.sessionId !== SID) kick();
      });

      document.addEventListener("visibilitychange", function() {
        if (!document.hidden) claim();
      }, { passive: true });

      window.addEventListener("focus", claim, { passive: true });

      window.addEventListener("beforeunload", function() {
        try {
          lockRef.remove();
        } catch(_) {}
      });

      claim();
    });
  };

  window.installSingleActiveLock.version = "v2:chapterLocks";
  console.log("[lock] Helper ready:", window.installSingleActiveLock.version);
})();
