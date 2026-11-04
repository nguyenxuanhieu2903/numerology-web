/**
 * NUMEROLOGY — Quiz Engine & Storage Integration Test
 * Simulates real user flows: selecting options, previous/next navigation,
 * changing answers, submitting, and retaking.
 */

// Global browser storage mock for Node environment
const mockSessionStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

globalThis.sessionStorage = mockSessionStorage;
globalThis.localStorage = mockLocalStorage;

import { QuizEngine } from '../core/quiz-engine.js';
import { Storage } from '../core/storage.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed += 1;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed += 1;
  }
}

console.log('\n--- [TEST SUITE: Quiz Engine Navigation & Storage] ---');

// 1. Initial State
Storage.clearAllQuizData();
const engine = new QuizEngine();

assert(engine.getTotalQuestions() === 10, 'Quiz has exactly 10 questions');
assert(engine.getCurrentIndex() === 0, 'Starts at question index 0');
assert(engine.canGoPrev() === false, 'Cannot go previous from question 1');
assert(engine.canGoNext() === false, 'Cannot go next before answering question 1');
assert(engine.isComplete() === false, 'Quiz is not complete initially');

// 2. Select Option & Navigation
engine.selectOption('01');
assert(engine.getSelectedOption() === '01', 'Records selected option for Question 1');
assert(engine.hasAnsweredCurrent() === true, 'Question 1 is marked as answered');
assert(engine.canGoNext() === true, 'Can advance to Question 2 after answering');

engine.nextQuestion();
assert(engine.getCurrentIndex() === 1, 'Advanced to Question index 1 (Question 2)');
assert(engine.canGoPrev() === true, 'Can navigate back to Question 1');
assert(engine.getSelectedOption() === null, 'Question 2 initially has no selection');

// 3. Preserve Answer on Previous
engine.prevQuestion();
assert(engine.getCurrentIndex() === 0, 'Navigated back to Question 1');
assert(engine.getSelectedOption() === '01', 'Preserves previous selection for Question 1');

// 4. Overwrite Option without Duplicate Counting
engine.selectOption('03');
assert(engine.getSelectedOption() === '03', 'Overwrites selection from 01 to 03');
assert(Object.keys(engine.answers).length === 1, 'Does not duplicate entries in answers map');

// 5. Complete Remaining Questions (2 to 10)
const sampleChoices = ['02', '03', '04', '01', '02', '03', '04', '01', '03'];
for (let i = 1; i < 10; i++) {
  engine.goToQuestion(i);
  engine.selectOption(sampleChoices[i - 1]);
}

assert(engine.isComplete() === true, 'All 10 questions are answered');
assert(engine.isLastQuestion() === true, 'Current question is index 9 (Question 10)');

// 6. Submit Quiz
const result = engine.submit();
assert(result.isValid === true, 'Generates valid result payload');
assert(result.totalQuestions === 10, 'Result totalQuestions is 10');
assert(
  result.scores['01'] + result.scores['02'] + result.scores['03'] + result.scores['04'] === 10,
  'Sum of raw archetype scores equals 10'
);
assert(
  result.percentages['01'] + result.percentages['02'] + result.percentages['03'] + result.percentages['04'] === 100,
  'Sum of percentages equals 100%'
);

// 7. Verify Storage
const savedResult = Storage.getResult();
assert(savedResult !== null && savedResult.isValid === true, 'Result correctly persisted in Storage');

// 8. Retake Quiz Clears Data
Storage.clearAllQuizData();
assert(Storage.getResult() === null, 'Storage.clearAllQuizData() safely clears result');
assert(Storage.getQuizState() === null, 'Storage.clearAllQuizData() safely clears quiz progress');

// 9. Language Preference Persistence
Storage.setLanguage('en');
assert(Storage.getLanguage() === 'en', 'Persists language preference "en"');
Storage.setLanguage('vi');
assert(Storage.getLanguage() === 'vi', 'Persists language preference "vi"');

console.log('\n=============================================');
console.log(`TOTAL TESTS: ${passed + failed}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log('=============================================\n');

if (failed > 0) process.exit(1);
