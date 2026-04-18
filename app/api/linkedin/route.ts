import { NextResponse } from "next/server";
import { getLinkedInPosts } from "@/lib/linkedin";

export const runtime = "nodejs";
export const revalidate = 0;

export async function GET() {
  try {
    const posts = await getLinkedInPosts();

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
      image_url: post.image_url,
      author: post.author.name,
    }));

    return NextResponse.json(formatted, {
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
    });
  } catch (error) {
    const details = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch LinkedIn posts", details },
      { status: 500 },
    );
  }
}
