/**
 * dropdown-close.js
 *
 * Handles closing Webflow dropdowns via custom close buttons (.close-btn-background).
 *
 * This script uses Webflow.push() to ensure it runs AFTER Webflow is fully initialized.
 * It uses the 'pointerdown' event (which fires before 'click') in capture phase
 * to intercept the event before Webflow can process it.
 */

(function() {
  'use strict';

  /**
   * Main initialization function.
   * Called after Webflow is ready via Webflow.push()
   */
  function initDropdownClose() {

    /**
     * Handles pointerdown on close buttons.
     * Uses pointerdown instead of click because it fires earlier in the event sequence,
     * giving us a chance to intercept before Webflow's handlers.
     */
    function onCloseButtonPointerDown(e) {
      // Find if we clicked on or inside a close button
      var closeBtn = e.target.closest('.close-btn-background');
      if (!closeBtn) return;

      // Find the parent Webflow dropdown
      var dropdown = closeBtn.closest('.w-dropdown');
      if (!dropdown) return;

      // Find the toggle button
      var toggle = dropdown.querySelector('.w-dropdown-toggle');
      if (!toggle) return;

      // Check if dropdown is actually open
      var isOpen = toggle.classList.contains('w--open') ||
                   dropdown.querySelector('.w-dropdown-list.w--open');
      if (!isOpen) return;

      // CRITICAL: Stop this event completely so Webflow doesn't process it
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // Use setTimeout to dispatch the toggle click outside the current event flow.
      // This ensures Webflow's internal state is clean when it receives our click.
      setTimeout(function() {
        // Dispatch a synthetic click on the toggle.
        // This triggers Webflow's native dropdown close mechanism.
        var clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        toggle.dispatchEvent(clickEvent);
      }, 0);
    }

    // Listen for pointerdown in capture phase (fires before bubble phase handlers)
    // This ensures we catch the event before Webflow's handlers
    document.addEventListener('pointerdown', onCloseButtonPointerDown, true);

    // Also handle touchstart for better mobile support
    document.addEventListener('touchstart', onCloseButtonPointerDown, true);
  }

  /**
   * Bootstrap: Wait for Webflow to be ready, then initialize.
   * Webflow.push() queues a function to run after Webflow initialization.
   */
  function bootstrap() {
    if (window.Webflow && typeof Webflow.push === 'function') {
      // Webflow is available - use its ready mechanism
      Webflow.push(initDropdownClose);
    } else {
      // Webflow not available yet - wait for it
      // This handles cases where our script loads before webflow.js
      var checkInterval = setInterval(function() {
        if (window.Webflow && typeof Webflow.push === 'function') {
          clearInterval(checkInterval);
          Webflow.push(initDropdownClose);
        }
      }, 50);

      // Safety timeout - if Webflow never loads, init anyway after 3 seconds
      setTimeout(function() {
        clearInterval(checkInterval);
        if (!window.Webflow) {
          initDropdownClose();
        }
      }, 3000);
    }
  }

  // Start bootstrap when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

})();
