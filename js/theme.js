/**
 * Theme Manager (Dark/Light Mode)
 * Start Permis - Driving School Platform
 *
 * Handles theme switching with localStorage persistence
 * and system preference detection.
 */

(function() {
  'use strict';

  var STORAGE_KEY = 'sp-theme';
  var root = document.documentElement;

  /**
   * Get the initial theme based on saved preference or system setting
   */
  function getInitialTheme() {
    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}

    if (saved === 'light' || saved === 'dark') return saved;

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  /**
   * Set the theme and update UI
   * @param {string} theme - 'light' or 'dark'
   * @returns {string} The applied theme
   */
  function setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') theme = 'light';

    root.setAttribute('data-theme', theme);

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}

    var isDark = theme === 'dark';
    var toggles = document.querySelectorAll('.theme-checkbox');
    toggles.forEach(function(cb) {
      cb.checked = isDark;
    });

    // Dispatch custom event for components that need to react
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));

    return theme;
  }

  /**
   * Toggle between light and dark theme
   * @returns {string} The new theme
   */
  function toggleTheme() {
    var current = root.getAttribute('data-theme') || getInitialTheme();
    return setTheme(current === 'dark' ? 'light' : 'dark');
  }

  /**
   * Get current theme
   * @returns {string} Current theme ('light' or 'dark')
   */
  function getTheme() {
    return root.getAttribute('data-theme') || getInitialTheme();
  }

  // Initialize theme on load
  setTheme(getInitialTheme());

  // Listen for checkbox toggles
  document.addEventListener('DOMContentLoaded', function() {
    var toggles = document.querySelectorAll('.theme-checkbox');
    toggles.forEach(function(cb) {
      cb.addEventListener('change', function() {
        setTheme(cb.checked ? 'dark' : 'light');
      });
    });
  });

  // Listen for system preference changes
  if (window.matchMedia) {
    var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', function(e) {
      // Only auto-switch if user hasn't set a preference
      var saved = null;
      try {
        saved = localStorage.getItem(STORAGE_KEY);
      } catch (err) {}

      if (!saved) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Export functions for global access
  window.spTheme = {
    set: setTheme,
    get: getTheme,
    toggle: toggleTheme
  };
})();
