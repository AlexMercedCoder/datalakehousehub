import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { html } from "satori-html";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// The 1200x630 card used for og:image, rendered to SVG. The PNG route serves
// it to social networks; the WebP routes serve resized copies to readers.
// Each card is requested three times per build (PNG, 640 and 1200 WebP), so
// the font and the SVG per title are cached for the life of the build.
let fontData: Buffer | null = null;
const svgCache = new Map<string, Promise<string>>();

export function renderOgSvg(title: string): Promise<string> {
  let svg = svgCache.get(title);
  if (!svg) {
    svg = buildSvg(title);
    svgCache.set(title, svg);
  }
  return svg;
}

async function buildSvg(title: string): Promise<string> {
  fontData ??= readFileSync(
    join(process.cwd(), "node_modules/@fontsource/roboto/files/roboto-latin-700-normal.woff"),
  );

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
        data: fontData as Buffer,
        weight: 700,
        style: "normal",
      },
    ],
  });

  return svg;
}

// Rasterizing is the slow step (about 0.4 s per card), so each title is
// rasterized once at 1200 px and the WebP copies are resized from that PNG.
const pngCache = new Map<string, Promise<Buffer>>();

export function renderOgPng(title: string): Promise<Buffer> {
  let png = pngCache.get(title);
  if (!png) {
    png = renderOgSvg(title).then((svg) => Buffer.from(new Resvg(svg).render().asPng()));
    pngCache.set(title, png);
  }
  return png;
}
