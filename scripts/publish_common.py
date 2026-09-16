"""Общие фрагменты для production-лендингов (Metrika, lead-form, thank-you CSS)."""

YANDEX_METRIKA = """
  <!-- Yandex.Metrika counter -->
  <script type="text/javascript">
    (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=112291401', 'ym');

    ym(112291401, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
  </script>
  <noscript><div><img src="https://mc.yandex.ru/watch/112291401" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
  <!-- /Yandex.Metrika counter -->
"""

LEAD_FORM_SCRIPT = '<script src="assets/lead-form.js?v=20260905"></script>'

LEAD_FORM_HIDDEN_FIELDS = """
              <div class="honeypot" aria-hidden="true">
                <label for="middle_name">Middle name</label>
                <input type="text" name="middle_name" id="middle_name" tabindex="-1" autocomplete="off" />
              </div>
              <input type="hidden" name="utm_source" />
              <input type="hidden" name="utm_medium" />
              <input type="hidden" name="utm_campaign" />
              <input type="hidden" name="utm_content" />
              <input type="hidden" name="utm_term" />
              <input type="hidden" name="utm_campaign_name" />
              <input type="hidden" name="yclid" />
              <input type="hidden" name="client_id" />
              <input type="hidden" name="landing_url" />
              <input type="hidden" name="referrer" />
              <input type="hidden" name="client_id_missing" />
"""

LEAD_THANKYOU_CSS = """
.form-global-error {
  margin-bottom: 16px;
  padding: 12px 14px;
  border-radius: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-size: 13px;
  line-height: 1.5;
}
.lead-thankyou__title { font-size: 22px; font-weight: 700; margin-bottom: 12px; }
.lead-thankyou__text { font-size: 15px; color: #5a635c; line-height: 1.6; margin-bottom: 10px; }
.lead-thankyou__id { font-size: 14px; margin-bottom: 16px; }
.lead-thankyou__list { margin: 0 0 20px 18px; font-size: 14px; color: #5a635c; line-height: 1.6; }
.lead-thankyou__list a { color: #0d9488; text-decoration: underline; }
.lead-step2 { margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(0,0,0,.12); }
.lead-step2__title { font-size: 16px; font-weight: 600; margin-bottom: 16px; }
.lead-step2__form .form-group { margin-bottom: 14px; }
.lead-step2__form label { display: block; font-size: 12px; margin-bottom: 6px; }
.lead-step2__form select { width: 100%; padding: 10px; border-radius: 6px; border: 1px solid rgba(0,0,0,.15); }
.lead-step2__submit { margin-top: 8px; }
.lead-step2__skip, .lead-step2__done { margin-top: 10px; font-size: 12px; color: #6b7280; text-align: center; }
.form-error { display: block; margin-top: 4px; font-size: 12px; color: #b91c1c; }
"""

