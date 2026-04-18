import { NextResponse } from "next/server";
import { getStaticRepos } from "@/lib/static-data";

export const runtime = "nodejs";
export const revalidate = 300;

export async function GET() {
  try {
    const repos = getStaticRepos();
    return NextResponse.json(repos, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    const details = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch repositories", details },
      { status: 500 },
    );
  }
}
