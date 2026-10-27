/**
 * Instagram Drawer / Cabinet Controller
 * Handles interactive 3D cabinet opening on scroll and Instagram profile navigation.
 */
(function() {
  var INSTA_URL = 'https://www.instagram.com/shivalaksh_diary?obrf=MXFkYjcxbTA0c2FkZQ==';

  function createCabinetHTML() {
    return [
      '<div class="framer-bfecvp" data-framer-name="Closet open">',
      '  <img src="assets/images/ezHuLUaEmZ3hLtrt1ytSN3PKsk.png" alt="Vintage camera collection" width="749" height="749" loading="lazy">',
      '</div>',
      '<div class="framer-jvi5bt" data-framer-name="Closet closed">',
      '  <div class="cabinet-door-left">',
      '    <img src="assets/images/i9mzQVB91YuRUv5dhawpHUCyqHk.png" alt="Cabinet closed left door" width="749" height="749" loading="lazy">',
      '  </div>',
      '  <div class="cabinet-door-right">',
      '    <img src="assets/images/i9mzQVB91YuRUv5dhawpHUCyqHk.png" alt="Cabinet closed right door" width="749" height="749" loading="lazy">',
      '  </div>',
      '</div>'
    ].join('\n');
  }

  function ensureCabinet() {
    // Update all Instagram links and shutter buttons
    var shutterLinks = document.querySelectorAll('.framer-b3ixcs-container a, [data-framer-name="Section 3"]');
    for (var i = 0; i < shutterLinks.length; i++) {
      var a = shutterLinks[i];
      if (a.getAttribute('href') !== INSTA_URL) {
        a.setAttribute('href', INSTA_URL);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    }

    var textWrappers = document.querySelectorAll('.framer-1tv2weq');
    for (var j = 0; j < textWrappers.length; j++) {
      var tw = textWrappers[j];
      if (!tw.dataset.linked) {
        tw.dataset.linked = 'true';
        tw.style.cursor = 'pointer';
        tw.addEventListener('click', function(e) {
          e.preventDefault();
          window.open(INSTA_URL, '_blank', 'noopener,noreferrer');
        });
      }
    }

    // Insert cabinet inside each .framer-ajbebj if not already present
    var ctaContainers = document.querySelectorAll('.framer-ajbebj');
    for (var k = 0; k < ctaContainers.length; k++) {
      var container = ctaContainers[k];
      var existing = container.querySelector('.insta-cabinet-wrapper');
      if (!existing) {
        var wrapper = document.createElement('a');
        wrapper.className = 'insta-cabinet-wrapper';
        wrapper.id = 'instaCabinet';
        wrapper.href = INSTA_URL;
        wrapper.target = '_blank';
        wrapper.rel = 'noopener noreferrer';
        wrapper.title = 'Click to open our Instagram page';
        wrapper.innerHTML = createCabinetHTML();

        var titleEl = container.querySelector('.framer-1lynk1q');
        var ctaEl = container.querySelector('.framer-1tv2weq');
        if (titleEl && ctaEl) {
          container.insertBefore(wrapper, ctaEl);
        } else if (titleEl && titleEl.nextSibling) {
          container.insertBefore(wrapper, titleEl.nextSibling);
        } else {
          container.appendChild(wrapper);
        }
      }
    }
  }

  var rafPending = false;
  function updateScroll() {
    rafPending = false;
    var cabinets = document.querySelectorAll('.insta-cabinet-wrapper');
    var vh = window.innerHeight || document.documentElement.clientHeight;

    for (var i = 0; i < cabinets.length; i++) {
      var cab = cabinets[i];
      var rect = cab.getBoundingClientRect();
      // When the center of cabinet reaches into the viewport (top < 82% vh and bottom > 80px)
      var center = rect.top + rect.height / 2;
      if (center < vh * 0.82 && rect.bottom > 80) {
        if (!cab.classList.contains('is-open')) {
          cab.classList.add('is-open');
        }
      } else if (rect.top > vh * 0.95 || rect.bottom < -50) {
        if (cab.classList.contains('is-open')) {
          cab.classList.remove('is-open');
        }
      }
    }
  }

  function requestTick() {
    if (!rafPending) {
      rafPending = true;
      window.requestAnimationFrame(updateScroll);
    }
  }

  // Event Listeners
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick, { passive: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      ensureCabinet();
      requestTick();
    });
  } else {
    ensureCabinet();
    requestTick();
  }

  window.addEventListener('load', function() {
    ensureCabinet();
    requestTick();
  });

  // Watch for React hydration DOM changes
  if (typeof MutationObserver !== 'undefined') {
    var observer = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.type === 'childList' && m.addedNodes.length > 0) {
          for (var j = 0; j < m.addedNodes.length; j++) {
            var node = m.addedNodes[j];
            if (node.nodeType === 1 && (node.classList.contains('framer-ajbebj') || node.querySelector && node.querySelector('.framer-ajbebj'))) {
              ensureCabinet();
              requestTick();
              return;
            }
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
