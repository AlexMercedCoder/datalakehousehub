// Rehype plugin: rewrite internal links in Markdown/MDX bodies so they end in
// "/". The site builds with trailingSlash: "always", so a slashless link costs
// a 301 per click. Mirrors src/lib/utils/withSlash.ts.
const SITE = "https://datalakehousehub.com";

export function withSlash(href) {
  if (typeof href !== "string") return href;
  let prefix = "";
  let rest = href;
  if (rest.startsWith(SITE + "/")) {
    prefix = SITE;
    rest = rest.slice(SITE.length);
  } else if (rest === SITE) {
    return SITE + "/";
  }
  if (!rest.startsWith("/") || rest.startsWith("//")) return href;
  const m = rest.match(/^([^?#]*)(.*)$/);
  const [, path, tail] = m;
  const last = path.split("/").filter(Boolean).pop() || "";
  if (last.includes(".")) return href;
  const lower = path.toLowerCase();
  return `${prefix}${lower.endsWith("/") ? lower : lower + "/"}${tail}`;
}

export default function trailingSlashLinks() {
  const visit = (node) => {
    if (node.type === "element" && node.tagName === "a" && node.properties?.href) {
      node.properties.href = withSlash(node.properties.href);
    }
    if (node.children) node.children.forEach(visit);
  };
  return (tree) => visit(tree);
}
