/**
 * NUMEROLOGY — Landing Page Entry Script
 */

import $ from 'jquery';
import { initLanguage } from './utils/language.js';
import { initLandingUI } from './ui/landing.js';

$(function () {
  // Initialize centralized i18n
  initLanguage();

  // Initialize landing interactions and scroll animations
  initLandingUI();
});
