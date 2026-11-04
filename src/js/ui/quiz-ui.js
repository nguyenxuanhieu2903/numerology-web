/**
 * NUMEROLOGY — Quiz Page UI Controller
 * Manages question rendering, animations, option selection, and state updates.
 */

import $ from 'jquery';
import { QuizEngine } from '../core/quiz-engine.js';
import { getCurrentLanguage, t } from '../utils/language.js';
import { escapeHtml } from '../utils/dom.js';

export function initQuizUI() {
  const engine = new QuizEngine();

  // Cache DOM elements
  const $questionStage = $('#question-stage');
  const $progressTrack = $('#quiz-progress-fill');
  const $progressBarTrack = $('#quiz-progress-track');
  const $counterBadge = $('#quiz-counter-text');
  const $percentBadge = $('#quiz-percent-text');
  const $btnPrev = $('#btn-prev');
  const $btnNext = $('#btn-next');
  const $btnSubmit = $('#btn-submit');
  const $alertWarning = $('#quiz-alert-warning');

  function renderCurrentQuestion(animate = true) {
    const q = engine.getCurrentQuestion();
    const lang = getCurrentLanguage();
    const currentIndex = engine.getCurrentIndex();
    const total = engine.getTotalQuestions();
    const selectedOption = engine.getSelectedOption();
    const progressPercent = engine.getProgressPercentage();

    // Hide any previous warning alert
    $alertWarning.hide();

    // Update Progress Bar & Counter
    $progressTrack.css('width', `${progressPercent}%`);
    if ($progressBarTrack.length) {
      $progressBarTrack.attr('aria-valuenow', progressPercent);
    }
    $counterBadge.text(`${t('quizQuestionWord')} ${String(currentIndex + 1).padStart(2, '0')} ${t('quizOfWord')} ${String(total).padStart(2, '0')}`);
    $percentBadge.text(`${progressPercent}%`);

    // Prepare HTML content for the question stage
    const questionHtml = `
      <div class="question-container" tabindex="-1">
        <div class="question-header">
          <div class="question-tag">${t('quizQuestionWord')} ${String(currentIndex + 1).padStart(2, '0')}</div>
          <h2 class="question-title">${escapeHtml(q.title[lang] || q.title.vi)}</h2>
          <div class="question-subtitle">${escapeHtml(q.subtitle[lang] || q.subtitle.vi)}</div>
        </div>

        <div class="options-list" role="radiogroup" aria-label="Question options">
          ${q.options
            .map((opt, index) => {
              const isSelected = selectedOption === opt.type;
              return `
                <div class="option-card ${isSelected ? 'is-selected' : ''}" 
                     role="radio" 
                     tabindex="0" 
                     data-type="${opt.type}" 
                     aria-checked="${isSelected ? 'true' : 'false'}">
                  <div class="option-radio-indicator">
                    <div class="option-radio-dot"></div>
                  </div>
                  <div class="option-text">${escapeHtml(opt.label[lang] || opt.label.vi)}</div>
                </div>
              `;
            })
            .join('')}
        </div>
      </div>
    `;

    if (animate) {
      $questionStage.fadeOut(140, function () {
        $questionStage.html(questionHtml).fadeIn(180, function () {
          $('.question-container').focus();
        });
        bindOptionEvents();
      });
    } else {
      $questionStage.html(questionHtml);
      bindOptionEvents();
    }

    // Update navigation buttons
    updateButtonStates();
  }

  function bindOptionEvents() {
    const $options = $('.option-card');

    $options
      .on('click', function () {
        const type = $(this).attr('data-type');
        selectOption(type);
      })
      .on('keydown', function (e) {
        const currentIndex = $options.index(this);

        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          const type = $(this).attr('data-type');
          selectOption(type);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % $options.length;
          const $next = $options.eq(nextIndex);
          $next.focus();
          selectOption($next.attr('data-type'));
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const prevIndex = (currentIndex - 1 + $options.length) % $options.length;
          const $prev = $options.eq(prevIndex);
          $prev.focus();
          selectOption($prev.attr('data-type'));
        }
      });
  }

  function selectOption(type) {
    engine.selectOption(type);

    // Update option card visual state with jQuery
    $('.option-card').removeClass('is-selected').attr('aria-checked', 'false');
    const $target = $(`.option-card[data-type="${type}"]`);
    $target.addClass('is-selected').attr('aria-checked', 'true');

    // Hide warning if visible
    $alertWarning.slideUp(180);

    // Update button states
    updateButtonStates();
  }

  function updateButtonStates() {
    const isFirst = !engine.canGoPrev();
    const isLast = engine.isLastQuestion();
    const hasAnswered = engine.hasAnsweredCurrent();

    // Previous Button
    if (isFirst) {
      $btnPrev.addClass('is-disabled').attr('disabled', 'disabled');
    } else {
      $btnPrev.removeClass('is-disabled').removeAttr('disabled');
    }

    // Next / Submit Button Toggle
    if (isLast) {
      $btnNext.hide();
      $btnSubmit.show();
      if (hasAnswered) {
        $btnSubmit.removeClass('is-disabled').removeAttr('disabled');
      } else {
        $btnSubmit.addClass('is-disabled').attr('disabled', 'disabled');
      }
    } else {
      $btnSubmit.hide();
      $btnNext.show();
      if (hasAnswered) {
        $btnNext.removeClass('is-disabled').removeAttr('disabled');
      } else {
        $btnNext.addClass('is-disabled').attr('disabled', 'disabled');
      }
    }
  }

  // Previous Button Click
  $btnPrev.on('click', function (e) {
    e.preventDefault();
    if (engine.prevQuestion()) {
      renderCurrentQuestion(true);
    }
  });

  // Next Button Click
  $btnNext.on('click', function (e) {
    e.preventDefault();
    if (!engine.hasAnsweredCurrent()) {
      $alertWarning.text(t('quizSelectWarning')).slideDown(200);
      return;
    }
    if (engine.nextQuestion()) {
      renderCurrentQuestion(true);
    }
  });

  // Submit Button Click
  $btnSubmit.on('click', function (e) {
    e.preventDefault();
    if (!engine.hasAnsweredCurrent()) {
      $alertWarning.text(t('quizSelectWarning')).slideDown(200);
      return;
    }
    if (!engine.isComplete()) {
      $alertWarning.text(t('quizIncompleteWarning')).slideDown(200);
      return;
    }

    try {
      engine.submit();
      // Redirect to Result Page
      window.location.href = './result.html';
    } catch (err) {
      console.error('[Quiz] Submit error:', err);
      $alertWarning.text(err.message).slideDown(200);
    }
  });

  // Re-render when language changes without resetting state!
  window.addEventListener('numerology:languageChanged', () => {
    renderCurrentQuestion(false);
  });

  // Initial render
  renderCurrentQuestion(false);
}

