/**
 * RSVP Envelope Controller
 * Provides interactive envelope scroll-animation where the paper card appears completely
 * when scrolled into view so the visitor can read it, and then slides into the envelope
 * pocket as they scroll more down. Links directly to WhatsApp.
 */
(function () {
  var WA_URL = "https://wa.me/916387100684?text=Hello!%20I%20saw%20Shivani's%20wedding%20card.";

  function createEnvelopeHTML() {
    return [
      '<!-- Layer 1: Envelope Inner (Back & Flap) -->',
      '<div class="rsvp-envelope-inner">',
      '  <img src="assets/images/mMubCJzGVyMYNAhiO2JLkyiGgw.png" alt="Envelope Interior" loading="lazy">',
      '</div>',
      '<!-- Layer 2: Sliding Paper Card -->',
      '<a class="rsvp-paper-card" id="rsvpPaperCard" href="' + WA_URL + '" target="_blank" rel="noopener noreferrer" title="Click to RSVP on WhatsApp">',
      '  <img src="assets/images/0fSxrRtMEUfItl1Bb3JHmmb8E.png" alt="RSVP Card" class="rsvp-paper-bg" loading="lazy">',
      '  <div class="rsvp-paper-content">',
      '    <div class="rsvp-paper-heading">PLEASE<br>RSVP</div>',
      '    <div class="rsvp-paper-sub">Click below to message us</div>',
      '    <div class="rsvp-ornament">',
      '      <svg viewBox="0 0 48 48" class="rsvp-seal-svg">',
      '        <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2"></circle>',
      '        <path fill="currentColor" d="M24 10c1.2 3.6 4.4 6.8 8 8-3.6 1.2-6.8 4.4-8 8-1.2-3.6-4.4-6.8-8-8 3.6-1.2 6.8-4.4 8-8z"></path>',
      '      </svg>',
      '    </div>',
      '    <div class="rsvp-whatsapp-badge">',
      '      <svg viewBox="0 0 24 24" class="rsvp-wa-icon"><path fill="currentColor" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.92-9.91-9.92zm.01 17.58c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.82-1.31-1.26-2.83-1.26-4.38 0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.54-3.7 8.24-8.24 8.24zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.07-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.17 1.74 2.65 4.21 3.72.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.23-.18-.48-.3z"/></svg>',
      '      <span>Message on WhatsApp</span>',
      '    </div>',
      '  </div>',
      '</a>',
      '<!-- Layer 3: Envelope Upper (Front Pocket & Flap) -->',
      '<a class="rsvp-envelope-upper" href="' + WA_URL + '" target="_blank" rel="noopener noreferrer" title="Click to RSVP on WhatsApp">',
      '  <img src="assets/images/XwSCDVqVhhtF52j1Mhe9pVs31M.png" alt="Envelope Front" loading="lazy">',
      '</a>'
    ].join('\n');
  }

  function ensureEnvelope() {
    var rsvpSection = document.getElementById('rsvp') || document.querySelector('.framer-rsjser');
    if (!rsvpSection) return;

    // Update any fallback WhatsApp links in the section
    var links = rsvpSection.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      if (href && (href.indexOf('wa.me') !== -1 || href.indexOf('XXXXXXXXXX') !== -1)) {
        links[i].setAttribute('href', WA_URL);
        links[i].setAttribute('target', '_blank');
        links[i].setAttribute('rel', 'noopener noreferrer');
      }
    }

    var existing = rsvpSection.querySelector('#rsvpEnvelope');
    if (!existing) {
      var wrapper = document.createElement('div');
      wrapper.className = 'rsvp-envelope-wrapper';
      wrapper.id = 'rsvpEnvelope';
      wrapper.innerHTML = createEnvelopeHTML();
      wrapper.addEventListener('click', function(e) {
        if (!e.target.closest('a')) {
          var card = this.querySelector('#rsvpPaperCard');
          if (card) {
            card.click();
          }
        }
      });

      var stack = rsvpSection.querySelector('.framer-12faent');
      if (stack) {
        stack.appendChild(wrapper);
      } else {
        rsvpSection.appendChild(wrapper);
      }
    } else if (!existing.dataset.bound) {
      existing.dataset.bound = 'true';
      existing.addEventListener('click', function(e) {
        if (!e.target.closest('a')) {
          var card = this.querySelector('#rsvpPaperCard');
          if (card) {
            card.click();
          }
        }
      });
    }
  }

  var rafPending = false;
  function updateScroll() {
    rafPending = false;
    var env = document.getElementById('rsvpEnvelope') || document.querySelector('.rsvp-envelope-wrapper');
    if (!env) return;

    var paperCard = env.querySelector('.rsvp-paper-card');
    if (!paperCard) return;

    var vh = window.innerHeight || document.documentElement.clientHeight;
    var rect = env.getBoundingClientRect();
    var isMobile = (window.innerWidth || document.documentElement.clientWidth) <= 809.98;

    // Phase 1: When user scrolls into RSVP section (rect.top between vh * 0.95 and vh * 0.55):
    // Card is elevated completely OUT of the envelope so visitor can clearly read all text and WhatsApp button!
    // Phase 2: As user scrolls more down (rect.top moves from vh * 0.55 down to vh * 0.15):
    // Card smoothly enters into the envelope pocket behind the front flap!
    // Phase 3: When rect.top <= vh * 0.15:
    // Card is inside the envelope and cleanly stopped so it never extends past the envelope bottom!

    var triggerStart = vh * 0.55;
    var triggerEnd = vh * 0.15;
    var p = 0;

    if (rect.top <= triggerStart) {
      p = (triggerStart - rect.top) / (triggerStart - triggerEnd);
      p = Math.min(Math.max(p, 0), 1);
    }

    var startY = isMobile ? -175 : -215; // Fully elevated and visible
    var endY = isMobile ? -10 : -15;    // Tucked inside envelope, cleanly above bottom
    var currentY = startY + (endY - startY) * p;

    paperCard.style.setProperty('--envelope-card-y', currentY.toFixed(1) + 'px');
  }

  function requestTick() {
    if (!rafPending) {
      rafPending = true;
      window.requestAnimationFrame(updateScroll);
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick, { passive: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      ensureEnvelope();
      requestTick();
    });
  } else {
    ensureEnvelope();
    requestTick();
  }

  window.addEventListener('load', function () {
    ensureEnvelope();
    requestTick();
  });

  if (typeof MutationObserver !== 'undefined') {
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.type === 'childList' && m.addedNodes.length > 0) {
          for (var j = 0; j < m.addedNodes.length; j++) {
            var node = m.addedNodes[j];
            if (node.nodeType === 1 && (node.id === 'rsvp' || (node.classList && node.classList.contains('framer-rsjser')) || (node.querySelector && node.querySelector('#rsvp')))) {
              ensureEnvelope();
              requestTick();
              return;
            }
          }
        }
      }
    });
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }
})();
