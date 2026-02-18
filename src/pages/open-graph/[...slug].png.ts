import { getCollection } from "astro:content";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { html } from "satori-html";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const prerender = true;

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

export async function GET({ props }: { props: { post: any } }) {
  const { post } = props;
  const title = post.data.title;
    
  // Simple robust font fetching
  const fontPath = join(process.cwd(), "node_modules/@fontsource/roboto/files/roboto-latin-700-normal.woff");
  const fontData = readFileSync(fontPath);

  const markup = html`
    <div
      style="display: flex; height: 100%; width: 100%; align-items: center; justify-content: center; letter-spacing: -2px; background: #0aa8a7; color: white; padding: 40px; text-align: center;"
    >
       <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; border: 4px solid white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); width: 90%; height: 90%; background: linear-gradient(135deg, #0aa8a7 0%, #066b6a 100%);">
         <h1 style="font-size: 80px; font-weight: bold; margin: 0; line-height: 1.1; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">${title}</h1>
         <p style="font-size: 30px; margin-top: 30px; opacity: 0.9;">The Data Lakehouse Hub</p>
       </div>
    </div>
  `;

  const svg = await satori(markup as any, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Roboto",
        data: fontData,
        weight: 700,
        style: "normal",
      },
    ],
  });

  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer as any, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
