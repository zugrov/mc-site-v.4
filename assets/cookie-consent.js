(function () {
  'use strict';

  // Пустая строка — код VK Pixel (Top.Mail.ru) не загружается.
  // Подставьте ID счётчика VK Рекламы, когда он будет известен.
  var VK_PIXEL_ID = '';
  var METRIKA_ID = 112291401;
  var STORAGE_KEY = 'mc_cookie_consent';
  var MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

  window.MC_VK_PIXEL_ID = VK_PIXEL_ID;
  window.MC_METRIKA_ID = METRIKA_ID;

  function readConsent() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'accepted' || stored === 'declined') {
        return stored;
      }
    } catch (error) {
      // localStorage может быть недоступен
    }

    var match = document.cookie.match(
      /(?:^|; )mc_cookie_consent=(accepted|declined)(?:;|$)/,
    );
    return match ? match[1] : '';
  }

  function writeConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
      // ignore
    }
    document.cookie = STORAGE_KEY + '=' + value
      + '; path=/; max-age=' + MAX_AGE_SECONDS + '; SameSite=Lax';
  }

  function loadMetrika() {
    if (window.__mcMetrikaLoaded) {
      return;
    }
    window.__mcMetrikaLoaded = true;

    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () {
        (m[i].a = m[i].a || []).push(arguments);
      };
      m[i].l = 1 * new Date();
      for (var j = 0; j < document.scripts.length; j += 1) {
        if (document.scripts[j].src === r) {
          return;
        }
      }
      k = e.createElement(t);
      a = e.getElementsByTagName(t)[0];
      k.async = 1;
      k.src = r;
      a.parentNode.insertBefore(k, a);
    }(
      window,
      document,
      'script',
      'https://mc.yandex.ru/metrika/tag.js?id=' + METRIKA_ID,
      'ym',
    ));

    window.ym(METRIKA_ID, 'init', {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: 'dataLayer',
      referrer: document.referrer,
      url: location.href,
      accurateTrackBounce: true,
      trackLinks: true,
    });
  }

  function loadVkPixel() {
    if (!VK_PIXEL_ID || window.__mcVkLoaded) {
      return;
    }
    window.__mcVkLoaded = true;

    var tmr = window._tmr || (window._tmr = []);
    tmr.push({
      id: VK_PIXEL_ID,
      type: 'pageView',
      start: (new Date()).getTime(),
    });

    (function (d, w, id) {
      if (d.getElementById(id)) {
        return;
      }
      var ts = d.createElement('script');
      ts.type = 'text/javascript';
      ts.async = true;
      ts.id = id;
      ts.src = 'https://top-fwz1.mail.ru/js/code.js';
      var insert = function () {
        var s = d.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ts, s);
      };
      if (w.opera == '[object Opera]') {
        d.addEventListener('DOMContentLoaded', insert, false);
      } else {
        insert();
      }
    }(document, window, 'tmr-code'));
  }

  function enableTrackers() {
    loadMetrika();
    loadVkPixel();
    document.dispatchEvent(new CustomEvent('mc:consent-accepted'));
  }

  function injectStyles() {
    if (document.getElementById('mc-cookie-consent-style')) {
      return;
    }
    var style = document.createElement('style');
    style.id = 'mc-cookie-consent-style';
    style.textContent = [
      '#mc-cookie-banner{position:fixed;z-index:80;left:0;right:0;bottom:0;',
      'max-height:25vh;overflow:auto;display:flex;flex-wrap:wrap;gap:12px;',
      'align-items:center;justify-content:space-between;',
      'padding:10px 16px;background:#111313;color:#eeeae1;',
      'border-top:1px solid #2a2c2b;font-family:inherit;font-size:13px;line-height:1.35}',
      '#mc-cookie-banner p{margin:0;flex:1 1 180px;max-width:28rem;font-size:13px}',
      '#mc-cookie-banner a{color:#5eead4;text-decoration:underline;',
      'text-underline-offset:2px}',
      '#mc-cookie-banner__actions{display:flex;flex-wrap:wrap;gap:8px}',
      '#mc-cookie-banner button{font:inherit;cursor:pointer;border-radius:4px;',
      'min-height:44px;min-width:44px;padding:0 16px;font-size:14px;font-weight:600}',
      '#mc-cookie-banner [data-consent="accepted"]{border:0;background:#0d9488;',
      'color:#0a0b0b}',
      '#mc-cookie-banner [data-consent="accepted"]:hover{background:#5eead4}',
      '#mc-cookie-banner [data-consent="declined"]{background:transparent;',
      'color:#eeeae1;border:1px solid #2a2c2b}',
      '#mc-cookie-banner :focus-visible{outline:2px solid #5eead4;outline-offset:3px}',
      '@media print{#mc-cookie-banner{display:none!important}}',
    ].join('');
    document.head.appendChild(style);
  }

  function showBanner() {
    if (document.getElementById('mc-cookie-banner')) {
      return;
    }
    injectStyles();
    var banner = document.createElement('div');
    banner.id = 'mc-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Согласие на аналитику и cookies');
    banner.innerHTML = ''
      + '<p>Яндекс Метрика и рекламные пиксели включаются только после '
      + 'согласия. Выбор запоминается на этом устройстве. '
      + '<a href="/privacy">Политика обработки персональных данных</a>.</p>'
      + '<div id="mc-cookie-banner__actions">'
      + '<button type="button" data-consent="accepted">Принять</button>'
      + '<button type="button" data-consent="declined">Отклонить</button>'
      + '</div>';

    banner.addEventListener('click', function (event) {
      var button = event.target.closest('[data-consent]');
      if (!button) {
        return;
      }
      var value = button.getAttribute('data-consent');
      writeConsent(value);
      banner.remove();
      if (value === 'accepted') {
        enableTrackers();
      }
    });

    document.body.appendChild(banner);
  }

  function boot() {
    var choice = readConsent();
    if (choice === 'accepted') {
      enableTrackers();
      return;
    }
    if (choice === 'declined') {
      return;
    }
    showBanner();
  }

  if (document.body) {
    boot();
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
}());
