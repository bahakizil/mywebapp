import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const revalidate = 300;

interface LinkedInPostRecord {
  id: string;
  text: string;
  publishedAt: string;
  author: { name: string; headline: string };
  engagement: { likes: number; comments: number; shares: number };
  url: string;
  image_url?: string | null;
}

function loadPosts(): LinkedInPostRecord[] {
  const file = path.join(process.cwd(), "data", "linkedin-posts.json");
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as LinkedInPostRecord[];
  } catch {
    return [];
  }
}

export async function GET() {
  const posts = loadPosts();

  const formatted = posts.map((post) => ({
    id: post.id,
    text: post.text,
    content: post.text,
    date: post.publishedAt,
    publishedAt: post.publishedAt,
    engagement: post.engagement,
    likes: post.engagement.likes,
    comments: post.engagement.comments,
    shares: post.engagement.shares,
    url: post.url,
    image_url: post.image_url ?? undefined,
    author: post.author.name,
  }));

  return NextResponse.json(formatted, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
