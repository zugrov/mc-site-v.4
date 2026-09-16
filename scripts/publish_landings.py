#!/usr/bin/env python3
"""Сборка production-лендингов из variant-pro и генераторов."""
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    scripts = [
        ROOT / "scripts" / "gen_diag_variant.py",
        ROOT / "scripts" / "gen_nds_variant.py",
    ]
    for script in scripts:
        print(f"→ {script.name}")
        subprocess.run([sys.executable, str(script)], check=True, cwd=ROOT)

    src = ROOT / "variant-pro.html"
    dest = ROOT / "index.html"
    shutil.copyfile(src, dest)
    print(f"OK {dest}")

    print("Готово: index.html, financial-diagnostics.html, nds-2026.html")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
