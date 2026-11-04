/**
 * NUMEROLOGY — Storage Utility Module
 * Encapsulates sessionStorage (quiz progress & result) and localStorage (language preference).
 * Includes schema validation and safe JSON parsing.
 */

const STORAGE_KEYS = {
  QUIZ_STATE: 'NUMEROLOGY_QUIZ_STATE_V1',
  RESULT_DATA: 'NUMEROLOGY_RESULT_DATA_V1',
  LANGUAGE: 'NUMEROLOGY_LANGUAGE_PREF_V1'
};

/**
 * Safely parses JSON string or returns fallback.
 */
function safeParse(raw, fallback = null) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[Storage] JSON parse error:', err);
    return fallback;
  }
}

const VALID_TYPES = ['01', '02', '03', '04'];

export const Storage = {
  /**
   * Saves in-progress quiz state to sessionStorage.
   * @param {{ currentQuestionIndex: number, answers: Record<number, string> }} state
   */
  saveQuizState(state) {
    try {
      sessionStorage.setItem(STORAGE_KEYS.QUIZ_STATE, JSON.stringify(state));
    } catch (e) {
      console.error('[Storage] Failed to save quiz state', e);
    }
  },

  /**
   * Retrieves and strictly validates saved quiz state from sessionStorage.
   * @returns {{ currentQuestionIndex: number, answers: Record<number, string> } | null}
   */
  getQuizState() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.QUIZ_STATE);
      const data = safeParse(raw, null);
      if (!data || typeof data !== 'object') return null;

      const idx = Number(data.currentQuestionIndex);
      const validIndex = Number.isInteger(idx) && idx >= 0 && idx < 10 ? idx : 0;

      const validAnswers = {};
      if (data.answers && typeof data.answers === 'object') {
        Object.keys(data.answers).forEach((k) => {
          const numKey = Number(k);
          const val = String(data.answers[k]).trim();
          if (Number.isInteger(numKey) && numKey >= 1 && numKey <= 10 && VALID_TYPES.includes(val)) {
            validAnswers[numKey] = val;
          }
        });
      }

      return {
        currentQuestionIndex: validIndex,
        answers: validAnswers
      };
    } catch (e) {
      return null;
    }
  },

  /**
   * Clears quiz state from sessionStorage.
   */
  clearQuizState() {
    try {
      sessionStorage.removeItem(STORAGE_KEYS.QUIZ_STATE);
    } catch (e) {}
  },

  /**
   * Saves computed result to sessionStorage.
   * @param {Object} result
   */
  saveResult(result) {
    try {
      sessionStorage.setItem(STORAGE_KEYS.RESULT_DATA, JSON.stringify(result));
    } catch (e) {
      console.error('[Storage] Failed to save result data', e);
    }
  },

  /**
   * Retrieves and strictly validates computed result from sessionStorage.
   * Protects against DOM-based XSS and session poisoning.
   * @returns {Object | null}
   */
  getResult() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.RESULT_DATA);
      const data = safeParse(raw, null);
      if (!data || typeof data !== 'object' || data.isValid !== true) {
        return null;
      }

      if (!Array.isArray(data.dominantTypes) || data.dominantTypes.length === 0) {
        return null;
      }

      // Ensure every dominant type is valid
      const hasOnlyValidTypes = data.dominantTypes.every((t) => VALID_TYPES.includes(String(t).trim()));
      if (!hasOnlyValidTypes) {
        return null;
      }

      // Ensure scores object exists with non-negative numbers
      if (!data.scores || typeof data.scores !== 'object') {
        return null;
      }

      const validScores = {};
      VALID_TYPES.forEach((k) => {
        const val = Number(data.scores[k]);
        validScores[k] = isNaN(val) || val < 0 ? 0 : val;
      });

      return {
        ...data,
        dominantTypes: data.dominantTypes.map((t) => String(t).trim()),
        scores: validScores
      };
    } catch (e) {
      return null;
    }
  },

  /**
   * Clears computed result from sessionStorage.
   */
  clearResult() {
    try {
      sessionStorage.removeItem(STORAGE_KEYS.RESULT_DATA);
    } catch (e) {}
  },

  /**
   * Clears both quiz state and result.
   */
  clearAllQuizData() {
    this.clearQuizState();
    this.clearResult();
  },

  /**
   * Gets preferred language from localStorage. Default is 'vi'.
   * @returns {'vi'|'en'}
   */
  getLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      return saved === 'en' ? 'en' : 'vi';
    } catch (e) {
      return 'vi';
    }
  },

  /**
   * Saves preferred language to localStorage.
   * @param {'vi'|'en'} lang
   */
  setLanguage(lang) {
    try {
      const valid = lang === 'en' ? 'en' : 'vi';
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, valid);
    } catch (e) {}
  }
};

