/**
 * Theme Manager (Dark/Light Mode)
 * Start Permis - Driving School Platform
 *
 * Handles theme switching with localStorage persistence.
 * Works with early inline script that prevents FOUC.
 */

(function() {
  'use strict';

  var STORAGE_KEY = 'sp_theme_v1';
  var root = document.documentElement;

  /**
   * Get the current theme from DOM or localStorage
   * @returns {string} Current theme ('light' or 'dark')
   */
  function getTheme() {
    // First check if already set by early script
    var current = root.getAttribute('data-theme');
    if (current === 'light' || current === 'dark') return current;

    // Fallback to localStorage
    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}

    return (saved === 'light') ? 'light' : 'dark';
  }

  /**
   * Set the theme and update UI
   * @param {string} theme - 'light' or 'dark'
   * @returns {string} The applied theme
   */
  function setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') theme = 'dark';

    root.setAttribute('data-theme', theme);

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}

    // Sync all toggle checkboxes (dark = checked, light = unchecked)
    var isDark = theme === 'dark';
    var toggles = document.querySelectorAll('.theme-checkbox');
    for (var i = 0; i < toggles.length; i++) {
      toggles[i].checked = isDark;
    }

    // Dispatch custom event for components that need to react
    try {
      window.dispatchEvent(new CustomEvent('sp:theme', { detail: { theme: theme } }));
    } catch (e) {
      // IE fallback
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent('sp:theme', false, false, { theme: theme });
      window.dispatchEvent(evt);
    }

    return theme;
  }

  /**
   * Toggle between light and dark theme
   * @returns {string} The new theme
   */
  function toggleTheme() {
    var current = getTheme();
    return setTheme(current === 'dark' ? 'light' : 'dark');
  }

  /**
   * Sync checkbox states to current theme (call after DOM ready)
   */
  function syncToggles() {
    var theme = getTheme();
    var isDark = theme === 'dark';
    var toggles = document.querySelectorAll('.theme-checkbox');
    for (var i = 0; i < toggles.length; i++) {
      toggles[i].checked = isDark;
    }
  }

  /**
   * Initialize toggle event listeners
   */
  function initToggles() {
    var toggles = document.querySelectorAll('.theme-checkbox');
    for (var i = 0; i < toggles.length; i++) {
      (function(cb) {
        cb.addEventListener('change', function() {
          setTheme(cb.checked ? 'dark' : 'light');
        });
      })(toggles[i]);
    }
  }

  // Sync checkbox states and bind events when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      syncToggles();
      initToggles();
    });
  } else {
    // DOM already ready
    syncToggles();
    initToggles();
  }

  // Export functions for global access
  window.spTheme = {
    set: setTheme,
    get: getTheme,
    toggle: toggleTheme,
    sync: syncToggles
  };
})();
