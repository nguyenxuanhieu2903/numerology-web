/**
 * NUMEROLOGY — Language Manager (i18n)
 * Handles language state, localized strings lookup, and dynamic DOM translation.
 */

import { translations } from '../data/translations.js';
import { Storage } from '../core/storage.js';

let currentLang = Storage.getLanguage();

export function getCurrentLanguage() {
  return currentLang;
}

export function setLanguage(lang) {
  if (lang !== 'vi' && lang !== 'en') return;
  currentLang = lang;
  Storage.setLanguage(lang);
  document.documentElement.setAttribute('lang', lang);

  // Translate all static data-i18n elements in DOM
  translateDOM();

  // Update active state on language toggle buttons
  updateLanguageToggleUI();

  // Dispatch custom event for dynamic components to re-render
  window.dispatchEvent(new CustomEvent('numerology:languageChanged', { detail: { lang } }));
}

export function t(key) {
  const dict = translations[currentLang] || translations.vi;
  return dict[key] || translations.vi[key] || key;
}

export function translateDOM(root = document) {
  const elements = root.querySelectorAll('[data-i18n]');
  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const translated = t(key);
    if (translated) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.setAttribute('placeholder', translated);
      } else {
        // Defensive check: if element contains an SVG icon, do not overwrite child nodes
        const hasSvgChild = el.querySelector('svg');
        if (hasSvgChild) {
          const textNode = Array.from(el.childNodes).find(
            (node) => node.nodeType === 3 && node.nodeValue.trim().length > 0
          );
          if (textNode) {
            textNode.nodeValue = ` ${translated} `;
          } else {
            const span = el.querySelector('span');
            if (span) {
              span.textContent = translated;
            } else {
              el.textContent = translated;
            }
          }
        } else {
          el.textContent = translated;
        }
      }
    }
  });

  const ariaElements = root.querySelectorAll('[data-i18n-aria]');
  ariaElements.forEach((el) => {
    const key = el.getAttribute('data-i18n-aria');
    const translated = t(key);
    if (translated) {
      el.setAttribute('aria-label', translated);
    }
  });

  // Update document title if data-i18n-title is on document head
  const titleEl = document.querySelector('title[data-i18n]');
  if (titleEl) {
    const key = titleEl.getAttribute('data-i18n');
    document.title = t(key);
  }
}

export function updateLanguageToggleUI() {
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    const lang = btn.getAttribute('data-lang');
    if (lang === currentLang) {
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.classList.remove('is-active');
      btn.setAttribute('aria-pressed', 'false');
    }
  });
}

export function initLanguage() {
  document.documentElement.setAttribute('lang', currentLang);
  translateDOM();
  updateLanguageToggleUI();

  // Bind click handlers to language switchers
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetLang = btn.getAttribute('data-lang');
      if (targetLang && targetLang !== currentLang) {
        setLanguage(targetLang);
      }
    });
  });
}

