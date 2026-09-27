"""Уникальные hero-визуалы для лендингов услуг."""
from __future__ import annotations

from typing import Optional

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


MODEL_HERO_VISUAL_CSS = (
    UCET_HERO_VISUAL_CSS
    + """
.uchet-dashboard-card--model { transform: rotate(-2deg); }
.model-scenario-chart { margin-top: 16px; }
.model-scenario-chart__top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 10px;
  color: #c0c8b7;
}
.model-scenario-chart svg { display: block; width: 100%; height: auto; }
.model-scenario-chart path {
  fill: none;
  stroke-linecap: round;
  stroke-width: 2.5;
}
.model-scenario-chart path.line--pess {
  stroke: #6f7a68;
  stroke-dasharray: 420;
  stroke-dashoffset: 420;
  animation: heroDrawLine 1.6s .1s ease forwards;
}
.model-scenario-chart path.line--base {
  stroke: #d7f36b;
  stroke-width: 3;
  filter: drop-shadow(0 0 6px rgba(215, 243, 107, .35));
  stroke-dasharray: 420;
  stroke-dashoffset: 420;
  animation: heroDrawLine 1.8s .25s ease forwards;
}
.model-scenario-chart path.line--opt {
  stroke: #e9ff86;
  stroke-dasharray: 420;
  stroke-dashoffset: 420;
  animation: heroDrawLine 2s .4s ease forwards;
}
.model-scenario-legend {
  display: flex;
  gap: 14px;
  margin-top: 10px;
  font-family: 'DM Mono', monospace;
  font-size: 8px;
  color: #8a9484;
  text-transform: uppercase;
}
.model-scenario-legend i {
  display: inline-block;
  width: 14px;
  height: 2px;
  margin-right: 5px;
  vertical-align: middle;
  border-radius: 2px;
}
.model-scenario-legend .leg--pess i { background: #6f7a68; }
.model-scenario-legend .leg--base i { background: #d7f36b; }
.model-scenario-legend .leg--opt i { background: #e9ff86; }
@keyframes heroDrawLine { to { stroke-dashoffset: 0; } }
@media (prefers-reduced-motion: reduce) {
  .model-scenario-chart path { animation: none !important; stroke-dashoffset: 0 !important; }
}
"""
)

TAX_HERO_VISUAL_CSS = (
    UCET_HERO_VISUAL_CSS
    + """
.uchet-dashboard-card--tax { transform: rotate(2deg); }
.tax-compare { margin-top: 18px; }
.tax-compare__row {
  display: grid;
  grid-template-columns: 64px 1fr 52px;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
  font-size: 10px;
  color: #9aa293;
}
.tax-compare__row i {
  display: block;
  height: 10px;
  border-radius: 999px;
  transform-origin: left;
  transform: scaleX(0);
  animation: heroDashBarGrowX .85s cubic-bezier(.23, 1, .32, 1) forwards;
}
.tax-compare__row--now i {
  width: 88%;
  background: rgba(238, 234, 225, .22);
  animation-delay: .1s;
}
.tax-compare__row--after i {
  width: 62%;
  background: linear-gradient(90deg, #d7f36b, rgba(215, 243, 107, .4));
  animation-delay: .28s;
}
.tax-savings {
  margin-top: 14px;
  padding: 12px;
  border: 1px solid rgba(215, 243, 107, .28);
  border-radius: 8px;
  background: rgba(215, 243, 107, .06);
}
.tax-savings span {
  font-family: 'DM Mono', monospace;
  font-size: 8px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: #8f9988;
}
.tax-savings strong {
  display: block;
  margin-top: 6px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 24px;
  color: #e9ff86;
  letter-spacing: -.05em;
}
@keyframes heroDashBarGrowX { from { transform: scaleX(0); } to { transform: scaleX(1); } }
"""
)

CFO_HERO_VISUAL_CSS = (
    UCET_HERO_VISUAL_CSS
    + """
.uchet-dashboard-card--cfo { transform: rotate(-1.5deg); }
.cfo-metric-list { margin-top: 16px; display: grid; gap: 8px; }
.cfo-metric-item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid rgba(215, 243, 107, .14);
  border-radius: 8px;
  font-size: 10px;
  color: #b0b8a8;
}
.cfo-metric-item strong { color: #ecf0e4; font-weight: 600; }
.cfo-metric-item.is-alert {
  border-color: rgba(215, 243, 107, .42);
  background: rgba(215, 243, 107, .08);
  animation: cfoPulse 2.4s ease-in-out infinite;
}
.cfo-metric-item em {
  font-style: normal;
  font-family: 'DM Mono', monospace;
  font-size: 8px;
  color: #d7f36b;
  text-transform: uppercase;
}
.cfo-spark {
  margin-top: 14px;
  height: 44px;
  display: flex;
  align-items: flex-end;
  gap: 5px;
}
.cfo-spark i {
  flex: 1;
  border-radius: 3px 3px 0 0;
  background: rgba(238, 234, 225, .14);
  transform-origin: bottom;
  animation: heroDashDdsGrow .7s ease forwards;
}
.cfo-spark i:nth-child(1) { height: 35%; animation-delay: .05s; }
.cfo-spark i:nth-child(2) { height: 55%; animation-delay: .1s; }
.cfo-spark i:nth-child(3) { height: 42%; animation-delay: .15s; }
.cfo-spark i:nth-child(4) { height: 70%; animation-delay: .2s; background: rgba(215, 243, 107, .45); }
.cfo-spark i:nth-child(5) { height: 58%; animation-delay: .25s; }
.cfo-spark i:nth-child(6) { height: 82%; animation-delay: .3s; background: #d7f36b; }
.cfo-horizon {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-family: 'DM Mono', monospace;
  font-size: 8px;
  color: #697363;
}
@keyframes cfoPulse { 0%, 100% { box-shadow: none; } 50% { box-shadow: 0 0 0 1px rgba(215, 243, 107, .25); } }
@keyframes heroDashDdsGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
"""
)

ADVISORY_HERO_VISUAL_CSS = (
    UCET_HERO_VISUAL_CSS
    + """
.uchet-dashboard-card--adv { transform: rotate(1.5deg); }
.adv-decisions { margin-top: 16px; display: grid; gap: 8px; }
.adv-decision {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 11px 12px;
  border: 1px solid rgba(215, 243, 107, .14);
  border-radius: 8px;
  font-size: 11px;
  color: #b5bdb0;
}
.adv-decision b { color: #ecf0e4; font-weight: 600; }
.adv-decision span.tag {
  font-family: 'DM Mono', monospace;
  font-size: 8px;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: #8f9988;
}
.adv-decision.is-active {
  border-color: rgba(215, 243, 107, .45);
  background: rgba(215, 243, 107, .07);
  box-shadow: 0 0 24px rgba(215, 243, 107, .08);
  animation: advPulse 2.8s ease-in-out infinite;
}
@keyframes advPulse {
  0%, 100% { border-color: rgba(215, 243, 107, .45); }
  50% { border-color: rgba(215, 243, 107, .18); }
}
@media (prefers-reduced-motion: reduce) {
  .adv-decision.is-active, .cfo-metric-item.is-alert { animation: none !important; }
}
"""
)

PRODUCT_HERO_VISUAL_CSS: dict[str, str] = {
    "uchet": UCET_HERO_VISUAL_CSS,
    "model": MODEL_HERO_VISUAL_CSS,
    "tax": TAX_HERO_VISUAL_CSS,
    "cfo": CFO_HERO_VISUAL_CSS,
    "adv": ADVISORY_HERO_VISUAL_CSS,
}


def _hero_shell(card_mod: str, inner: str, note_top: str, note_bottom: str) -> str:
    return f"""
          <div class="hero-visual reveal reveal--delay-2">
            <div class="visual-orbit visual-orbit--one"></div>
            <div class="visual-orbit visual-orbit--two"></div>
            <div class="dashboard-card uchet-dashboard-card uchet-dashboard-card--{card_mod}">
{inner}
            </div>
            {note_top}
            {note_bottom}
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


def model_hero_visual_html(icons: dict[str, str]) -> str:
    aur = icons["aur"]
    inner = f"""
              <div class="dashboard-card__header">
                <span class="card-kicker">FINMODEL / 36M</span>
                <span class="live-pill"><i></i> live</span>
              </div>
              <div class="dashboard-title">Три<br /><strong>сценария</strong></div>
              <div class="uchet-kpi-row">
                <div><span>NPV</span><strong>+18,4M ₽</strong></div>
                <div><span>IRR</span><strong>24,1%</strong></div>
              </div>
              <div class="model-scenario-chart" aria-hidden="true">
                <div class="model-scenario-chart__top"><span>Выручка · помесячно</span><span>24–36 мес</span></div>
                <svg viewBox="0 0 400 120" preserveAspectRatio="none">
                  <path class="line--pess" d="M0 92 C40 88 70 95 110 86 S170 78 210 82 S270 74 310 70 S350 68 400 64" />
                  <path class="line--base" d="M0 96 C45 90 80 82 125 74 S190 58 235 52 S295 40 340 34 S370 28 400 22" />
                  <path class="line--opt" d="M0 98 C50 88 95 72 145 58 S230 36 285 28 S330 20 370 14 L400 10" />
                </svg>
                <div class="model-scenario-legend">
                  <span class="leg--pess"><i></i>пессим.</span>
                  <span class="leg--base"><i></i>база</span>
                  <span class="leg--opt"><i></i>оптим.</span>
                </div>
              </div>
              <div class="dashboard-card__footer">
                <span><span class="legend-dot legend-dot--lime"></span> payback 14 мес</span>
                <span><span class="legend-dot legend-dot--white"></span> чувствительность</span>
                <span class="footer-arrow">{aur}</span>
              </div>
"""
    return _hero_shell(
        "model",
        inner,
        '<div class="floating-note floating-note--top"><span><b>3 сценария</b><small>пессим · база · оптим</small></span></div>',
        '<div class="floating-note floating-note--bottom"><span><b>go / no-go</b><small>вердикт по модели</small></span></div>',
    )


def tax_hero_visual_html(icons: dict[str, str]) -> str:
    aur = icons["aur"]
    inner = f"""
              <div class="dashboard-card__header">
                <span class="card-kicker">TAX / LEGAL</span>
                <span class="live-pill"><i></i> live</span>
              </div>
              <div class="dashboard-title">Налоговая<br /><strong>нагрузка</strong></div>
              <div class="tax-compare">
                <div class="tax-compare__row tax-compare__row--now"><span>Сейчас</span><i></i><b>100%</b></div>
                <div class="tax-compare__row tax-compare__row--after"><span>После</span><i></i><b>−18%</b></div>
              </div>
              <div class="tax-savings"><span>экономия в год · расчёт</span><strong>2 840 000 ₽</strong></div>
              <div class="uchet-report-strip">
                <span class="is-on">УСН</span><span class="is-on">НДС</span><span>ФИВ</span><span class="is-on">вычеты</span>
              </div>
              <div class="dashboard-card__footer">
                <span><span class="legend-dot legend-dot--lime"></span> белое поле</span>
                <span><span class="legend-dot legend-dot--white"></span> без серых схем</span>
                <span class="footer-arrow">{aur}</span>
              </div>
"""
    return _hero_shell(
        "tax",
        inner,
        '<div class="floating-note floating-note--top"><span><b>ст. 54.1 НК</b><small>деловая цель</small></span></div>',
        '<div class="floating-note floating-note--bottom"><span><b>по методам</b><small>экономия в ₽</small></span></div>',
    )


def cfo_hero_visual_html(icons: dict[str, str]) -> str:
    aur = icons["aur"]
    inner = f"""
              <div class="dashboard-card__header">
                <span class="card-kicker">CFO-LIGHT / MONTHLY</span>
                <span class="live-pill"><i></i> live</span>
              </div>
              <div class="dashboard-title">Дашборд<br /><strong>собственника</strong></div>
              <div class="cfo-metric-list">
                <div class="cfo-metric-item is-alert"><span>Касса · покрытие</span><strong>47 дней</strong><em>ниже нормы</em></div>
                <div class="cfo-metric-item"><span>Маржа · факт</span><strong>21,8%</strong></div>
                <div class="cfo-metric-item"><span>Дебиторка</span><strong>+6 дней</strong></div>
              </div>
              <div class="uchet-pl-block__title" style="margin-top:12px"><span>Cash flow</span><span>6 недель</span></div>
              <div class="cfo-spark" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
              <div class="cfo-horizon"><span>30 дн</span><span>60 дн</span><span>90 дн</span></div>
              <div class="dashboard-card__footer">
                <span><span class="legend-dot legend-dot--lime"></span> еженедельно</span>
                <span><span class="legend-dot legend-dot--white"></span> комментарии</span>
                <span class="footer-arrow">{aur}</span>
              </div>
"""
    return _hero_shell(
        "cfo",
        inner,
        '<div class="floating-note floating-note--top"><span><b>5–7 метрик</b><small>норма / отклонение</small></span></div>',
        '<div class="floating-note floating-note--bottom"><span><b>без штатного CFO</b><small>от 20 000 ₽/мес</small></span></div>',
    )


def advisory_hero_visual_html(icons: dict[str, str]) -> str:
    aur = icons["aur"]
    chk = icons["chk"]
    inner = f"""
              <div class="dashboard-card__header">
                <span class="card-kicker">ADVISORY / OWNER</span>
                <span class="live-pill"><i></i> live</span>
              </div>
              <div class="dashboard-title">Решения<br /><strong>собственника</strong></div>
              <div class="adv-decisions">
                <div class="adv-decision"><span class="tag">запрос</span><b>Кредит 45 млн ₽</b><span>↗</span></div>
                <div class="adv-decision is-active"><span class="tag">разбор</span><b>Новая линия · цена</b><span>↗</span></div>
                <div class="adv-decision"><span class="tag">ожидает</span><b>Найм фин. менеджера</b><span>↗</span></div>
              </div>
              <div class="uchet-kpi-row" style="margin-top:14px">
                <div><span>Ритм</span><strong>2–4 / мес</strong></div>
                <div><span>Формат</span><strong>sparring</strong></div>
              </div>
              <div class="dashboard-card__footer">
                <span><span class="legend-dot legend-dot--lime"></span> между встречами</span>
                <span><span class="legend-dot legend-dot--white"></span> на цифрах</span>
                <span class="footer-arrow">{aur}</span>
              </div>
"""
    return _hero_shell(
        "adv",
        inner,
        '<div class="floating-note floating-note--top"><span><b>второе мнение</b><small>до дорогого шага</small></span></div>',
        f'<div class="floating-note floating-note--bottom"><span class="mini-check">{chk}</span><span><b>собственник</b><small>фокус решений</small></span></div>',
    )


def product_hero_for(hero_id: Optional[str], icons: dict) -> tuple:
    handlers: dict[str, tuple[object, str]] = {
        "uchet": (uchet_hero_visual_html, PRODUCT_HERO_VISUAL_CSS["uchet"]),
        "model": (model_hero_visual_html, PRODUCT_HERO_VISUAL_CSS["model"]),
        "tax": (tax_hero_visual_html, PRODUCT_HERO_VISUAL_CSS["tax"]),
        "cfo": (cfo_hero_visual_html, PRODUCT_HERO_VISUAL_CSS["cfo"]),
        "adv": (advisory_hero_visual_html, PRODUCT_HERO_VISUAL_CSS["adv"]),
    }
    if not hero_id or hero_id not in handlers:
        return "", ""
    fn, css = handlers[hero_id]
    return fn(icons), css
