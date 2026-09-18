import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const contentDir = path.join(repoRoot, "content", "blog");

type UrlEntry = { loc: string; lastmod: string; priority: string; changefreq: string };

const staticPages: UrlEntry[] = [
  { loc: "https://maxima-consulting.ru/", lastmod: "2026-09-16", changefreq: "monthly", priority: "1.0" },
  {
    loc: "https://maxima-consulting.ru/financial-diagnostics",
    lastmod: "2026-09-16",
    changefreq: "monthly",
    priority: "0.9",
  },
  {
    loc: "https://maxima-consulting.ru/nds-2026",
    lastmod: "2026-09-16",
    changefreq: "monthly",
    priority: "0.9",
  },
  {
    loc: "https://maxima-consulting.ru/blog/",
    lastmod: "2026-09-16",
    changefreq: "weekly",
    priority: "0.85",
  },
  {
    loc: "https://maxima-consulting.ru/nda.html",
    lastmod: "2026-07-05",
    changefreq: "yearly",
    priority: "0.2",
  },
  {
    loc: "https://maxima-consulting.ru/privacy.html",
    lastmod: "2026-07-05",
    changefreq: "yearly",
    priority: "0.2",
  },
];

function blogUrls(): UrlEntry[] {
  if (!fs.existsSync(contentDir)) return [];
  const urls: UrlEntry[] = [];
  for (const file of fs.readdirSync(contentDir)) {
    if (!file.endsWith(".mdx") && !file.endsWith(".md")) continue;
    const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
    const { data } = matter(raw);
    if (data.draft) continue;
    if (!data.slug || !data.updatedAt) continue;
    urls.push({
      loc: `https://maxima-consulting.ru/blog/${data.slug}/`,
      lastmod: data.updatedAt,
      changefreq: "monthly",
      priority: "0.7",
    });
  }
  return urls;
}

function toXml(entries: UrlEntry[]) {
  const body = entries
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

const all = [...staticPages, ...blogUrls()];
const out = path.join(repoRoot, "sitemap.xml");
fs.writeFileSync(out, toXml(all), "utf-8");
console.log("Wrote sitemap.xml,", all.length, "URLs");
