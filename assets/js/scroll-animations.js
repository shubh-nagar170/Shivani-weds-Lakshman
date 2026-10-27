/**
 * Scroll-Driven Animation Controller
 * Synchronizes sky lanterns, vintage cars, and section CTAs strictly with window.scrollY
 * using requestAnimationFrame. Advances on scroll down and reverses smoothly on scroll up.
 */
(function () {
  'use strict';

  // Exact per-lantern speed and rotation parameters extracted from the reference Framer spec
  var LANTERN_SPECS = {
    '1ak0zde': { speed: 70, initRot: 20, animRot: 7, sway: 12 },
    '1hbfj74': { speed: 30, initRot: -20, animRot: -8, sway: -8 },
    'xuqq1b':  { speed: 30, initRot: 30, animRot: -7, sway: 10 },
    '1yyi2x3': { speed: 30, initRot: -20, animRot: -3, sway: -6 },
    'o9z8tt':  { speed: 50, initRot: 10, animRot: -7, sway: -10 },
    '50erps':  { speed: 40, initRot: -20, animRot: 7, sway: 9 },
    'kyhxib':  { speed: 60, initRot: 30, animRot: -7, sway: -14 },
    '1pc6wy9': { speed: 70, initRot: 30, animRot: 7, sway: 15 },
    '1tbuayd': { speed: 40, initRot: -18, animRot: -8, sway: -9 },
    'f6wktl':  { speed: 40, initRot: -17, animRot: 10, sway: 8 },
    '199qulj': { speed: 60, initRot: -20, animRot: -7, sway: -11 },
    '1e4tenx': { speed: 70, initRot: 12, animRot: 17, sway: 13 },
    '7d35t5':  { speed: 70, initRot: -10, animRot: -7, sway: -12 },
    'x378ko':  { speed: 50, initRot: 20, animRot: 7, sway: 10 },
    '1m18c8t': { speed: 60, initRot: -20, animRot: -7, sway: -11 },
    '20prp2':  { speed: 70, initRot: 12, animRot: 17, sway: 14 },
    '17u3nc6': { speed: 50, initRot: 20, animRot: 7, sway: -9 },
    '1whqstz': { speed: 50, initRot: 20, animRot: 7, sway: 12 },
    '1g5acad': { speed: 70, initRot: -10, animRot: -7, sway: -13 },
    '14j3nhh': { speed: 70, initRot: 30, animRot: 7, sway: 14 },
    'lwm8ju':  { speed: 40, initRot: -18, animRot: -8, sway: -8 },
    '1opgdr0': { speed: 40, initRot: -17, animRot: 10, sway: 7 },
    '1p469tn': { speed: 40, initRot: -17, animRot: 10, sway: -8 },
    '163pcbd': { speed: 40, initRot: -17, animRot: 3, sway: 9 },
    'qp1jrc':  { speed: 40, initRot: -17, animRot: -13, sway: -7 },
    '1vgospw': { speed: 55, initRot: 20, animRot: 7, sway: 16 },
    'feb0eg':  { speed: 60, initRot: -20, animRot: -7, sway: -11 },
    '114bgo8': { speed: 47, initRot: 12, animRot: 17, sway: 9 },
    '19ygfpp': { speed: 50, initRot: 20, animRot: 7, sway: -10 },
    'vrw1na':  { speed: 70, initRot: -10, animRot: -7, sway: 13 },
    '16sgcy9': { speed: 70, initRot: 30, animRot: 7, sway: -14 },
    '1wg7n3d': { speed: 40, initRot: -18, animRot: -8, sway: 8 },
    'q7rpcg':  { speed: 70, initRot: -17, animRot: -10, sway: -12 },
    'hth86r':  { speed: 40, initRot: -17, animRot: 10, sway: 7 },
    'z8ojs5':  { speed: 50, initRot: -17, animRot: 3, sway: -10 },
    'ghgrgo':  { speed: 45, initRot: -17, animRot: -13, sway: 11 },
    '1mr8vfd': { speed: 70, initRot: -20, animRot: -7, sway: -13 },
    '10zq97a': { speed: 50, initRot: 20, animRot: 7, sway: 10 },
    '1m2uah7': { speed: 40, initRot: 20, animRot: 7, sway: -9 },
    '154j5h':  { speed: 55, initRot: 12, animRot: 17, sway: 11 },
    '849tzw':  { speed: 58, initRot: -10, animRot: -7, sway: -11 },
    'jderb3':  { speed: 50, initRot: 30, animRot: 7, sway: 10 },
    '1fnwk9s': { speed: 40, initRot: -18, animRot: -8, sway: -8 },
    '2n9txg':  { speed: 55, initRot: -17, animRot: 10, sway: 11 },
    '1swi1w6': { speed: 40, initRot: -17, animRot: 10, sway: -7 },
    'f5e28u':  { speed: 65, initRot: -17, animRot: -10, sway: 13 },
    '1hqi0so': { speed: 40, initRot: -17, animRot: -13, sway: -8 },
    '7txx8':   { speed: 65, initRot: -20, animRot: -7, sway: 12 },
    '1o8sb77': { speed: 50, initRot: 20, animRot: 7, sway: -10 },
    'f0f2o3':  { speed: 60, initRot: 20, animRot: 7, sway: 11 },
    '1kaqcp6': { speed: 44, initRot: -10, animRot: -7, sway: -9 },
    '1t6k7te': { speed: 48, initRot: 12, animRot: 17, sway: 9 },
    '165s7h3': { speed: 50, initRot: 30, animRot: 7, sway: -10 },
    'so8iwg':  { speed: 40, initRot: -18, animRot: -8, sway: 8 },
    'cv0b5v':  { speed: 57, initRot: -17, animRot: -16, sway: -11 },
    'y8e1b6':  { speed: 40, initRot: -17, animRot: 10, sway: 8 },
    '1hv316e': { speed: 40, initRot: -17, animRot: 21, sway: -9 },
    '14dehe1': { speed: 65, initRot: -17, animRot: 6, sway: 12 }
  };

  function clamp(val, min, max) {
    return val < min ? min : val > max ? max : val;
  }

  var reducedMotionQuery = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };

  var rafPending = false;

  function getLanternSpec(el) {
    var appearId = el.getAttribute('data-framer-appear-id');
    if (appearId && LANTERN_SPECS[appearId]) {
      return LANTERN_SPECS[appearId];
    }
    var cls = el.className || '';
    var match = cls.match(/framer-([a-z0-9]+)/g);
    if (match) {
      for (var i = 0; i < match.length; i++) {
        var key = match[i].replace('framer-', '');
        if (LANTERN_SPECS[key]) {
          return LANTERN_SPECS[key];
        }
      }
    }
    return { speed: 50, initRot: 15, animRot: 5, sway: 10 };
  }

  function updateScrollAnimations() {
    rafPending = false;
    var scrollY = window.scrollY || window.pageYOffset || 0;
    var vh = window.innerHeight || 800;
    var vw = window.innerWidth || 1200;
    var isTablet = vw >= 810 && vw < 1200;
    var isMobile = vw < 810;
    var isReduced = Boolean(reducedMotionQuery && reducedMotionQuery.matches);

    // 1. Update all Sky Lanterns in Section 1
    var lanterns = document.querySelectorAll('.framer-A4SHU [data-framer-name="Lantern"]');
    var rotProgress = clamp(scrollY / 1600, 0, 1);

    for (var i = 0; i < lanterns.length; i++) {
      var lantern = lanterns[i];
      var spec = getLanternSpec(lantern);

      if (isReduced) {
        lantern.style.setProperty('--lantern-x', '0px');
        lantern.style.setProperty('--lantern-y', '0px');
        lantern.style.setProperty('--lantern-rot', spec.animRot + 'deg');
        continue;
      }

      // Vertical upward travel synchronized with scrollY and individual parallax speed
      var dy = -scrollY * (spec.speed / 100) * 0.68;
      // Subtle horizontal drift along the lantern's rising trajectory (0 at scrollY = 0)
      var dx = Math.sin((scrollY / 550) + (i * 0.7)) * spec.sway * clamp(scrollY / 250, 0, 1);
      // Smooth rotation progression tied to scroll
      var rot = spec.animRot + (spec.initRot - spec.animRot) * rotProgress;

      lantern.style.setProperty('--lantern-x', dx.toFixed(2) + 'px');
      lantern.style.setProperty('--lantern-y', dy.toFixed(2) + 'px');
      lantern.style.setProperty('--lantern-rot', rot.toFixed(2) + 'deg');
    }

    // 2. Update the 3 Decorative Vintage Cars across Section Transitions
    var carConfigs = [
      {
        carSelector: '.framer-A4SHU .framer-1okdoe3',
        breakerSelector: '.framer-A4SHU .framer-u4cwez',
        tabletNoCenterTranslate: true,
        startY: isMobile ? 110 : isTablet ? 140 : 180,
        endY: isMobile ? -65 : isTablet ? -85 : -110,
        startScale: 0.90,
        endScale: 1.05
      },
      {
        carSelector: '.framer-A4SHU .framer-xecmds',
        breakerSelector: '.framer-A4SHU .framer-ayrbel',
        tabletNoCenterTranslate: false,
        startY: isMobile ? 120 : isTablet ? 155 : 195,
        endY: isMobile ? -70 : isTablet ? -90 : -115,
        startScale: 0.90,
        endScale: 1.05
      },
      {
        carSelector: '.framer-A4SHU .framer-1h9vu7t',
        breakerSelector: '.framer-A4SHU .framer-10gdk3b',
        tabletNoCenterTranslate: false,
        startY: isMobile ? 105 : isTablet ? 135 : 170,
        endY: isMobile ? -60 : isTablet ? -80 : -100,
        startScale: 0.91,
        endScale: 1.04
      }
    ];

    for (var c = 0; c < carConfigs.length; c++) {
      var cfg = carConfigs[c];
      var cars = document.querySelectorAll(cfg.carSelector);
      for (var j = 0; j < cars.length; j++) {
        var carEl = cars[j];
        var breakerEl = carEl.closest(cfg.breakerSelector) || carEl.parentElement;
        var xBase = (isTablet && cfg.tabletNoCenterTranslate) ? '0px' : '-50%';

        if (isReduced || !breakerEl) {
          carEl.style.setProperty('--car-x', xBase);
          carEl.style.setProperty('--car-y', '0px');
          carEl.style.setProperty('--car-scale', '1');
          continue;
        }

        var rect = breakerEl.getBoundingClientRect();
        // Progress p goes from 0 (when breaker enters below viewport) to 1 (when breaker scrolls up past upper viewport)
        var p = clamp((vh * 1.25 - rect.top) / (vh * 1.45), 0, 1);
        var carY = cfg.startY + (cfg.endY - cfg.startY) * p;
        var carScale = cfg.startScale + (cfg.endScale - cfg.startScale) * p;

        carEl.style.setProperty('--car-x', xBase);
        carEl.style.setProperty('--car-y', carY.toFixed(2) + 'px');
        carEl.style.setProperty('--car-scale', carScale.toFixed(4));
      }
    }

    // 3. Update Sticky Section CTAs ("SEE THE ROUTE", "PLEASE RSVP", "FOLLOW THE ACTION")
    var ctaConfigs = [
      { selector: '.framer-A4SHU .framer-1j9tghe', maxShift: isMobile ? 240 : 90 },
      { selector: '.framer-A4SHU .framer-rsjser',  maxShift: 0 },
      { selector: '.framer-A4SHU .framer-1da0w34', maxShift: isMobile ? 260 : 180 }
    ];

    for (var k = 0; k < ctaConfigs.length; k++) {
      var ctaCfg = ctaConfigs[k];
      var ctaEls = document.querySelectorAll(ctaCfg.selector);
      for (var m = 0; m < ctaEls.length; m++) {
        var ctaEl = ctaEls[m];
        if (isReduced) {
          ctaEl.style.setProperty('--cta-y', '0px');
          continue;
        }
        var ctaRect = ctaEl.getBoundingClientRect();
        var ctaP = clamp((vh * 0.75 - ctaRect.top) / (vh * 0.85), 0, 1);
        var ctaY = ctaP * ctaCfg.maxShift;
        ctaEl.style.setProperty('--cta-y', ctaY.toFixed(2) + 'px');
      }
    }
  }

  function requestTick() {
    if (!rafPending) {
      rafPending = true;
      window.requestAnimationFrame(updateScrollAnimations);
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick, { passive: true });
  window.addEventListener('DOMContentLoaded', updateScrollAnimations);
  window.addEventListener('load', updateScrollAnimations);

  // Observe DOM mutations during React hydration / breakpoint variant swaps so styles stay in sync immediately
  if (typeof MutationObserver !== 'undefined') {
    var observer = new MutationObserver(function () {
      requestTick();
    });
    if (document.documentElement) {
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  updateScrollAnimations();
})();
