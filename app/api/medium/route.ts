import { NextResponse } from "next/server";
import {
  extractFirstImage,
  parseRssItems,
  stripHtml,
} from "@/lib/rss";

export const runtime = "nodejs";
export const revalidate = 1800; // 30 minutes

const MEDIUM_USERNAME = process.env.MEDIUM_USERNAME ?? "bahakizil";
const FEED_URL = `https://medium.com/feed/@${MEDIUM_USERNAME}`;

export async function GET() {
  try {
    const response = await fetch(FEED_URL, {
      headers: { "User-Agent": "portfolio-medium-reader" },
      next: { revalidate },
    });
    if (!response.ok) {
      return NextResponse.json([], {
        headers: { "Cache-Control": "public, max-age=60" },
      });
    }

    const xml = await response.text();
    const items = parseRssItems(xml).slice(0, 8);

    const articles = items.map((item) => {
      const thumbnail = extractFirstImage(item.content || item.description);
      return {
        title: item.title,
        link: item.link,
        publishedDate: new Date(item.pubDate).toISOString(),
        description: stripHtml(item.description || item.content),
        thumbnail,
        image_url: thumbnail,
        categories: item.categories,
        claps: 0,
      };
    });

    return NextResponse.json(articles, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    const details = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch Medium articles", details },
      { status: 500 },
    );
  }
}
