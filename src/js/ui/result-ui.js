/**
 * NUMEROLOGY — Result Page UI Controller
 * Renders dominant energy profile, composite ties, narrative insights,
 * animated matrix distribution, and handles Share & Retake actions.
 */

import $ from 'jquery';
import { Storage } from '../core/storage.js';
import { archetypes, tieCombinations } from '../data/results.js';
import { calculatePercentages } from '../core/scoring.js';
import { getCurrentLanguage, t } from '../utils/language.js';
import { showToast, copyToClipboard, showManualCopyModal, escapeHtml } from '../utils/dom.js';

/**
 * Resolves result either from session storage or URL query params (for shared links).
 */
function resolveResultData() {
  const sessionResult = Storage.getResult();
  if (sessionResult && sessionResult.isValid) {
    return sessionResult;
  }

  // Attempt URL query fallback for shared links (?type=01 or ?type=01-03)
  try {
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get('type') || params.get('dominant');
    if (typeParam) {
      const parts = typeParam.split('-').map((s) => s.trim()).filter((s) => archetypes[s]);
      if (parts.length >= 1 && parts.length <= 4) {
        const isTie = parts.length > 1;
        const tieKey = parts.slice().sort().join('-');
        const tieData = isTie ? tieCombinations[tieKey] || null : null;
        const primaryArchetype = archetypes[parts[0]];
        const dominantArchetypes = parts.map((id) => archetypes[id]);

        // Synthesize display proportions for shared view
        const baseScore = Math.floor(10 / parts.length);
        const remainder = 10 % parts.length;
        const scores = { '01': 0, '02': 0, '03': 0, '04': 0 };
        parts.forEach((p, idx) => {
          scores[p] = baseScore + (idx < remainder ? 1 : 0);
        });
        const percentages = calculatePercentages(scores);

        return {
          isValid: true,
          isSharedView: true,
          dominantTypes: parts,
          isTie,
          tieKey,
          tieData,
          primaryArchetype,
          dominantArchetypes,
          scores,
          percentages,
          totalQuestions: 10
        };
      }
    }
  } catch (e) {}

  return null;
}

export function initResultUI() {
  const resultData = resolveResultData();

  const $emptyState = $('#result-empty-state');
  const $resultContent = $('#result-content-container');

  if (!resultData || !resultData.isValid) {
    // Show empty state guard
    $emptyState.show();
    $resultContent.hide();
    return;
  }

  $emptyState.hide();
  $resultContent.show();

  renderResult(resultData);

  // Retake Quiz Action
  $('#btn-retake-quiz').on('click', function (e) {
    e.preventDefault();
    Storage.clearAllQuizData();
    window.location.href = './quiz.html';
  });

  // Share Result Action
  $('#btn-share-result').on('click', async function (e) {
    e.preventDefault();
    await handleShare(resultData);
  });

  // Re-render when language changed
  window.addEventListener('numerology:languageChanged', () => {
    renderResult(resultData);
  });
}

function renderResult(result) {
  const lang = getCurrentLanguage();
  const { dominantTypes, isTie, tieData, primaryArchetype, percentages, scores, isSharedView } = result;

  // 0. Shared View Notice
  if (isSharedView) {
    if (!$('#shared-view-banner').length) {
      $('#result-content-container').prepend(`
        <div id="shared-view-banner" class="alert-banner alert-warning" style="background-color: var(--color-bg-subtle); border: 1.5px solid var(--color-primary-accent); color: var(--color-dark-jade); margin-bottom: var(--space-xl);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px;">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <span data-i18n="resultSharedNotice">${escapeHtml(t('resultSharedNotice'))}</span>
        </div>
      `);
    }
  }

  // 1. Tie Banner
  const $tieContainer = $('#result-tie-container');
  if (isTie && tieData) {
    const tieTitle = tieData.title[lang] || tieData.title.vi;
    const tieDesc = tieData.description[lang] || tieData.description.vi;
    $tieContainer.html(`
      <div class="tie-banner">
        <div class="badge badge-accent tie-banner-badge">${escapeHtml(t('resultTieBadge'))}</div>
        <h3 class="tie-banner-title">${escapeHtml(tieTitle)}</h3>
        <p class="tie-banner-desc">${escapeHtml(tieDesc)}</p>
      </div>
    `).show();
  } else {
    $tieContainer.hide().empty();
  }

  // 2. Hero Dossier Card
  const dominantNumbers = dominantTypes.join(' & ');
  const archetypeNames = dominantTypes
    .map((id) => archetypes[id].name[lang] || archetypes[id].name.vi)
    .join(' • ');

  $('#result-archetype-number').text(dominantNumbers);
  $('#result-archetype-name').text(archetypeNames);

  const subTitle = isTie && tieData
    ? tieData.title[lang] || tieData.title.vi
    : primaryArchetype.title[lang] || primaryArchetype.title.vi;
  $('#result-archetype-title').text(subTitle);

  const quoteText = primaryArchetype.quote[lang] || primaryArchetype.quote.vi;
  $('#result-archetype-quote').text(quoteText);

  const descText = isTie && tieData
    ? tieData.description[lang] || tieData.description.vi
    : primaryArchetype.description[lang] || primaryArchetype.description.vi;
  $('#result-archetype-desc').text(descText);

  // Hero Archetype Image
  $('#result-archetype-img')
    .attr('src', primaryArchetype.image)
    .attr('alt', primaryArchetype.name[lang] || primaryArchetype.name.vi);

  // 3. Narrative Lists (Strengths, Areas for Improvement, Growth Advice)
  renderNarrativeLists(result, lang);

  // 4. Energy Distribution Matrix
  renderEnergyMatrix(scores, percentages, lang);
}

function renderNarrativeLists(result, lang) {
  const { dominantTypes } = result;

  // Merge strengths, areas, and advice from all dominant types (if tie)
  let strengths = [];
  let areas = [];
  let advice = [];

  dominantTypes.forEach((id) => {
    const arch = archetypes[id];
    strengths.push(...(arch.strengths[lang] || arch.strengths.vi));
    areas.push(...(arch.areasToImprove[lang] || arch.areasToImprove.vi));
    advice.push(...(arch.growthAdvice[lang] || arch.growthAdvice.vi));
  });

  // Limit to max 4 most pertinent items per card for clean balance
  strengths = strengths.slice(0, 4);
  areas = areas.slice(0, 4);
  advice = advice.slice(0, 4);

  $('#list-strengths').html(strengths.map((item) => `<li>${escapeHtml(item)}</li>`).join(''));
  $('#list-areas').html(areas.map((item) => `<li>${escapeHtml(item)}</li>`).join(''));
  $('#list-advice').html(advice.map((item) => `<li>${escapeHtml(item)}</li>`).join(''));
}

function renderEnergyMatrix(scores, percentages, lang) {
  const types = ['01', '02', '03', '04'];

  types.forEach((id) => {
    const arch = archetypes[id];
    const score = scores[id] || 0;
    const pct = percentages[id] || 0;
    const name = arch.name[lang] || arch.name.vi;

    $(`#matrix-name-${id}`).text(`${id} — ${name}`);
    $(`#matrix-score-${id}`).text(`${score} / 10`);
    $(`#matrix-pct-${id}`).text(`${pct}%`);

    // Update accessible progressbar attributes
    $(`#matrix-track-${id}`)
      .attr('aria-valuenow', pct)
      .attr('aria-label', `${name}: ${pct}%`);

    // Animate bar width with jQuery
    setTimeout(() => {
      $(`#matrix-bar-${id}`).css('width', `${pct}%`);
    }, 150);
  });
}

async function handleShare(result) {
  const lang = getCurrentLanguage();
  const dominantName = result.dominantTypes
    .map((id) => archetypes[id].name[lang] || archetypes[id].name.vi)
    .join(' & ');

  const shareTitle = t('resultShareTitle');
  const shareText = `${t('resultShareText')} ${dominantName}!`;
  const shareUrl = `${window.location.origin}${window.location.pathname}?type=${result.dominantTypes.join('-')}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl
      });
      return;
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('[Share] Web Share API failed or aborted, using clipboard fallback.', err);
      } else {
        return;
      }
    }
  }

  // Fallback: Copy to clipboard
  const copied = await copyToClipboard(`${shareText}\n${shareUrl}`);
  if (copied) {
    showToast(t('resultToastCopied'), 'success');
  } else {
    // Ultimate accessible fallback: Display manual copy modal
    showManualCopyModal(shareUrl);
  }
}

