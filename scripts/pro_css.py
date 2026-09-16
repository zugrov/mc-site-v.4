"""Загрузка CSS из pro-проектов для статических preview."""
from pathlib import Path


def strip_at_layers(css: str) -> str:
    while "@layer" in css:
        start = css.find("@layer")
        brace = css.find("{", start)
        if brace < 0:
            break
        depth = 0
        end = brace
        for i in range(brace, len(css)):
            if css[i] == "{":
                depth += 1
            elif css[i] == "}":
                depth -= 1
                if depth == 0:
                    end = i + 1
                    break
        css = css[:start] + css[end:]
    return css


def load_diag_css(css_path: Path, extra: str = "") -> str:
    text = css_path.read_text(encoding="utf-8")
    root_start = text.find(":root {")
    site_start = text.find(".site-shell {")
    if root_start < 0 or site_start < 0:
        raise SystemExit(f"CSS :root or .site-shell not found in {css_path}")
    head = strip_at_layers(text[root_start:site_start])
    return head + text[site_start:] + extra


def load_nds_css(css_path: Path, extra: str = "") -> str:
    text = css_path.read_text(encoding="utf-8")
    root_start = text.find(":root {")
    if root_start < 0:
        raise SystemExit(f"CSS :root not found in {css_path}")
    return text[root_start:] + extra
