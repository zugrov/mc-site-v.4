#!/usr/bin/env python3
"""Сборка production-лендингов из variant-pro и генераторов."""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    blog_pkg = ROOT / "blog-app" / "package.json"
    if blog_pkg.is_file():
        print("→ blog-app build")
        subprocess.run(
            ["npm", "run", "build"],
            check=True,
            cwd=ROOT / "blog-app",
        )

    scripts = [
        ROOT / "scripts" / "gen_diag_variant.py",
        ROOT / "scripts" / "gen_nds_variant.py",
        ROOT / "scripts" / "gen_service_landings.py",
    ]
    for script in scripts:
        print(f"→ {script.name}")
        subprocess.run([sys.executable, str(script)], check=True, cwd=ROOT)

    # Главная больше не копируется из черновика variant-pro.html.
    # TODO(owner): черновики variant-*.html и preview-*.html не публиковать без решения. ТЗ 4.13.
    print("→ общая шапка и шрифты")
    subprocess.run([sys.executable, str(ROOT / "scripts" / "apply_redesign.py")], check=True, cwd=ROOT)

    print("Готово: лендинги услуг, гайды. index.html не перезаписывается.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
