/**
 * NUMEROLOGY — Quiz Page Entry Script
 */

import $ from 'jquery';
import { initLanguage } from './utils/language.js';
import { initQuizUI } from './ui/quiz-ui.js';

$(function () {
  // Initialize centralized i18n
  initLanguage();

  // Initialize quiz engine & UI
  initQuizUI();
});
