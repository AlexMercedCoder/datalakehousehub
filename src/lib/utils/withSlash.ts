// The site builds with trailingSlash: "always", so every internal page URL
// must end in "/" or the click costs a 301. Pass any href through this helper.
// External URLs, anchors, mailto:, and file paths (anything with an extension,
// such as /rss.xml or /images/x.png) are returned unchanged. Page paths are
// lowercased because Netlify serves them lowercase.
export const withSlash = (href: string | undefined | null): string => {
  if (!href) return href ?? "";
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const match = href.match(/^([^?#]*)(.*)$/);
  if (!match) return href;
  const [, path, rest] = match;
  const last = path.split("/").filter(Boolean).pop() ?? "";
  if (last.includes(".")) return href;
  // Netlify serves lowercase paths only; a mixed-case link costs a 301.
  const lower = path.toLowerCase();
  return lower.endsWith("/") ? `${lower}${rest}` : `${lower}/${rest}`;
};

export default withSlash;
