// Default <title> for knowledge base terms that still carry the old generic
// pattern ("What is X? | Expert Data Lakehouse Architecture Guide"). Terms with
// a hand-written meta_title keep it. The generic pattern competed with official
// docs on the bare definition query; this leads with the term and the
// lakehouse framing the page actually covers, within about 60 characters.

const GENERIC = /^What (is|are) .+\?\s*\|\s*.*(Guide|Glossary|Knowledge Base|Architecture)\s*$/i;

export function termName(title: string): string {
  return title
    .replace(/^What (is|are) (an? |the )?/i, "")
    .replace(/\?\s*$/, "")
    .trim();
}

export function kbMetaTitle(title: string, metaTitle?: string): string {
  const current = metaTitle || title;
  if (!GENERIC.test(current) && !/^What (is|are) .+\?$/i.test(current)) return current;
  let term = termName(title);
  // Drop a trailing parenthetical (often an expansion) when it makes the title long.
  const short = term.replace(/\s*\([^)]*\)\s*$/, "");
  const options = [
    `${term} Explained for the Data Lakehouse | Glossary`,
    `${short} Explained for the Data Lakehouse | Glossary`,
    `${term} Explained for the Data Lakehouse`,
    `${short} Explained for the Data Lakehouse`,
    `${short} in the Data Lakehouse | Glossary`,
    `${short} | Data Lakehouse Glossary`,
  ];
  return options.find((o) => o.length <= 60) || short;
}
