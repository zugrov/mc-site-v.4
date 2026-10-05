"""Каталог гайдов: content/guides/catalog.json."""
import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "content" / "guides" / "catalog.json"


def load_guides() -> list[dict[str, Any]]:
    if not CATALOG_PATH.is_file():
        return []
    data = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    guides = data.get("guides", [])
    if not isinstance(guides, list):
        return []
    return guides
