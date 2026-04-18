import { NextRequest, NextResponse } from "next/server";
import { refreshPortfolioData } from "@/lib/portfolio-refresh";

const REFRESH_TOKEN = process.env.DATA_REFRESH_TOKEN;

function isAuthorized(request: NextRequest) {
  if (!REFRESH_TOKEN) return false;
  const auth = request.headers.get("authorization");
  const token = auth?.replace("Bearer ", "");
  return Boolean(token && token === REFRESH_TOKEN);
}

export async function POST(request: NextRequest) {
  if (!REFRESH_TOKEN) {
    return NextResponse.json(
      { error: "DATA_REFRESH_TOKEN not configured on server." },
      { status: 503 },
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Invalid or missing token." },
      { status: 401 },
    );
  }

  try {
    const result = await refreshPortfolioData();
    return NextResponse.json({
      success: true,
      message: "Data refreshed successfully",
      timestamp: result.lastUpdated,
      counts: {
        repos: result.repos.length,
        articles: result.articles.length,
        linkedinPosts: result.linkedinPosts.length,
        pinnedRepos: result.githubStats?.pinnedRepos?.length ?? 0,
        totalContributions:
          result.githubStats?.contributionChart?.totalContributions ?? 0,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to refresh data", details: message },
      { status: 500 },
    );
  }
}
