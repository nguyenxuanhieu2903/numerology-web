/**
 * NUMEROLOGY — Scoring Engine
 * Pure mathematical scoring and archetype synthesis.
 * Independent of DOM or jQuery.
 */

import { archetypes, tieCombinations } from '../data/results.js';

export const VALID_ARCHETYPES = ['01', '02', '03', '04'];
export const REQUIRED_QUESTION_COUNT = 10;

/**
 * Validates input answers.
 * Accepts either:
 * - Array of archetype strings: ['01', '02', ...]
 * - Object with questionId keys: { 1: '01', 2: '04', ... }
 * @param {Array|Object} answers
 * @returns {Array<string>} normalized list of 10 archetype keys
 */
export function validateAndNormalizeAnswers(answers) {
  if (!answers || typeof answers !== 'object') {
    throw new Error('Answers must be a non-null object or array.');
  }

  const values = Array.isArray(answers) ? answers : Object.values(answers);

  if (values.length !== REQUIRED_QUESTION_COUNT) {
    throw new Error(`Expected exactly ${REQUIRED_QUESTION_COUNT} answers, but received ${values.length}.`);
  }

  for (let i = 0; i < values.length; i++) {
    const type = String(values[i]).trim();
    if (!VALID_ARCHETYPES.includes(type)) {
      throw new Error(`Invalid answer archetype '${type}' at index ${i}. Must be one of: ${VALID_ARCHETYPES.join(', ')}.`);
    }
  }

  return values.map((v) => String(v).trim());
}

/**
 * Calculates raw score counts for each archetype.
 * @param {Array|Object} answers
 * @returns {Record<'01'|'02'|'03'|'04', number>}
 */
export function calculateScores(answers) {
  const normalized = validateAndNormalizeAnswers(answers);

  const scores = {
    '01': 0,
    '02': 0,
    '03': 0,
    '04': 0
  };

  normalized.forEach((type) => {
    scores[type] += 1;
  });

  return scores;
}

/**
 * Calculates integer percentages summing strictly to 100%
 * using the Largest Remainder Method (Hare-Niemeyer method).
 * @param {Record<string, number>} scores
 * @returns {Record<'01'|'02'|'03'|'04', number>}
 */
export function calculatePercentages(scores) {
  const total = VALID_ARCHETYPES.reduce((sum, key) => sum + (scores[key] || 0), 0);

  if (total === 0) {
    return { '01': 25, '02': 25, '03': 25, '04': 25 };
  }

  const items = VALID_ARCHETYPES.map((key) => {
    const count = scores[key] || 0;
    const exact = (count / total) * 100;
    const floor = Math.floor(exact);
    const remainder = exact - floor;
    return { key, count, floor, remainder };
  });

  const currentSum = items.reduce((sum, item) => sum + item.floor, 0);
  let missingPoints = 100 - currentSum;

  // Sort descending by remainder to distribute missing points
  items.sort((a, b) => b.remainder - a.remainder);

  for (let i = 0; i < missingPoints && i < items.length; i++) {
    items[i].floor += 1;
  }

  const result = {};
  items.forEach((item) => {
    result[item.key] = item.floor;
  });

  return result;
}

/**
 * Identifies the dominant archetype(s) with the highest score.
 * Returns an array of winning archetype IDs (e.g. ['01'] or ['01', '03']).
 * Never arbitrarily breaks ties.
 * @param {Record<string, number>} scores
 * @returns {Array<string>}
 */
export function getDominantTypes(scores) {
  let maxScore = -1;
  VALID_ARCHETYPES.forEach((key) => {
    const score = scores[key] || 0;
    if (score > maxScore) {
      maxScore = score;
    }
  });

  return VALID_ARCHETYPES.filter((key) => scores[key] === maxScore);
}

/**
 * Generates the full result dossier from user answers.
 * @param {Array|Object} answers
 * @returns {Object} Complete result payload
 */
export function generateResult(answers) {
  const normalized = validateAndNormalizeAnswers(answers);
  const scores = calculateScores(normalized);
  const percentages = calculatePercentages(scores);
  const dominantTypes = getDominantTypes(scores);
  const isTie = dominantTypes.length > 1;

  let tieKey = null;
  let tieData = null;

  if (isTie) {
    tieKey = dominantTypes.slice().sort().join('-');
    tieData = tieCombinations[tieKey] || {
      key: tieKey,
      types: dominantTypes,
      title: {
        vi: `Sự Hòa Quyện Của ${dominantTypes.length} Năng Lượng`,
        en: `Harmonic Convergence of ${dominantTypes.length} Currents`
      },
      description: {
        vi: `Các câu trả lời của bạn phản ánh sự cân bằng đồng đều giữa các nhóm ${dominantTypes.map((id) => archetypes[id].name.vi).join(', ')}.`,
        en: `Your responses reflect an equal, balanced resonance between ${dominantTypes.map((id) => archetypes[id].name.en).join(', ')}.`
      }
    };
  }

  const dominantArchetypes = dominantTypes.map((id) => archetypes[id]);
  const primaryArchetype = dominantArchetypes[0];

  return {
    isValid: true,
    answers: normalized,
    totalQuestions: REQUIRED_QUESTION_COUNT,
    scores,
    percentages,
    dominantTypes,
    isTie,
    tieKey,
    tieData,
    primaryArchetype,
    dominantArchetypes,
    createdAt: new Date().toISOString()
  };
}
