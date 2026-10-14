// Build-time "Related terms" for the knowledge base.
//
// Each term gets its closest neighbours by TF-IDF similarity over title,
// description and body, boosted when one term's body mentions or links the
// other. A second pass guarantees every term at least MIN_INBOUND links from
// other term pages, so newly added terms (for example the 96 migrated from
// alexmerceddata) are reachable by crawlers, not only from the A to Z index.

const FORWARD = 6;
const MAX_LIST = 9;
const MIN_INBOUND = 3;

const STOP = new Set(
  (
    "about above after again against also among an and any are around because been before being below between both " +
    "but by can could data does doing down during each every few for from further had has have having here how into " +
    "its itself just more most much must need needs not now off once only other our out over own same should since " +
    "some such than that the their them then there these they this those through too under until upon very was were " +
    "what when where which while who whom why will with within without would you your using used use uses one two " +
    "like make makes made many may well often across rather instead allows allowing ensure ensures provides provide " +
    "system systems modern traditional engineering engineers teams team organizations specific entire single learn " +
    "book books alex merced lakehouse everyone guide"
  ).split(/\s+/),
);

interface Term {
  id: string;
  data: { title: string; description?: string };
  body?: string;
}

const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\]\([^)]*\)/g, "] ")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !STOP.has(w) && !/^\d+$/.test(w));

const shortName = (t: Term): string => t.id.replace(/-/g, " ");

export function buildRelatedTerms<T extends Term>(terms: T[]): Map<string, T[]> {
  const n = terms.length;
  const tfs: Map<string, number>[] = [];
  const df = new Map<string, number>();

  for (const t of terms) {
    const tf = new Map<string, number>();
    const add = (w: string, weight: number) => tf.set(w, (tf.get(w) || 0) + weight);
    tokenize(t.data.title + " " + shortName(t)).forEach((w) => add(w, 4));
    tokenize(t.data.description || "").forEach((w) => add(w, 2));
    tokenize(t.body || "").forEach((w) => add(w, 1));
    tfs.push(tf);
    for (const w of tf.keys()) df.set(w, (df.get(w) || 0) + 1);
  }

  const vecs = tfs.map((tf) => {
    const v = new Map<string, number>();
    let norm = 0;
    for (const [w, c] of tf) {
      const x = (1 + Math.log(c)) * Math.log(n / (df.get(w) || 1));
      if (x > 0) {
        v.set(w, x);
        norm += x * x;
      }
    }
    norm = Math.sqrt(norm) || 1;
    for (const [w, x] of v) v.set(w, x / norm);
    return v;
  });

  const bodies = terms.map((t) => (t.body || "").toLowerCase());
  const names = terms.map((t) => shortName(t));
  const mentions = (i: number, j: number): boolean => {
    if (bodies[i].includes(`/knowledgebase/${terms[j].id}`)) return true;
    const name = names[j];
    if (name.length < 5) return false;
    return new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(bodies[i]);
  };

  const sim: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const [a, b] = vecs[i].size < vecs[j].size ? [vecs[i], vecs[j]] : [vecs[j], vecs[i]];
      let s = 0;
      for (const [w, x] of a) {
        const y = b.get(w);
        if (y) s += x * y;
      }
      sim[i][j] = sim[j][i] = s;
    }
  }
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) if (i !== j && mentions(i, j)) sim[i][j] += 0.15;

  const ranked = sim.map((row, i) =>
    row
      .map((s, j) => ({ j, s }))
      .filter((x) => x.j !== i)
      .sort((a, b) => b.s - a.s || terms[a.j].id.localeCompare(terms[b.j].id)),
  );

  const lists: number[][] = ranked.map((r) => r.slice(0, FORWARD).map((x) => x.j));
  const inbound = new Array(n).fill(0);
  lists.forEach((l) => l.forEach((j) => inbound[j]++));

  // Guarantee inbound links: place under-linked terms on the pages of the
  // terms most similar to them (similarity is symmetric, so the link fits).
  for (let j = 0; j < n; j++) {
    for (const { j: host } of ranked[j]) {
      if (inbound[j] >= MIN_INBOUND) break;
      if (lists[host].includes(j) || lists[host].length >= MAX_LIST) continue;
      lists[host].push(j);
      inbound[j]++;
    }
  }

  const out = new Map<string, T[]>();
  terms.forEach((t, i) => out.set(t.id, lists[i].map((j) => terms[j])));
  return out;
}
