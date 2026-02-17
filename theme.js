(function() {
  'use strict';

  const THEME_STORAGE_KEY = 'theme-preference';
  const THEME_ATTRIBUTE = 'data-theme';

  /**
   * Get the system color scheme preference
   * @returns {string} 'dark' or 'light'
   */
  function getSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Get the stored theme preference from localStorage
   * @returns {string|null} 'dark', 'light', or null if not set
   */
  function getStoredPreference() {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  /**
   * Set the theme and save preference
   * @param {string} theme - 'dark', 'light', or null to use system preference
   */
  function setTheme(theme) {
    const html = document.documentElement;
    
    if (theme === 'dark' || theme === 'light') {
      html.setAttribute(THEME_ATTRIBUTE, theme);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch (e) {
        // Ignore localStorage errors
      }
    } else {
      // Remove attribute to use system preference
      html.removeAttribute(THEME_ATTRIBUTE);
      try {
        localStorage.removeItem(THEME_STORAGE_KEY);
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }

  /**
   * Get the current effective theme
   * @returns {string} 'dark' or 'light'
   */
  function getCurrentTheme() {
    const html = document.documentElement;
    const dataTheme = html.getAttribute(THEME_ATTRIBUTE);
    
    if (dataTheme === 'dark' || dataTheme === 'light') {
      return dataTheme;
    }
    
    return getSystemPreference();
  }

  /**
   * Initialize theme on page load
   */
  function initTheme() {
    const stored = getStoredPreference();
    
    if (stored === 'dark' || stored === 'light') {
      setTheme(stored);
    } else {
      // Use system preference but still set attribute for CSS icon display
      const systemTheme = getSystemPreference();
      document.documentElement.setAttribute(THEME_ATTRIBUTE, systemTheme);
    }
  }

  /**
   * Toggle between themes
   */
  function toggleTheme() {
    const current = getCurrentTheme();
    const stored = getStoredPreference();
    
    if (stored === 'dark') {
      // Currently dark, switch to light
      setTheme('light');
    } else if (stored === 'light') {
      // Currently light, switch to dark
      setTheme('dark');
    } else {
      // Using system preference, switch to opposite
      const systemTheme = getSystemPreference();
      setTheme(systemTheme === 'dark' ? 'light' : 'dark');
    }
  }

  /**
   * Update toggle button aria-label
   */
  function updateToggleButton() {
    const button = document.getElementById('theme-toggle');
    if (!button) return;
    
    const currentTheme = getCurrentTheme();
    button.setAttribute('aria-label', 
      currentTheme === 'dark' 
        ? 'Switch to light mode' 
        : 'Switch to dark mode');
    button.setAttribute('title', 
      currentTheme === 'dark' 
        ? 'Switch to light mode' 
        : 'Switch to dark mode');
  }

  // Initialize theme as soon as possible to prevent flash
  initTheme();

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      const button = document.getElementById('theme-toggle');
      if (button) {
        button.addEventListener('click', function() {
          toggleTheme();
          updateToggleButton();
        });
      }
      updateToggleButton();
    });
  } else {
    // DOM already ready
    const button = document.getElementById('theme-toggle');
    if (button) {
      button.addEventListener('click', function() {
        toggleTheme();
        updateToggleButton();
      });
    }
    updateToggleButton();
  }

  // Listen for system preference changes
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', function() {
      // Only update if user hasn't manually set a preference
      const stored = getStoredPreference();
      if (!stored) {
        const systemTheme = getSystemPreference();
        document.documentElement.setAttribute(THEME_ATTRIBUTE, systemTheme);
        updateToggleButton();
      }
    });
  }
})();
