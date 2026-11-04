/**
 * NUMEROLOGY — Landing Page UI Controller
 * jQuery-powered interactions: scroll reveal, mobile drawer, smooth scroll, header states.
 */

import $ from 'jquery';
import { smoothScrollTo } from '../utils/dom.js';

export function initLandingUI() {
  // 1. Mobile Menu Toggle
  const $toggleBtn = $('#mobile-menu-toggle');
  const $drawer = $('#mobile-drawer');

  $toggleBtn.on('click', function (e) {
    e.preventDefault();
    const isOpen = $drawer.hasClass('is-open');
    if (isOpen) {
      $drawer.slideUp(200, function () {
        $drawer.removeClass('is-open');
      });
      $toggleBtn.attr('aria-expanded', 'false');
    } else {
      $drawer.hide().addClass('is-open').slideDown(220);
      $toggleBtn.attr('aria-expanded', 'true');
    }
  });

  // Close drawer on link click
  $('.mobile-nav-link').on('click', function () {
    $drawer.slideUp(180, function () {
      $drawer.removeClass('is-open');
      $toggleBtn.attr('aria-expanded', 'false');
    });
  });

  // 2. Sticky Header Elevation on Scroll
  $(window).on('scroll', function () {
    const scrollTop = $(this).scrollTop();
    if (scrollTop > 30) {
      $('.site-header').addClass('is-scrolled');
    } else {
      $('.site-header').removeClass('is-scrolled');
    }
  });

  // 3. Smooth Scroll to sections
  $('a[href^="#"]').on('click', function (e) {
    const target = $(this).attr('href');
    if (target && target.length > 1 && $(target).length) {
      e.preventDefault();
      smoothScrollTo(target);
    }
  });

  // 4. Scroll Reveal via IntersectionObserver or jQuery scroll
  initScrollReveal();
}

function initScrollReveal() {
  const $revealItems = $('.reveal-item');
  if (!$revealItems.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            $(entry.target).addClass('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    $revealItems.each(function () {
      observer.observe(this);
    });
  } else {
    // Fallback: jQuery scroll check
    function checkReveal() {
      const windowBottom = $(window).scrollTop() + $(window).height();
      $revealItems.each(function () {
        const $el = $(this);
        if (!$el.hasClass('is-revealed') && $el.offset().top < windowBottom - 40) {
          $el.addClass('is-revealed');
        }
      });
    }

    $(window).on('scroll', checkReveal);
    checkReveal();
  }
}
