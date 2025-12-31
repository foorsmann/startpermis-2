/**
 * sp-dropdown.js
 * Custom dropdown system - completely independent of Webflow runtime.
 *
 * Usage:
 * Add [data-sp-dropdown] to the dropdown wrapper element.
 * The script will automatically find toggle and list elements.
 *
 * Features:
 * - Toggle open/close on click
 * - Close on click outside
 * - Close on Escape key
 * - Close via .close-btn-background / .close-btn-wrapper
 * - Arrow rotation via .is-open class (CSS-driven)
 * - Proper ARIA attributes for accessibility
 */

(function() {
  'use strict';

  // Track all initialized dropdowns
  var dropdowns = [];

  /**
   * Initialize a single dropdown
   */
  function initDropdown(wrapper) {
    // Find toggle and list elements
    // Support both Webflow classes and custom classes
    var toggle = wrapper.querySelector('.w-dropdown-toggle, .sp-dropdown-toggle');
    var list = wrapper.querySelector('.w-dropdown-list, .sp-dropdown-list');

    if (!toggle || !list) {
      console.warn('[sp-dropdown] Missing toggle or list in:', wrapper);
      return null;
    }

    // Create dropdown instance
    var dropdown = {
      wrapper: wrapper,
      toggle: toggle,
      list: list,
      isOpen: false
    };

    // Set initial ARIA state
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-haspopup', 'true');

    // Prevent Webflow from handling this dropdown
    // Remove Webflow's data attributes that trigger its dropdown behavior
    wrapper.removeAttribute('data-hover');
    wrapper.removeAttribute('data-delay');

    return dropdown;
  }

  /**
   * Open a dropdown
   */
  function openDropdown(dropdown) {
    if (dropdown.isOpen) return;

    // Close any other open dropdowns first
    dropdowns.forEach(function(d) {
      if (d !== dropdown && d.isOpen) {
        closeDropdown(d);
      }
    });

    dropdown.isOpen = true;
    dropdown.wrapper.classList.add('is-open');
    dropdown.toggle.classList.add('w--open'); // Keep Webflow class for styling compatibility
    dropdown.list.classList.add('w--open');
    dropdown.toggle.setAttribute('aria-expanded', 'true');

    // Show the list
    dropdown.list.style.display = '';
  }

  /**
   * Close a dropdown
   */
  function closeDropdown(dropdown) {
    if (!dropdown.isOpen) return;

    dropdown.isOpen = false;
    dropdown.wrapper.classList.remove('is-open');
    dropdown.toggle.classList.remove('w--open');
    dropdown.list.classList.remove('w--open');
    dropdown.toggle.setAttribute('aria-expanded', 'false');
  }

  /**
   * Toggle a dropdown
   */
  function toggleDropdown(dropdown) {
    if (dropdown.isOpen) {
      closeDropdown(dropdown);
    } else {
      openDropdown(dropdown);
    }
  }

  /**
   * Find dropdown instance by element
   */
  function findDropdownByElement(element) {
    var wrapper = element.closest('[data-sp-dropdown]');
    if (!wrapper) return null;

    for (var i = 0; i < dropdowns.length; i++) {
      if (dropdowns[i].wrapper === wrapper) {
        return dropdowns[i];
      }
    }
    return null;
  }

  /**
   * Handle toggle click
   */
  function onToggleClick(e) {
    var dropdown = findDropdownByElement(e.target);
    if (!dropdown) return;

    // Check if click is on the toggle (not on something inside the list)
    if (!dropdown.toggle.contains(e.target)) return;

    e.preventDefault();
    e.stopPropagation();
    toggleDropdown(dropdown);
  }

  /**
   * Handle close button click
   */
  function onCloseButtonClick(e) {
    var closeBtn = e.target.closest('.close-btn-background, .close-btn-wrapper');
    if (!closeBtn) return;

    var dropdown = findDropdownByElement(closeBtn);
    if (!dropdown) return;

    e.preventDefault();
    e.stopPropagation();
    closeDropdown(dropdown);
  }

  /**
   * Handle click outside to close
   */
  function onDocumentClick(e) {
    // Check if click is on a close button first
    if (e.target.closest('.close-btn-background, .close-btn-wrapper')) {
      onCloseButtonClick(e);
      return;
    }

    // Check if click is on a toggle
    var clickedToggle = e.target.closest('.w-dropdown-toggle, .sp-dropdown-toggle');
    if (clickedToggle) {
      var dropdown = findDropdownByElement(clickedToggle);
      if (dropdown && dropdown.toggle.contains(e.target)) {
        onToggleClick(e);
        return;
      }
    }

    // Click outside - close all open dropdowns
    dropdowns.forEach(function(dropdown) {
      if (dropdown.isOpen) {
        // Check if click is inside this dropdown's list
        if (!dropdown.list.contains(e.target)) {
          closeDropdown(dropdown);
        }
      }
    });
  }

  /**
   * Handle Escape key to close
   */
  function onKeyDown(e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      dropdowns.forEach(function(dropdown) {
        if (dropdown.isOpen) {
          closeDropdown(dropdown);
          dropdown.toggle.focus(); // Return focus to toggle
        }
      });
    }
  }

  /**
   * Initialize all dropdowns on the page
   */
  function init() {
    // Find all dropdowns marked with our attribute
    var wrappers = document.querySelectorAll('[data-sp-dropdown]');

    wrappers.forEach(function(wrapper) {
      var dropdown = initDropdown(wrapper);
      if (dropdown) {
        dropdowns.push(dropdown);
      }
    });

    if (dropdowns.length === 0) {
      return; // No dropdowns to manage
    }

    // Set up global event listeners
    // Use capture phase for click to catch events before they bubble
    document.addEventListener('click', onDocumentClick, true);
    document.addEventListener('keydown', onKeyDown);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API for external use if needed
  window.SPDropdown = {
    close: function(element) {
      var dropdown = findDropdownByElement(element);
      if (dropdown) closeDropdown(dropdown);
    },
    open: function(element) {
      var dropdown = findDropdownByElement(element);
      if (dropdown) openDropdown(dropdown);
    },
    toggle: function(element) {
      var dropdown = findDropdownByElement(element);
      if (dropdown) toggleDropdown(dropdown);
    }
  };

})();
