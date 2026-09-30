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

// Posts whose canonical lives on another site (syndicated copies) stay out of
// the sitemap: a sitemap should list only URLs this site is canonical for.
const nonCanonicalPaths = new Set();

function getHubDates() {
  const dates = {};
  function walk(d, prefix) {
    if (!fs.existsSync(d)) return;
    for (const f of fs.readdirSync(d)) {
      const full = path.join(d, f);
      if (fs.statSync(full).isDirectory()) {
        walk(full, prefix);
      } else if (f.endsWith(".md") || f.endsWith(".mdx")) {
        const txt = fs.readFileSync(full, "utf-8");
        const m = txt.match(/^---\s*\n([\s\S]*?)\n---/);
        let dVal = null;
        if (m) {
          const modMatch =
            m[1].match(/date:\s*(.*)/) ||
            m[1].match(/lastmod:\s*(.*)/) ||
            m[1].match(/pubDate:\s*(.*)/);
          if (modMatch) dVal = modMatch[1].trim().replace(/["']/g, "");
        }
        const dObj = dVal ? new Date(dVal) : fs.statSync(full).mtime;
        if (m && (prefix === "/blog/" || prefix === "/knowledgebase/") && /^canonical:\s*["']?https:\/\/(?!datalakehousehub\.com)/m.test(m[1])) {
          const slugMatch = m[1].match(/^slug:\s*["']?([^"'\n]+?)["']?\s*$/m);
          const base = prefix === "/blog/" ? "./src/content/blog" : "./src/content/knowledgebase";
          const rel = path.relative(base, full).replace(/\.mdx?$/, "");
          const id = slugMatch ? slugMatch[1] : rel.toLowerCase().replace(/[^a-z0-9/ _-]/g, "").replace(/ /g, "-");
          nonCanonicalPaths.add(`${prefix}${id}/`.toLowerCase());
        }
        const slug = f.replace(/\.mdx?$/, "");
        dates[`${prefix}${slug}/`] = dObj;
        dates[`${prefix}${slug}`] = dObj;
      }
    }
  }
  walk("./src/content/blog", "/blog/");
  walk("./src/content/knowledgebase", "/knowledgebase/");
  walk("./src/content/pages", "/");
  return dates;
}

const hubContentDates = getHubDates();

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
        !page.endsWith("/search") &&
        !page.endsWith("/search/") &&
        !page.endsWith("/elements") &&
        !page.endsWith("/elements/"),
      serialize(item) {
        // Netlify serves lowercase paths; list the URL that answers 200.
        item.url = item.url.replace(/^(https?:\/\/[^/]+)(.*)$/, (_, o, p) => o + p.toLowerCase());
        const urlObj = new URL(item.url);
        const p = urlObj.pathname;
        const d =
          hubContentDates[p] ||
          hubContentDates[p.replace(/\/$/, "")] ||
          hubContentDates[`${p}/`];
        if (d && !isNaN(d.getTime())) {
          item.lastmod = d.toISOString();
        } else {
          item.lastmod = new Date().toISOString();
        }
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
