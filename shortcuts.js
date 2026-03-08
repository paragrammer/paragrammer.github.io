(function() {
  'use strict';

  const SHORTCUTS = [
    { key: 't', description: 'Toggle light/dark mode' },
    { key: '?', description: 'Show keyboard shortcuts' },
    { key: 'Esc', description: 'Close shortcuts dialog' },
  ];

  function isEditableElement(target) {
    const tag = target.tagName && target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return true;
    if (target.isContentEditable) return true;
    return false;
  }

  function shouldIgnoreKey(e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return true;
    if (isEditableElement(e.target)) return true;
    return false;
  }

  function showHelp() {
    const dialog = document.getElementById('shortcuts-dialog');
    const list = document.getElementById('shortcuts-list');
    if (!dialog || !list) return;

    list.innerHTML = SHORTCUTS.map(function(s) {
      const k = s.key === 'Esc' ? 'Escape' : s.key;
      return '<tr><td><kbd>' + escapeHtml(s.key) + '</kbd></td><td>' + escapeHtml(s.description) + '</td></tr>';
    }).join('');

    dialog.classList.add('shortcuts-dialog-visible');
    dialog.setAttribute('aria-hidden', 'false');
  }

  function hideHelp() {
    const dialog = document.getElementById('shortcuts-dialog');
    if (!dialog) return;
    dialog.classList.remove('shortcuts-dialog-visible');
    dialog.setAttribute('aria-hidden', 'true');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      hideHelp();
      e.preventDefault();
      return;
    }

    if (shouldIgnoreKey(e)) return;

    if (e.key === 't' || e.key === 'T') {
      const btn = document.getElementById('theme-toggle');
      if (btn) {
        btn.click();
        e.preventDefault();
      }
      return;
    }

    if (e.key === '?' || (e.shiftKey && e.key === '/')) {
      showHelp();
      e.preventDefault();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    document.addEventListener('keydown', handleKeydown);

    const dialog = document.getElementById('shortcuts-dialog');
    const backdrop = document.getElementById('shortcuts-backdrop');
    if (backdrop) backdrop.addEventListener('click', hideHelp);
    if (dialog) dialog.setAttribute('aria-hidden', 'true');
  }
})();
