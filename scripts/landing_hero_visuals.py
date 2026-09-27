"""Уникальные hero-визуалы для лендингов услуг."""

HUB_MAP_VISUAL_CSS = """
.hub-map-visual {
  position: relative;
  min-height: 420px;
  display: grid;
  place-items: center;
}
.hub-map-visual__bg {
  position: absolute;
  inset: 8% 0 0 4%;
  background-image: linear-gradient(rgba(13, 148, 136, .07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(13, 148, 136, .07) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(ellipse at 55% 45%, #000 25%, transparent 72%);
  opacity: .85;
}
.hub-map-panel {
  position: relative;
  z-index: 1;
  width: min(100%, 460px);
  padding: 22px 22px 18px;
  border: 1px solid rgba(13, 148, 136, .35);
  border-radius: 14px;
  background: linear-gradient(145deg, rgba(17, 22, 21, .96), rgba(10, 11, 11, .98));
  box-shadow: 0 32px 70px rgba(0, 0, 0, .4), 0 0 48px rgba(13, 148, 136, .08);
  transform: rotate(-2.5deg);
  transition: transform .45s cubic-bezier(.23, 1, .32, 1);
}
.hub-map-panel:hover { transform: rotate(0deg) translateY(-6px); }
.hub-map-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: #7a8a84;
}
.hub-map-live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--accent-light);
}
.hub-map-live i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 4px rgba(13, 148, 136, .22);
  animation: hubMapPulse 2.2s ease-in-out infinite;
}
.hub-map-tiers { display: grid; gap: 10px; }
.hub-map-tier {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 12px;
  align-items: center;
  padding: 11px 12px;
  border: 1px solid rgba(238, 234, 225, .1);
  border-radius: 10px;
  background: rgba(255, 255, 255, .02);
}
.hub-map-tier__label {
  font-family: 'DM Mono', monospace;
  font-size: 8px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--accent-light);
}
.hub-map-tier ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 10px;
  font-size: 11px;
  color: #c5c9c2;
}
.hub-map-tier--base { border-color: rgba(13, 148, 136, .28); }
.hub-map-tier--project { border-color: rgba(204, 251, 241, .18); }
.hub-map-tier--sub { border-color: rgba(13, 148, 136, .4); background: rgba(13, 148, 136, .06); }
.hub-map-flow {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid rgba(238, 234, 225, .1);
}
.hub-map-flow svg { display: block; width: 100%; height: 36px; }
.hub-map-flow path {
  fill: none;
  stroke: var(--accent);
  stroke-width: 2;
  stroke-dasharray: 6 8;
  animation: hubMapFlow 12s linear infinite;
}
.hub-map-flow circle {
  fill: var(--accent-light);
  animation: hubMapDot 3.5s ease-in-out infinite;
}
.hub-map-chip {
  position: absolute;
  z-index: 2;
  padding: 10px 12px;
  border: 1px solid rgba(13, 148, 136, .35);
  border-radius: 8px;
  background: rgba(12, 14, 14, .88);
  backdrop-filter: blur(10px);
  font-size: 10px;
  color: #b8c4be;
  box-shadow: 0 16px 40px rgba(0, 0, 0, .28);
}
.hub-map-chip b { display: block; color: var(--accent-light); font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 500; }
.hub-map-chip--top { top: 18px; right: 0; transform: rotate(4deg); }
.hub-map-chip--bottom { bottom: 28px; left: 0; transform: rotate(-3deg); }
@keyframes hubMapPulse { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }
@keyframes hubMapFlow { to { stroke-dashoffset: -120; } }
@keyframes hubMapDot { 0%, 100% { opacity: .35; } 50% { opacity: 1; } }
@media (max-width: 900px) {
  .hub-map-visual { min-height: 360px; margin-top: 12px; }
  .hub-map-chip--top { right: -4px; }
  .hub-map-chip--bottom { left: -4px; }
}
@media (prefers-reduced-motion: reduce) {
  .hub-map-live i, .hub-map-flow path, .hub-map-flow circle { animation: none !important; }
}
"""

UCET_HERO_VISUAL_CSS = """
.uchet-dashboard-card { transform: rotate(2.5deg); }
.uchet-dashboard-card:hover { transform: rotate(0deg) translateY(-6px); }
.uchet-kpi-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 18px;
}
.uchet-kpi-row > div {
  padding: 12px 12px 10px;
  border: 1px solid rgba(215, 243, 107, .16);
  border-radius: 8px;
  background: rgba(0, 0, 0, .18);
}
.uchet-kpi-row span {
  display: block;
  font-family: 'DM Mono', monospace;
  font-size: 8px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: #8f9988;
}
.uchet-kpi-row strong {
  display: block;
  margin-top: 8px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -.05em;
  color: #e9ff86;
}
.uchet-pl-block { margin-top: 18px; }
.uchet-pl-block__title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 10px;
  color: #c0c8b7;
}
.uchet-pl-row {
  display: grid;
  grid-template-columns: 52px 1fr 36px;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
  font-size: 10px;
  color: #9aa293;
}
.uchet-pl-row i {
  display: block;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(215, 243, 107, .85), rgba(215, 243, 107, .35));
  transform-origin: left;
  transform: scaleX(0);
  animation: uchetBarGrow .9s cubic-bezier(.23, 1, .32, 1) forwards;
}
.uchet-pl-row:nth-child(2) i { animation-delay: .12s; width: 72%; }
.uchet-pl-row:nth-child(3) i { animation-delay: .22s; width: 58%; }
.uchet-pl-row:nth-child(4) i { animation-delay: .32s; width: 84%; }
.uchet-pl-row b { text-align: right; color: #d7f36b; font-weight: 600; }
.uchet-report-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid rgba(232, 247, 204, .14);
}
.uchet-report-strip span {
  padding: 6px 10px;
  border: 1px solid rgba(215, 243, 107, .22);
  border-radius: 999px;
  font-family: 'DM Mono', monospace;
  font-size: 8px;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: #c8d4bc;
}
.uchet-report-strip span.is-on {
  background: rgba(215, 243, 107, .12);
  border-color: rgba(215, 243, 107, .45);
  color: #e9ff86;
}
.uchet-dds-mini {
  margin-top: 14px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 6px;
  height: 52px;
  padding: 0 4px;
}
.uchet-dds-mini i {
  display: block;
  flex: 1;
  max-width: 28px;
  border-radius: 4px 4px 0 0;
  background: rgba(238, 234, 225, .12);
  transform-origin: bottom;
  animation: uchetDdsGrow .75s cubic-bezier(.23, 1, .32, 1) forwards;
}
.uchet-dds-mini i:nth-child(1) { height: 38%; animation-delay: .05s; }
.uchet-dds-mini i:nth-child(2) { height: 62%; animation-delay: .1s; background: rgba(215, 243, 107, .35); }
.uchet-dds-mini i:nth-child(3) { height: 48%; animation-delay: .15s; }
.uchet-dds-mini i:nth-child(4) { height: 78%; animation-delay: .2s; background: rgba(215, 243, 107, .55); }
.uchet-dds-mini i:nth-child(5) { height: 55%; animation-delay: .25s; }
.uchet-dds-mini i:nth-child(6) { height: 88%; animation-delay: .3s; background: #d7f36b; box-shadow: 0 0 20px rgba(215, 243, 107, .25); }
.uchet-pl-row i { animation-name: uchetBarGrowX; }
@keyframes uchetBarGrowX { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes uchetDdsGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@media (prefers-reduced-motion: reduce) {
  .uchet-pl-row i, .uchet-dds-mini i { animation: none !important; transform: none !important; }
}
"""


def hub_services_visual_html() -> str:
    return """
        <div class="hub-map-visual reveal reveal--delay-1" aria-hidden="true">
          <div class="hub-map-visual__bg"></div>
          <div class="hub-map-chip hub-map-chip--top"><b>от 15 000 ₽</b>точка входа</div>
          <div class="hub-map-panel">
            <div class="hub-map-panel__head"><span>services map</span><span class="hub-map-live"><i></i> live</span></div>
            <div class="hub-map-tiers">
              <div class="hub-map-tier hub-map-tier--base">
                <span class="hub-map-tier__label">Базовый</span>
                <ul><li>НДС-аудит</li><li>Диагностика</li></ul>
              </div>
              <div class="hub-map-tier hub-map-tier--project">
                <span class="hub-map-tier__label">Проект</span>
                <ul><li>Упр. учёт</li><li>Финмодель</li><li>Налоги</li></ul>
              </div>
              <div class="hub-map-tier hub-map-tier--sub">
                <span class="hub-map-tier__label">Подписка</span>
                <ul><li>CFO-light</li><li>Advisory</li></ul>
              </div>
            </div>
            <div class="hub-map-flow" aria-hidden="true">
              <svg viewBox="0 0 400 36" preserveAspectRatio="none">
                <path d="M8 18 H392" />
                <circle cx="72" cy="18" r="4" />
                <circle cx="200" cy="18" r="4" style="animation-delay:.6s" />
                <circle cx="328" cy="18" r="4" style="animation-delay:1.2s" />
              </svg>
            </div>
          </div>
          <div class="hub-map-chip hub-map-chip--bottom"><b>CFO-light</b>регулярные решения</div>
        </div>
"""


def uchet_hero_visual_html(icons: dict[str, str]) -> str:
    aur = icons["aur"]
    chk = icons["chk"]
    return f"""
          <div class="hero-visual reveal reveal--delay-2">
            <div class="visual-orbit visual-orbit--one"></div>
            <div class="visual-orbit visual-orbit--two"></div>
            <div class="dashboard-card uchet-dashboard-card">
              <div class="dashboard-card__header">
                <span class="card-kicker">MANAGEMENT / KPI</span>
                <span class="live-pill"><i></i> live</span>
              </div>
              <div class="dashboard-title">Управленческая<br /><strong>отчётность</strong></div>
              <div class="uchet-kpi-row">
                <div><span>Маржа по P&L</span><strong>24,3%</strong></div>
                <div><span>Закрытие месяца</span><strong>24 ч</strong></div>
              </div>
              <div class="uchet-pl-block">
                <div class="uchet-pl-block__title"><span>P&L по направлениям</span><span>факт · окт</span></div>
                <div class="uchet-pl-row"><span>Опт</span><i style="width:72%"></i><b>+12%</b></div>
                <div class="uchet-pl-row"><span>Розница</span><i style="width:58%"></i><b>+6%</b></div>
                <div class="uchet-pl-row"><span>Онлайн</span><i style="width:84%"></i><b>+19%</b></div>
              </div>
              <div class="uchet-pl-block__title" style="margin-top:4px"><span>ДДС · 13 недель</span><span>прогноз</span></div>
              <div class="uchet-dds-mini" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
              <div class="uchet-report-strip">
                <span class="is-on">P&L</span><span class="is-on">ДДС</span><span>Баланс</span><span class="is-on">KPI</span>
              </div>
              <div class="dashboard-card__footer">
                <span><span class="legend-dot legend-dot--lime"></span> маржа</span>
                <span><span class="legend-dot legend-dot--white"></span> движение денег</span>
                <span class="footer-arrow">{aur}</span>
              </div>
            </div>
            <div class="floating-note floating-note--top"><span><b>4 ЦФО</b><small>центры ответственности</small></span></div>
            <div class="floating-note floating-note--bottom"><span class="mini-check">{chk}</span><span><b>5–7 KPI</b><small>на дашборде собственника</small></span></div>
          </div>
"""
