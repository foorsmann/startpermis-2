/**
 * dropdown-close.js
 * Centralized handler for closing Webflow dropdowns via custom close buttons.
 *
 * Works with any .close-btn-background (or child elements like .close-btn-wrapper)
 * inside a Webflow dropdown (.w-dropdown).
 *
 * Uses Webflow's native mechanism by triggering a real click on the toggle,
 * ensuring proper state synchronization (w--open classes, IX2 animations, etc.)
 */
(function() {
  'use strict';

  /**
   * Closes a Webflow dropdown by triggering native click on its toggle.
   * This ensures all Webflow internals (classes, IX2 animations) stay in sync.
   *
   * @param {HTMLElement} dropdownWrapper - The .w-dropdown element to close
   */
  function closeWebflowDropdown(dropdownWrapper) {
    if (!dropdownWrapper) return;

    var toggle = dropdownWrapper.querySelector('.w-dropdown-toggle');
    if (!toggle) return;

    // Check if dropdown is actually open (toggle or list has w--open)
    var isOpen = toggle.classList.contains('w--open') ||
                 dropdownWrapper.querySelector('.w-dropdown-list.w--open');

    if (!isOpen) return;

    // Dispatch a real MouseEvent to trigger Webflow's native handler + IX2
    // Simple .click() doesn't always trigger IX2 animations
    var clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    toggle.dispatchEvent(clickEvent);
  }

  /**
   * Event delegation handler for close button clicks.
   * Catches clicks on .close-btn-background or any of its children.
   */
  function handleCloseButtonClick(e) {
    // Check if click target is inside a close button
    var closeBtn = e.target.closest('.close-btn-background');
    if (!closeBtn) return;

    // Find the parent dropdown
    var dropdown = closeBtn.closest('.w-dropdown');
    if (!dropdown) return;

    // Prevent the click from bubbling to dropdown (could cause issues)
    e.preventDefault();
    e.stopPropagation();

    // Close the dropdown using Webflow's native mechanism
    closeWebflowDropdown(dropdown);
  }

  /**
   * Initialize the close button handler using event delegation.
   * This approach works even if dropdowns are created dynamically.
   */
  function init() {
    // Use capture phase to catch events before Webflow's handlers
    document.addEventListener('click', handleCloseButtonClick, true);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
