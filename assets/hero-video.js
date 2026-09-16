(function () {
  'use strict';

  var video = document.getElementById('hero-bg');
  var hero = document.querySelector('.hero--preview');
  if (!video || !hero) {
    return;
  }

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function applyStaticFallback() {
    video.style.display = 'none';
    hero.classList.add('hero--preview-static');
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
