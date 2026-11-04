/**
 * NUMEROLOGY — Comprehensive QA Audit Test Suite
 * Validates Security, Storage Poisoning, Edge Cases, Negative/NaN inputs,
 * and Bilingual Translation Dictionary Symmetry.
 */

// Storage mock for Node environment
const mockSessionStore = {};
const mockLocalStore = {};

globalThis.sessionStorage = {
  getItem: (k) => mockSessionStore[k] || null,
  setItem: (k, v) => { mockSessionStore[k] = String(v); },
  removeItem: (k) => { delete mockSessionStore[k]; },
  clear: () => { for (const k in mockSessionStore) delete mockSessionStore[k]; }
};

globalThis.localStorage = {
  getItem: (k) => mockLocalStore[k] || null,
  setItem: (k, v) => { mockLocalStore[k] = String(v); },
  removeItem: (k) => { delete mockLocalStore[k]; },
  clear: () => { for (const k in mockLocalStore) delete mockLocalStore[k]; }
};

import { calculatePercentages, getDominantTypes, calculateScores, generateResult } from '../core/scoring.js';
import { Storage } from '../core/storage.js';
import { QuizEngine } from '../core/quiz-engine.js';
import { translations } from '../data/translations.js';
import { questions } from '../data/questions.js';
import { archetypes, tieCombinations } from '../data/results.js';

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

console.log('\n--- [QA TEST: Translation Dictionary Symmetry & Completeness] ---');

const viKeys = Object.keys(translations.vi);
const enKeys = Object.keys(translations.en);

assert(viKeys.length === enKeys.length, `Vietnamese key count (${viKeys.length}) matches English (${enKeys.length})`);

const missingInEn = viKeys.filter((k) => !(k in translations.en));
assert(missingInEn.length === 0, `All Vietnamese keys exist in English (Missing: ${missingInEn.join(', ') || 'None'})`);

const missingInVi = enKeys.filter((k) => !(k in translations.vi));
assert(missingInVi.length === 0, `All English keys exist in Vietnamese (Missing: ${missingInVi.join(', ') || 'None'})`);

// Check that no translation value is undefined, null, or empty string
let hasEmptyStrings = false;
viKeys.forEach((k) => {
  if (!translations.vi[k] || String(translations.vi[k]).trim() === '') hasEmptyStrings = true;
  if (!translations.en[k] || String(translations.en[k]).trim() === '') hasEmptyStrings = true;
});
assert(!hasEmptyStrings, 'No empty, null, or undefined translation entries found');

console.log('\n--- [QA TEST: Question Bank Quality & 4-Archetype Integrity] ---');

assert(questions.length === 10, 'Question bank contains exactly 10 questions');

let questionsValid = true;
questions.forEach((q, idx) => {
  if (q.id !== idx + 1) questionsValid = false;
  if (!q.title.vi || !q.title.en) questionsValid = false;
  if (!q.subtitle.vi || !q.subtitle.en) questionsValid = false;
  if (!Array.isArray(q.options) || q.options.length !== 4) questionsValid = false;

  const optionTypes = q.options.map((o) => o.type).sort();
  if (optionTypes.join(',') !== '01,02,03,04') questionsValid = false;
});
assert(questionsValid, 'All 10 questions have bilingual text and exactly 4 options mapping to 01, 02, 03, 04');

console.log('\n--- [QA TEST: Robustness Against NaN, Null, Negative, and Malformed Scores] ---');

const zeroScores = { '01': 0, '02': 0, '03': 0, '04': 0 };
const zeroPct = calculatePercentages(zeroScores);
assert(
  zeroPct['01'] + zeroPct['02'] + zeroPct['03'] + zeroPct['04'] === 100,
  'Zero scores distribution sums strictly to 100%'
);

const zeroDominants = getDominantTypes(zeroScores);
assert(zeroDominants.length === 4, 'Zero scores returns all 4 archetypes as harmonic equilibrium');

const negativeScores = { '01': -10, '02': -5, '03': 0, '04': 0 };
const negPct = calculatePercentages(negativeScores);
assert(
  negPct['01'] + negPct['02'] + negPct['03'] + negPct['04'] === 100 &&
  negPct['01'] >= 0 && negPct['02'] >= 0,
  'Negative scores are sanitized and percentages sum strictly to 100%'
);

const nanScores = { '01': NaN, '02': 'invalid', '03': null, '04': undefined };
const nanPct = calculatePercentages(nanScores);
assert(
  nanPct['01'] + nanPct['02'] + nanPct['03'] + nanPct['04'] === 100,
  'NaN, string, null, and undefined scores sanitized to 100%'
);

const nullDominants = getDominantTypes(null);
assert(nullDominants.length === 4, 'getDominantTypes(null) handles null gracefully without throwing');

console.log('\n--- [QA TEST: Storage Poisoning & Malicious Payload Sanitization] ---');

// Poisoning attack 1: Invalid archetype ID in dominantTypes
sessionStorage.setItem('NUMEROLOGY_RESULT_DATA_V1', JSON.stringify({
  isValid: true,
  dominantTypes: ['hack_id', '<script>alert(1)</script>'],
  scores: { '01': 10, '02': 0, '03': 0, '04': 0 }
}));
const poisonedResult1 = Storage.getResult();
assert(poisonedResult1 === null, 'Rejects result with poisoned / unknown dominantTypes');

// Poisoning attack 2: Missing scores or non-object scores
sessionStorage.setItem('NUMEROLOGY_RESULT_DATA_V1', JSON.stringify({
  isValid: true,
  dominantTypes: ['01'],
  scores: 'not_an_object'
}));
const poisonedResult2 = Storage.getResult();
assert(poisonedResult2 === null, 'Rejects result with malformed scores payload');

// Poisoning attack 3: isValid set to false or missing
sessionStorage.setItem('NUMEROLOGY_RESULT_DATA_V1', JSON.stringify({
  isValid: false,
  dominantTypes: ['01'],
  scores: { '01': 10, '02': 0, '03': 0, '04': 0 }
}));
const poisonedResult3 = Storage.getResult();
assert(poisonedResult3 === null, 'Rejects result when isValid is false');

// Poisoning attack 4: Corrupt quiz state index and answers
sessionStorage.setItem('NUMEROLOGY_QUIZ_STATE_V1', JSON.stringify({
  currentQuestionIndex: 9999,
  answers: {
    1: '01',
    2: 'invalid_type',
    99: '02'
  }
}));
const sanitizedState = Storage.getQuizState();
assert(
  sanitizedState.currentQuestionIndex === 0 &&
  sanitizedState.answers[1] === '01' &&
  sanitizedState.answers[2] === undefined &&
  sanitizedState.answers[99] === undefined,
  'Sanitizes out-of-range index to 0 and purges invalid question answers'
);

console.log('\n--- [QA TEST: Tie Combinations Catalog Coverage] ---');

// All 6 2-way ties: 01-02, 01-03, 01-04, 02-03, 02-04, 03-04
const expected2WayTies = ['01-02', '01-03', '01-04', '02-03', '02-04', '03-04'];
const hasAll2Way = expected2WayTies.every((k) => k in tieCombinations);
assert(hasAll2Way, 'All 6 2-way tie combinations are defined in results.js');

// All 4 3-way ties: 01-02-03, 01-02-04, 01-03-04, 02-03-04
const expected3WayTies = ['01-02-03', '01-02-04', '01-03-04', '02-03-04'];
const hasAll3Way = expected3WayTies.every((k) => k in tieCombinations);
assert(hasAll3Way, 'All 4 3-way tie combinations are defined in results.js');

// 4-way tie
assert('01-02-03-04' in tieCombinations, '4-way harmonic equilibrium combination is defined');

console.log('\n=============================================');
console.log(`TOTAL QA TESTS: ${passed + failed}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log('=============================================\n');

if (failed > 0) process.exit(1);
