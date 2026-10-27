/**
 * Unified Single-Instance Wedding Audio Controller
 * - Plays Ramayana_mangal_rang when someone visits the website
 * - Ensures physically only ONE audio instance (window.__masterAudio) exists in the browser
 * - If browser autoplay policy requires user interaction, plays on the very first touch/tap anywhere
 * - When user clicks Pause, completely shuts off all music
 * - When user clicks Play, resumes the music
 */
(function() {
  'use strict';

  if (!window.__masterAudio) {
    window.__masterAudio = new Audio('assets/audio/music.mp3');
    window.__masterAudio.loop = true;
    window.__masterAudio.preload = 'auto';
  }
  var bgAudio = window.__masterAudio;

  var isPlaying = false;
  var hasStarted = false;
  var banner = null;

  var PLAY_PATH = 'M 5.379 1.292 C 4.968 1.033 4.449 1.017 4.023 1.251 C 3.598 1.486 3.334 1.933 3.333 2.419 L 3.333 13.581 C 3.334 14.067 3.598 14.514 4.023 14.749 C 4.449 14.983 4.968 14.967 5.379 14.708 L 14.215 9.127 C 14.602 8.883 14.836 8.457 14.836 8 C 14.836 7.543 14.602 7.117 14.215 6.873 Z';
  var PAUSE_PATHS = [
    'M 3 3 C 3 2.448 3.448 2 4 2 L 6 2 C 6.552 2 7 2.448 7 3 L 7 13 C 7 13.552 6.552 14 6 14 L 4 14 C 3.448 14 3 13.552 3 13 Z',
    'M 9 3 C 9 2.448 9.448 2 10 2 L 12 2 C 12.552 2 13 2.448 13 3 L 13 13 C 13 13.552 12.552 14 12 14 L 10 14 C 9.448 14 9 13.552 9 13 Z'
  ];

  function updateIcons(playing) {
    isPlaying = playing;
    var icons = document.querySelectorAll('.framer-audio-icon');
    icons.forEach(function(icon) {
      icon.setAttribute('aria-label', playing ? 'pause audio' : 'play audio');
      if (playing) {
        icon.innerHTML = '<path d="' + PAUSE_PATHS[0] + '" fill="#343434"></path><path d="' + PAUSE_PATHS[1] + '" fill="#343434"></path>';
      } else {
        icon.innerHTML = '<path d="' + PLAY_PATH + '" fill="#333"></path>';
      }
    });

    var buttons = document.querySelectorAll('.framer-mt57a8-container, [data-framer-name="Add your music file"]');
    buttons.forEach(function(btn) {
      if (playing) {
        btn.classList.add('audio-playing');
        btn.classList.remove('audio-paused');
      } else {
        btn.classList.remove('audio-playing');
        btn.classList.add('audio-paused');
      }
    });
  }

  function play() {
    if (window.__masterAudioUserPaused) return;

    // Silence and neutralize all other audio elements in the DOM
    silenceAllOtherAudios();

    var p = bgAudio.play();
    if (p !== undefined && typeof p.then === 'function') {
      p.then(function() {
        hasStarted = true;
        updateIcons(true);
        hideBanner();
        removeGestureListeners();
      }).catch(function() {
        showBanner();
      });
    }
  }

  function pause() {
    window.__masterAudioUserPaused = true;
    bgAudio.pause();
    silenceAllOtherAudios();
    updateIcons(false);
  }

  function toggle(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (bgAudio.paused) {
      window.__masterAudioUserPaused = false;
      play();
    } else {
      pause();
    }
  }

  function showBanner() {
    if (hasStarted || window.__masterAudioUserPaused || banner) return;
    banner = document.createElement('div');
    banner.id = 'wedding-music-banner';
    banner.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:999999;' +
      'display:flex;align-items:center;gap:10px;padding:12px 26px;border-radius:30px;' +
      'background:rgba(20,15,10,0.92);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);' +
      'border:1px solid rgba(248,104,0,0.8);color:#F3ECBA;' +
      'font-family:"Cormorant Upright",Georgia,serif;font-size:18px;letter-spacing:0.02em;' +
      'box-shadow:0 6px 25px rgba(0,0,0,0.5);cursor:pointer;user-select:none;' +
      'transition:opacity 0.35s ease, transform 0.35s ease;';
    banner.innerHTML = '<span style="font-size:22px;">🎵</span><span>Tap anywhere to play wedding music</span>';

    banner.addEventListener('click', function(e) {
      e.stopPropagation();
      window.__masterAudioUserPaused = false;
      play();
    });

    document.body.appendChild(banner);
  }

  function hideBanner() {
    if (banner) {
      banner.style.opacity = '0';
      banner.style.transform = 'translateX(-50%) translateY(12px)';
      setTimeout(function() {
        if (banner && banner.parentNode) {
          banner.parentNode.removeChild(banner);
        }
        banner = null;
      }, 350);
    }
  }

  function onFirstGesture(e) {
    if (!hasStarted && !window.__masterAudioUserPaused) {
      play();
    }
  }

  var GESTURES = ['click', 'touchend', 'touchstart', 'pointerup', 'pointerdown'];

  function addGestureListeners() {
    GESTURES.forEach(function(evt) {
      document.addEventListener(evt, onFirstGesture, { capture: true, passive: true });
      window.addEventListener(evt, onFirstGesture, { capture: true, passive: true });
      if (document.body) {
        document.body.addEventListener(evt, onFirstGesture, { capture: true, passive: true });
      }
    });
  }

  function removeGestureListeners() {
    GESTURES.forEach(function(evt) {
      document.removeEventListener(evt, onFirstGesture, { capture: true });
      window.removeEventListener(evt, onFirstGesture, { capture: true });
      if (document.body) {
        document.body.removeEventListener(evt, onFirstGesture, { capture: true });
      }
    });
  }

  function bindButtons() {
    var buttons = document.querySelectorAll('.framer-mt57a8-container, [data-framer-name="Add your music file"]');
    buttons.forEach(function(btn) {
      if (!btn.__musicBound) {
        btn.__musicBound = true;
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', toggle, { capture: true });
        btn.addEventListener('touchend', toggle, { capture: true });
      }
    });
  }

  bgAudio.addEventListener('play', function() { updateIcons(true); });
  bgAudio.addEventListener('pause', function() { updateIcons(false); });
  bgAudio.addEventListener('ended', function() { updateIcons(false); });

  function silenceAllOtherAudios() {
    document.querySelectorAll('audio').forEach(function(a) {
      if (a !== bgAudio) {
        a.pause();
        a.muted = true;
        a.removeAttribute('autoplay');
        if (a.src && a.src !== '') {
          a.src = '';
        }
      }
    });
  }

  function init() {
    silenceAllOtherAudios();
    bindButtons();
    addGestureListeners();
    play();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  window.addEventListener('load', init);

  var checkCount = 0;
  var interval = setInterval(function() {
    silenceAllOtherAudios();
    bindButtons();
    if (!bgAudio.paused) {
      updateIcons(true);
    }
    checkCount++;
    if (checkCount > 10) clearInterval(interval);
  }, 500);
})();
