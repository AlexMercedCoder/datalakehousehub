import { getCollection } from "astro:content";
import sharp from "sharp";
import { renderOgPng } from "@/lib/ogImage";

export const prerender = true;

// Reader-facing copies of each post's card: the 1200x630 PNG (about 150 KB)
// stays for og:image, while pages show these WebP files (/open-graph/w/640/
// for related-post cards, /open-graph/w/1200/ for the post header).
const OG_WIDTHS = [640, 1200] as const;

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return OG_WIDTHS.flatMap((width) =>
    posts.map((post) => ({
      params: { width: String(width), slug: post.id },
      props: { title: post.data.title, width },
    })),
  );
}

export async function GET({ props }: { props: { title: string; width: number } }) {
  const png = await renderOgPng(props.title);
  const webp = await sharp(png).resize({ width: props.width }).webp({ quality: 72 }).toBuffer();
  return new Response(webp as any, { headers: { "Content-Type": "image/webp" } });
}
