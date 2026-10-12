import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import trailingSlashLinks from "./src/lib/rehype/trailingSlashLinks.mjs";
import demoteH1 from "./src/lib/rehype/demoteH1.mjs";
import config from "./src/config/config.json";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

// Posts whose canonical lives on another site (syndicated copies) stay out of
// the sitemap: a sitemap should list only URLs this site is canonical for.
const nonCanonicalPaths = new Set();

// Last commit date per content file, read once, for entries with no date in
// their frontmatter (the knowledgebase). Newest commit wins. A shallow clone
// would date every file to the one fetched commit, so it yields no dates.
const shallow = (() => {
  try {
    return execFileSync("git", ["rev-parse", "--is-shallow-repository"], { encoding: "utf-8" }).trim() !== "false";
  } catch {
    return true;
  }
})();
function gitFileDates(dir) {
  const out = {};
  if (shallow) return out;
  try {
    const log = execFileSync("git", ["log", "--format=@%cI", "--name-only", "--", dir], { encoding: "utf-8", maxBuffer: 64 * 1024 * 1024 });
    let date = null;
    for (const line of log.split("\n")) {
      if (line.startsWith("@")) date = new Date(line.slice(1));
      else if (line && !(line in out)) out[line] = date;
    }
  } catch {}
  return out;
}
const gitDates = gitFileDates("src/content");

function getHubDates() {
  const dates = {};
  function walk(d, prefix, base = d) {
    if (!fs.existsSync(d)) return;
    for (const f of fs.readdirSync(d)) {
      const full = path.join(d, f);
      if (fs.statSync(full).isDirectory()) {
        walk(full, prefix, base);
      } else if (f.endsWith(".md") || f.endsWith(".mdx")) {
        const txt = fs.readFileSync(full, "utf-8");
        const m = txt.match(/^---\s*\n([\s\S]*?)\n---/);
        // Prefer an explicit lastmod over the publish date. A file with no
        // usable date gets none here (mtime only reflects the checkout).
        let dObj = null;
        for (const k of ["lastmod", "date", "pubDate"]) {
          const dm = m && m[1].match(new RegExp(`^${k}:\\s*(.+)$`, "m"));
          const d = dm && new Date(dm[1].trim().replace(/["']/g, ""));
          if (d && !isNaN(d.getTime())) { dObj = d; break; }
        }
        // Key by the URL id the glob loader builds: the frontmatter slug, or
        // the slugified path under the collection. Keying by filename missed
        // every post with its own slug, and those got the build time instead.
        const slugMatch = m && m[1].match(/^slug:\s*["']?([^"'\n]+?)["']?\s*$/m);
        const rel = path.relative(base, full).replace(/\.mdx?$/, "");
        const id = (slugMatch ? slugMatch[1] : rel.toLowerCase().replace(/[^a-z0-9/ _-]/g, "").replace(/ /g, "-")).toLowerCase();
        if (m && /^canonical:\s*["']?https:\/\/(?!datalakehousehub\.com)/m.test(m[1])) {
          nonCanonicalPaths.add(`${prefix}${id}/`);
        }
        dObj ??= gitDates[path.relative(".", full)] ?? null;
        if (dObj) dates[`${prefix}${id}/`] = dObj;
      }
    }
  }
  walk("./src/content/blog", "/blog/");
  walk("./src/content/knowledgebase", "/knowledgebase/");
  walk("./src/content/pages", "/");
  return dates;
}

const hubContentDates = getHubDates();

// Standalone .astro pages take the last commit that touched their source.
function pageSourceDate(key) {
  const base = key.replace(/^\/|\/$/g, "") || "index";
  for (const f of [`src/pages/${base}.astro`, `src/pages/${base}/index.astro`]) {
    if (!fs.existsSync(f) || shallow) continue;
    try {
      const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", f], { encoding: "utf-8" }).trim();
      return out ? new Date(out) : null;
    } catch {
      return null;
    }
  }
  return null;
}
const newestPost = new Date(
  Math.max(...Object.entries(hubContentDates).filter(([k]) => k.startsWith("/blog/")).map(([, d]) => d.getTime())),
);

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url ? config.site.base_url : "https://datalakehousehub.com",
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !nonCanonicalPaths.has(new URL(page).pathname.toLowerCase()) &&
        // blog/index.md only holds the archive's title; its page 301s to /blog/.
        !/\/blog\/index\/?$/.test(new URL(page).pathname) &&
        !page.endsWith("/search") &&
        !page.endsWith("/search/") &&
        !page.endsWith("/elements") &&
        !page.endsWith("/elements/"),
      serialize(item) {
        // Netlify serves lowercase paths; list the URL that answers 200.
        item.url = item.url.replace(/^(https?:\/\/[^/]+)(.*)$/, (_, o, p) => o + p.toLowerCase());
        const p = new URL(item.url).pathname;
        const key = p.endsWith("/") ? p : `${p}/`;
        // Posts and pages carry their own date; the home page and the blog
        // archive change when the newest post does. Anything else gets no
        // lastmod rather than the build time.
        const d = hubContentDates[key] ?? (/^\/(blog\/(page\/\d+\/)?)?$/.test(key) ? newestPost : null) ?? pageSourceDate(key);
        if (d) item.lastmod = d.toISOString();
        else delete item.lastmod;
        return item;
      },
    }),
    AutoImport({
      imports: [
        "@/shortcodes/Button",
        "@/shortcodes/Accordion",
        "@/shortcodes/Notice",
        "@/shortcodes/Video",
        "@/shortcodes/Youtube",
        "@/shortcodes/Tabs",
        "@/shortcodes/Tab",
      ],
    }),
    mdx(),
  ],
  markdown: {
    rehypePlugins: [trailingSlashLinks, demoteH1],
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
  vite: {
    // Tailwind 4 is a Vite plugin rather than an Astro integration.
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        external: ["/pagefind/pagefind.js"],
      },
    },
  },
});
