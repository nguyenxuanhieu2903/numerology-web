/**
 * NUMEROLOGY — DOM and Interaction Helpers
 * Toast notifications, clipboard copy, smooth scrolling, and accessibility helpers.
 */

import $ from 'jquery';

/**
 * Displays a non-intrusive floating toast notification.
 * @param {string} message
 * @param {'info'|'success'|'warning'|'error'} type
 * @param {number} durationMs
 */
export function showToast(message, type = 'info', durationMs = 3200) {
  let $container = $('#toast-container');
  if (!$container.length) {
    $container = $('<div id="toast-container" class="toast-container" role="region" aria-live="polite" aria-atomic="true"></div>');
    $('body').append($container);
  }

  const $toast = $(`
    <div class="toast-item toast-${type}" role="alert">
      <div class="toast-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <div class="toast-message">${escapeHtml(message)}</div>
    </div>
  `);

  $container.append($toast);

  // jQuery animation: slide in and fade
  $toast.hide().fadeIn(260);

  setTimeout(() => {
    $toast.fadeOut(300, function () {
      $(this).remove();
    });
  }, durationMs);
}

/**
 * Copies text to clipboard with modern API and reliable fallback.
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('[Clipboard] Navigator API failed, attempting fallback...', err);
    }
  }

  // Fallback using textarea + execCommand
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('[Clipboard] Fallback copy failed:', err);
    return false;
  }
}

/**
 * Escapes HTML characters to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Smooth scroll with sticky header offset.
 * @param {string} targetSelector
 */
export function smoothScrollTo(targetSelector) {
  const $target = $(targetSelector);
  if ($target.length) {
    const offset = 80;
    const targetTop = $target.offset().top - offset;
    $('html, body').animate({ scrollTop: targetTop }, 500);
  }
}
