import { getCollection } from "astro:content";
import { renderOgPng } from "@/lib/ogImage";

export const prerender = true;

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

export async function GET({ props }: { props: { post: any } }) {
  const pngBuffer = await renderOgPng(props.post.data.title);

  return new Response(pngBuffer as any, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
