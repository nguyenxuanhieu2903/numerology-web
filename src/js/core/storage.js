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
   * Retrieves saved quiz state from sessionStorage.
   * @returns {{ currentQuestionIndex: number, answers: Record<number, string> } | null}
   */
  getQuizState() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.QUIZ_STATE);
      return safeParse(raw, null);
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
   * Retrieves computed result from sessionStorage.
   * @returns {Object | null}
   */
  getResult() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.RESULT_DATA);
      const data = safeParse(raw, null);
      if (data && data.isValid && data.dominantTypes && data.scores) {
        return data;
      }
      return null;
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
