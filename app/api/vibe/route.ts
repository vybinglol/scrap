import { NextResponse } from "next/server";
import sharp from "sharp";

// The only server-side piece. Given a pasted URL it (1) finds the representative
// image via Open Graph tags, then (2) decodes that image and returns the handful
// of dominant colors in it. All the *design* decisions (which color is the
// background vs the accent, mood, contrast) happen in lib/vibe.ts so they can be
// shared and unit-reasoned. No secrets, no auth — just an outbound fetch.

export const runtime = "nodejs";

const UA =
  "Mozilla/5.0 (compatible; ScrapableBot/1.0; +https://scrapable.app)";

function metaTag(html: string, property: string): string | undefined {
  // Match <meta property="og:image" content="..."> in either attribute order.
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
      "i",
    ),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return m[1];
  }
  return undefined;
}

async function fetchWithTimeout(url: string, ms: number, accept: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, {
      headers: { "user-agent": UA, accept },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

function toHex(n: number) {
  return n.toString(16).padStart(2, "0");
}

// Coarse color histogram: downscale the image and bucket pixels into a 16×16×16
// grid, then return the most-populated buckets (averaged to their true color).
async function dominantColors(
  buffer: ArrayBuffer,
): Promise<{ hex: string; count: number }[]> {
  const { data } = await sharp(Buffer.from(buffer))
    .resize(48, 48, { fit: "cover" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const buckets = new Map<
    number,
    { count: number; r: number; g: number; b: number }
  >();

  for (let i = 0; i < data.length; i += 3) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.count++;
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
    } else {
      buckets.set(key, { count: 1, r, g, b });
    }
  }

  return [...buckets.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
    .map((bk) => ({
      hex: `#${toHex(Math.round(bk.r / bk.count))}${toHex(
        Math.round(bk.g / bk.count),
      )}${toHex(Math.round(bk.b / bk.count))}`,
      count: bk.count,
    }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("url");

  let parsed: URL;
  try {
    parsed = new URL(target ?? "");
    if (!/^https?:$/.test(parsed.protocol)) throw new Error("bad protocol");
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  const empty = { imageUrl: null, title: null, colors: [] as never[] };

  try {
    const pageRes = await fetchWithTimeout(parsed.toString(), 7000, "text/html");
    if (!pageRes.ok) return NextResponse.json(empty);

    // Pinterest puts its og tags near the *end* of a ~1MB document, so scan
    // generously (capped to avoid pathological pages).
    const html = (await pageRes.text()).slice(0, 3_000_000);
    const imageUrl = metaTag(html, "og:image") ?? null;
    const title =
      metaTag(html, "og:title") ??
      html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ??
      null;

    if (!imageUrl) return NextResponse.json({ ...empty, title });

    let colors: { hex: string; count: number }[] = [];
    try {
      const imgRes = await fetchWithTimeout(imageUrl, 8000, "image/*");
      if (imgRes.ok) colors = await dominantColors(await imgRes.arrayBuffer());
    } catch {
      // undecodable / blocked image — fall through with no colors
    }

    return NextResponse.json(
      { imageUrl, title, colors },
      { headers: { "cache-control": "public, max-age=86400" } },
    );
  } catch {
    return NextResponse.json(empty);
  }
}
