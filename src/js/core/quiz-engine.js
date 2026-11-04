/**
 * NUMEROLOGY — Quiz Engine
 * Manages question flow, state transitions, validation, and submission.
 */

import { questions } from '../data/questions.js';
import { generateResult } from './scoring.js';
import { Storage } from './storage.js';

export class QuizEngine {
  constructor() {
    this.questions = questions;
    this.totalQuestions = questions.length;
    this.currentIndex = 0;
    this.answers = {}; // Map: { [questionId]: '01' | '02' | '03' | '04' }

    this.restoreState();
  }

  /**
   * Restores quiz state from sessionStorage if present.
   */
  restoreState() {
    const saved = Storage.getQuizState();
    if (saved && typeof saved === 'object') {
      if (typeof saved.currentQuestionIndex === 'number' && saved.currentQuestionIndex >= 0 && saved.currentQuestionIndex < this.totalQuestions) {
        this.currentIndex = saved.currentQuestionIndex;
      }
      if (saved.answers && typeof saved.answers === 'object') {
        this.answers = { ...saved.answers };
      }
    }
  }

  /**
   * Persists active state to sessionStorage.
   */
  persistState() {
    Storage.saveQuizState({
      currentQuestionIndex: this.currentIndex,
      answers: this.answers
    });
  }

  getCurrentQuestion() {
    return this.questions[this.currentIndex];
  }

  getCurrentIndex() {
    return this.currentIndex;
  }

  getTotalQuestions() {
    return this.totalQuestions;
  }

  /**
   * Returns selected option type ('01'..'04') for the current question, or null.
   */
  getSelectedOption() {
    const currentQ = this.getCurrentQuestion();
    return this.answers[currentQ.id] || null;
  }

  /**
   * Records or updates the selected option for the current question.
   * Does NOT duplicate count when option is changed.
   * @param {'01'|'02'|'03'|'04'} optionType
   */
  selectOption(optionType) {
    const currentQ = this.getCurrentQuestion();
    this.answers[currentQ.id] = optionType;
    this.persistState();
  }

  /**
   * Checks if current question has an answer.
   */
  hasAnsweredCurrent() {
    return Boolean(this.getSelectedOption());
  }

  canGoPrev() {
    return this.currentIndex > 0;
  }

  canGoNext() {
    return this.hasAnsweredCurrent() && this.currentIndex < this.totalQuestions - 1;
  }

  isLastQuestion() {
    return this.currentIndex === this.totalQuestions - 1;
  }

  /**
   * Checks whether all 10 questions are answered.
   */
  isComplete() {
    return (
      this.questions.every((q) => Boolean(this.answers[q.id])) &&
      Object.keys(this.answers).length === this.totalQuestions
    );
  }

  prevQuestion() {
    if (this.canGoPrev()) {
      this.currentIndex -= 1;
      this.persistState();
      return true;
    }
    return false;
  }

  nextQuestion() {
    if (this.canGoNext()) {
      this.currentIndex += 1;
      this.persistState();
      return true;
    }
    return false;
  }

  /**
   * Jump to a specific question index (if answered or previous).
   * @param {number} targetIndex
   */
  goToQuestion(targetIndex) {
    if (targetIndex >= 0 && targetIndex < this.totalQuestions) {
      this.currentIndex = targetIndex;
      this.persistState();
      return true;
    }
    return false;
  }

  /**
   * Returns percentage of completion: (currentQuestionNumber / total) * 100
   */
  getProgressPercentage() {
    return Math.round(((this.currentIndex + 1) / this.totalQuestions) * 100);
  }

  /**
   * Submits answers, generates result dossier, and saves to sessionStorage.
   * @returns {Object} Result payload
   */
  submit() {
    if (!this.isComplete()) {
      throw new Error('Cannot submit quiz: all 10 questions must be answered.');
    }

    // Convert map to array matching question sequence
    const answersList = this.questions.map((q) => this.answers[q.id]);
    const result = generateResult(answersList);

    // Save result to storage
    Storage.saveResult(result);

    return result;
  }

  /**
   * Clears state and resets progress.
   */
  reset() {
    this.currentIndex = 0;
    this.answers = {};
    Storage.clearQuizState();
    Storage.clearResult();
  }
}

