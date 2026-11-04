/**
 * NUMEROLOGY — Scoring Engine Test Suite
 * Validates calculations, tie handling, percentage normalization, and validation rules.
 */

import {
  calculateScores,
  calculatePercentages,
  getDominantTypes,
  generateResult,
  validateAndNormalizeAnswers
} from '../core/scoring.js';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed += 1;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed += 1;
  }
}

function assertThrows(fn, testName) {
  try {
    fn();
    console.error(`  ✗ FAIL: ${testName} (did not throw)`);
    failed += 1;
  } catch (err) {
    console.log(`  ✓ PASS: ${testName} (threw as expected: ${err.message})`);
    passed += 1;
  }
}

console.log('\n--- [TEST SUITE: Validation & Normalization] ---');

assertThrows(() => {
  validateAndNormalizeAnswers(null);
}, 'Throws on null input');

assertThrows(() => {
  validateAndNormalizeAnswers(['01', '02', '03']);
}, 'Throws when fewer than 10 answers provided');

assertThrows(() => {
  validateAndNormalizeAnswers(['01', '02', '03', '04', '01', '02', '03', '04', '01', '02', '03']);
}, 'Throws when more than 10 answers provided');

assertThrows(() => {
  validateAndNormalizeAnswers(['01', '02', '03', '04', '01', '99', '03', '04', '01', '02']);
}, 'Throws when invalid archetype token (99) is present');

const validObjectAnswers = {
  1: '01', 2: '01', 3: '02', 4: '02', 5: '03',
  6: '03', 7: '04', 8: '04', 9: '01', 10: '02'
};
const normalized = validateAndNormalizeAnswers(validObjectAnswers);
assert(normalized.length === 10 && normalized[0] === '01', 'Normalizes object dictionary to 10-element array');

console.log('\n--- [TEST SUITE: Scoring Calculation] ---');

const scores1 = calculateScores(['01', '01', '01', '01', '02', '02', '03', '03', '04', '04']);
assert(
  scores1['01'] === 4 && scores1['02'] === 2 && scores1['03'] === 2 && scores1['04'] === 2,
  'Correctly counts score distribution (4, 2, 2, 2)'
);

console.log('\n--- [TEST SUITE: Single Winners for all 4 Archetypes] ---');

const leaderAnswers = ['01', '01', '01', '01', '01', '01', '02', '02', '03', '04'];
const leaderResult = generateResult(leaderAnswers);
assert(
  leaderResult.dominantTypes.length === 1 &&
  leaderResult.dominantTypes[0] === '01' &&
  leaderResult.isTie === false &&
  leaderResult.primaryArchetype.id === '01',
  'Dominant winner is Archetype 01 (The Leader)'
);

const harmonizerAnswers = ['02', '02', '02', '02', '02', '01', '01', '03', '04', '04'];
const harmonizerResult = generateResult(harmonizerAnswers);
assert(
  harmonizerResult.dominantTypes[0] === '02' && harmonizerResult.isTie === false,
  'Dominant winner is Archetype 02 (The Harmonizer)'
);

const creatorAnswers = ['03', '03', '03', '03', '03', '03', '01', '02', '04', '04'];
const creatorResult = generateResult(creatorAnswers);
assert(
  creatorResult.dominantTypes[0] === '03' && creatorResult.isTie === false,
  'Dominant winner is Archetype 03 (The Creator)'
);

const builderAnswers = ['04', '04', '04', '04', '04', '01', '02', '03', '01', '02'];
const builderResult = generateResult(builderAnswers);
assert(
  builderResult.dominantTypes[0] === '04' && builderResult.isTie === false,
  'Dominant winner is Archetype 04 (The Builder)'
);

console.log('\n--- [TEST SUITE: Tie Handling (2-Way, 3-Way, 4-Way)] ---');

// 2-Way Tie: 01 and 03 (5 each)
const tie2Answers = ['01', '01', '01', '01', '01', '03', '03', '03', '03', '03'];
const tie2Result = generateResult(tie2Answers);
assert(
  tie2Result.isTie === true &&
  tie2Result.dominantTypes.length === 2 &&
  tie2Result.dominantTypes.includes('01') &&
  tie2Result.dominantTypes.includes('03') &&
  tie2Result.tieKey === '01-03' &&
  Boolean(tie2Result.tieData),
  'Handles 2-way tie (01 and 03) with composite key 01-03'
);

// 3-Way Tie: 01, 02, 04 (3 each), 03 (1)
const tie3Answers = ['01', '01', '01', '02', '02', '02', '04', '04', '04', '03'];
const tie3Result = generateResult(tie3Answers);
assert(
  tie3Result.isTie === true &&
  tie3Result.dominantTypes.length === 3 &&
  tie3Result.dominantTypes.includes('01') &&
  tie3Result.dominantTypes.includes('02') &&
  tie3Result.dominantTypes.includes('04') &&
  tie3Result.tieKey === '01-02-04' &&
  Boolean(tie3Result.tieData),
  'Handles 3-way tie (01-02-04) with composite tie data'
);

// 4-Way Tie Check via direct score evaluation
const tie4Scores = { '01': 3, '02': 3, '03': 3, '04': 3 };
const tie4Dominants = getDominantTypes(tie4Scores);
assert(
  tie4Dominants.length === 4 &&
  tie4Dominants.join('-') === '01-02-03-04',
  'Handles 4-way tie evaluation identifying all 4 archetypes'
);

console.log('\n--- [TEST SUITE: Percentage Calculation & 100% Sum Guarantee] ---');

const distributionsToTest = [
  { '01': 10, '02': 0, '03': 0, '04': 0 },
  { '01': 4, '02': 3, '03': 2, '04': 1 },
  { '01': 3, '02': 3, '03': 2, '04': 2 },
  { '01': 3, '02': 3, '03': 3, '04': 1 },
  { '01': 7, '02': 1, '03': 1, '04': 1 },
  { '01': 5, '02': 5, '03': 0, '04': 0 },
  { '01': 1, '02': 1, '03': 1, '04': 7 },
  // Odd numbers for rounding edge cases
  { '01': 3, '02': 3, '03': 3, '04': 3 },
  { '01': 1, '02': 2, '03': 3, '04': 4 }
];

distributionsToTest.forEach((dist, idx) => {
  const p = calculatePercentages(dist);
  const total = p['01'] + p['02'] + p['03'] + p['04'];
  assert(total === 100, `Distribution #${idx + 1} (${JSON.stringify(dist)}) sums strictly to 100% (Calculated: ${JSON.stringify(p)})`);
});

console.log('\n=============================================');
console.log(`TOTAL TESTS: ${passed + failed}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log('=============================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
