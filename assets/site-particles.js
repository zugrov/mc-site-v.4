(function () {
  'use strict';

  var container = document.getElementById('site-particles');
  if (!container || typeof particlesJS === 'undefined') {
    return;
  }

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.body.classList.add('site-particles-static');
    return;
  }

  var isMobile = window.matchMedia('(max-width: 768px)').matches;

  particlesJS.load('site-particles', 'assets/particles-config.json', function () {
    if (!isMobile || !window.pJSDom || !window.pJSDom[0]) {
      return;
    }

    var pJS = window.pJSDom[0].pJS;
    pJS.particles.number.value = 80;
    pJS.particles.move.speed = 3;
    pJS.interactivity.events.onhover.enable = false;
    pJS.fn.particlesRefresh();
  });
})();
