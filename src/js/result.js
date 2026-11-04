/**
 * NUMEROLOGY — Result Page Entry Script
 */

import $ from 'jquery';
import { initLanguage } from './utils/language.js';
import { initResultUI } from './ui/result-ui.js';

$(function () {
  // Initialize centralized i18n
  initLanguage();

  // Initialize result rendering & actions
  initResultUI();
});
