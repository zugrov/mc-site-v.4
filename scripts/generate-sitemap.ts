#!/usr/bin/env node
/** Запуск: из корня репо после `cd blog-app && npm run build` или `npx tsx blog-app/scripts/generate-sitemap.ts` из blog-app. */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const script = path.join(repoRoot, "blog-app", "scripts", "generate-sitemap.ts");
const r = spawnSync("npx", ["tsx", script], {
  cwd: path.join(repoRoot, "blog-app"),
  stdio: "inherit",
});
process.exit(r.status ?? 1);
