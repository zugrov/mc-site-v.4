import fs from "node:fs";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  "http://127.0.0.1:4173/",
  "http://127.0.0.1:4173/uslugi.html",
  "http://127.0.0.1:4173/nds-2026.html",
  "http://127.0.0.1:4173/gajdy.html",
  "http://127.0.0.1:4173/guides/ausn-bez-mifov/",
  "http://127.0.0.1:4173/blog/",
  "http://127.0.0.1:4173/blog/vneshnij-finansovyj-direktor-vmesto-shtatnogo-cfo/",
];

const launchOptions = { args: ["--no-sandbox"] };
if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
  launchOptions.executablePath = process.env.CHROME_PATH;
}

const browser = await chromium.launch(launchOptions);
const context = await browser.newContext();
let failed = false;

for (const url of pages) {
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  const bad = results.violations.filter(
    (item) => item.impact === "serious" || item.impact === "critical",
  );
  if (bad.length) {
    failed = true;
    console.log(url);
    for (const item of bad) {
      console.log(`- ${item.impact} ${item.id}: ${item.help} (${item.nodes.length})`);
    }
  } else {
    console.log("OK", url);
  }
  await page.close();
}

await browser.close();
if (failed) process.exit(1);
