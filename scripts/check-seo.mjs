import { readFileSync, existsSync } from "node:fs";

const dist = new URL("../dist/", import.meta.url);
const failures = [];

const pages = [
  {
    path: "blog/2026/2026-03-context-management-cursor/index.html",
    canonical:
      "https://datalakehousehub.com/blog/2026/2026-03-context-management-cursor",
    title: "Cursor Context Management",
  },
  {
    path: "blog/2026/2026-03-context-management-opencode/index.html",
    canonical:
      "https://datalakehousehub.com/blog/2026/2026-03-context-management-opencode",
    title: "OpenCode Context Management",
  },
  {
    path: "blog/2026/2026-06-agentic-coding-tools/index.html",
    canonical:
      "https://datalakehousehub.com/blog/2026/2026-06-agentic-coding-tools",
    title: "Agentic Coding Tools in 2026",
  },
];

for (const page of pages) {
  const file = new URL(page.path, dist);
  if (!existsSync(file)) {
    failures.push(`Missing generated priority page: ${page.path}`);
    continue;
  }

  const html = readFileSync(file, "utf8");
  if (!html.includes(`<link rel="canonical" href="${page.canonical}"`)) {
    failures.push(`Incorrect canonical for ${page.path}`);
  }
  if (!new RegExp(`<title>\\s*${page.title}`).test(html)) {
    failures.push(`Incorrect title for ${page.path}`);
  }
  if (/name="robots" content="noindex/i.test(html)) {
    failures.push(`Priority page is noindex: ${page.path}`);
  }
}

const sitemap = readFileSync(new URL("sitemap-0.xml", dist), "utf8");
for (const page of pages) {
  const sitemapUrl = page.canonical.replace(/\/$/, "");
  if (!sitemap.includes(`<loc>${sitemapUrl}</loc>`)) {
    failures.push(`Priority page missing from sitemap: ${sitemapUrl}`);
  }
}

for (const excluded of ["/search", "/elements"]) {
  if (sitemap.includes(`<loc>https://datalakehousehub.com${excluded}</loc>`)) {
    failures.push(`Excluded utility page appears in sitemap: ${excluded}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Hub priority SEO checks passed.");
