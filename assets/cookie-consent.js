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
      '#mc-cookie-banner{position:fixed;z-index:80;left:16px;right:16px;',
      'bottom:16px;max-width:460px;margin-right:auto;padding:18px 18px 16px;',
      'border-radius:14px;background:#111313;color:#eeeae1;',
      'border:1px solid rgba(238,234,225,.14);',
      'box-shadow:0 18px 50px rgba(0,0,0,.35);',
      'font-family:inherit;font-size:14px;line-height:1.5}',
      '#mc-cookie-banner p{margin:0}',
      '#mc-cookie-banner a{color:#ccfbf1;text-decoration:underline}',
      '#mc-cookie-banner__actions{display:flex;flex-wrap:wrap;gap:8px;',
      'margin-top:14px}',
      '#mc-cookie-banner button{font:inherit;cursor:pointer;border-radius:8px;',
      'min-height:40px;padding:0 14px;font-size:13px;font-weight:700}',
      '#mc-cookie-banner [data-consent="accepted"]{border:0;background:#0d9488;',
      'color:#fff}',
      '#mc-cookie-banner [data-consent="accepted"]:hover{background:#0f766e}',
      '#mc-cookie-banner [data-consent="declined"]{background:transparent;',
      'color:#eeeae1;border:1px solid rgba(238,234,225,.28)}',
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
