// llms.txt, generated at build time from the blog collection so it lists the
// articles whose canonical home is this site (syndicated copies are skipped).
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const SITE = "https://datalakehousehub.com";

export const GET: APIRoute = async () => {
  const posts = (await getCollection("blog", ({ data }) => !data.draft))
    .filter((p) => !p.data.canonical || p.data.canonical.startsWith(`${SITE}/`))
    .sort((a, b) => (b.data.date?.valueOf() ?? 0) - (a.data.date?.valueOf() ?? 0));

  const url = (p: (typeof posts)[number]) => `${SITE}/blog/${p.id.toLowerCase()}/`;
  const line = (p: (typeof posts)[number]) =>
    `- [${p.data.title}](${url(p)})${p.data.description ? `: ${p.data.description.replace(/\s+/g, " ").trim()}` : ""}`;
  const byId = (pattern: RegExp) =>
    posts.filter((p) => pattern.test(p.id)).sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true }));

  const featuredIds = [
    "2026-03-context-management-cursor",
    "2026-03-context-management-opencode",
    "agentic-coding-tools",
    "2026-01-a-practical-guide-to-ai-assisted-coding-tools",
    "2025-09-2026-guide-to-data-lakehouses",
    "2025-09-ultimate-guide-to-open-table-formats",
    "2025-10-2026-guide-to-learning-lakehouse-iceberg-agentic-ai",
    "iceberg-market-2026",
    "ai-model-families-2026",
    "consolidation-2026-open-formats",
  ];
  const featured = featuredIds
    .map((id) => posts.find((p) => p.id.toLowerCase() === id))
    .filter((p): p is (typeof posts)[number] => Boolean(p));

  const mcpSeries = posts
    .filter((p) => /^A? ?Journey from AI to LLMs and MCP/i.test(p.data.title))
    .sort((a, b) => (a.data.date?.valueOf() ?? 0) - (b.data.date?.valueOf() ?? 0));
  const aiLevels = byId(/^ai-for-all-levels-/);
  const inSeries = new Set([...featured, ...mcpSeries, ...aiLevels].map((p) => p.id));
  const rest = posts.filter((p) => !inSeries.has(p.id));

  const body = `# Data Lakehouse Hub
> Data Lakehouse Hub is Alex Merced's publication for news, roundups, agentic coding guides, and community events across the data lakehouse and AI ecosystem. New data, analytics, and AI articles by Alex Merced are published here first. Long-standing Apache Iceberg reference guides live at Alex Merced's Lakehouse Blog (https://iceberglakehouse.com); copies of those guides on this site point there with rel=canonical.

Author: Alex Merced, Head of Developer Relations at Dremio (https://alexmerced.com)

## Start here
- [Data Lakehouse hub page](${SITE}/data-lakehouse/): What a data lakehouse is and how the pieces fit
- [Apache Iceberg hub page](${SITE}/apache-iceberg/): Entry point for Apache Iceberg articles
- [Agentic Lakehouse hub page](${SITE}/agentic-lakehouse/): AI agents on governed lakehouse data
- [Knowledge Base](${SITE}/knowledgebase/): Glossary of lakehouse, Iceberg, and catalog terms
- [Events](${SITE}/events/): Upcoming meetups and webinars from the Data Lakehouse Hub and Agentic Lakehouse Luma calendars
- [All articles](${SITE}/blog/)

## Most-read guides
${featured.map(line).join("\n")}

## Series: A Journey from AI to LLMs and MCP (${mcpSeries.length} parts)
${mcpSeries.map(line).join("\n")}

## Series: AI for All Levels (${aiLevels.length} parts)
${aiLevels.map(line).join("\n")}

## More articles whose canonical home is this site
${rest.map(line).join("\n")}

## Community
- [Data Lakehouse Hub on Luma](https://luma.com/DataLakehouseHub): Lakehouse meetups, linkups, and webinars
- [Agentic Lakehouse on Luma](https://luma.com/agenticlakehouse): Meetups and webinars on agentic analytics
- [Data Lakehouse Hub Slack](https://join.slack.com/t/thedatalakehousehub/shared_invite/zt-274yc8sza-mI2zhCW8LGkOh1uxuf8T5Q): practitioner community for lakehouse architecture
- [Data Events Slack](https://join.slack.com/t/data-events/shared_invite/zt-38vgrooy9-U9ral_gr3NAz_Siih1QwmQ): announcements for data conferences and meetups
- [Data & Tech Slack](https://join.slack.com/t/datatechcommunity/shared_invite/zt-12xrk4qmd-y~6jUFFd7kdaLhgLURKwoA): broader data and technology community
- [r/datalakehouseandai](https://www.reddit.com/r/datalakehouseandai/): Subreddit for data lakehouse and AI discussion
- [Data Lakehouse Hub on LinkedIn](https://www.linkedin.com/company/data-lakehouse-hub/)
- [Alex Merced Data and AI on YouTube](https://www.youtube.com/@alexmerceddata)
- [Newsletter](https://amdatalakehouse.substack.com): Alex Merced's weekly data lakehouse newsletter
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
