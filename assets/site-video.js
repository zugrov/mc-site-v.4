(function () {
  'use strict';

  var video = document.getElementById('site-bg');
  if (!video) {
    return;
  }

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function applyStaticFallback() {
    video.style.display = 'none';
    document.body.classList.add('site-video-static');
  }

  if (prefersReducedMotion) {
    applyStaticFallback();
    return;
  }

  video.addEventListener('error', applyStaticFallback);

  video.play().catch(function () {
    applyStaticFallback();
  });

  window.addEventListener('pagehide', function () {
    video.pause();
  });
})();
