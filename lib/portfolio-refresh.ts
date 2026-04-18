import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  GitHubStats,
  LinkedInPost,
  MediumArticle,
  PinnedRepo,
  PortfolioData,
  Repository,
} from "@/types/portfolio";

const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? "bahakizil";

interface GitHubApiRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  topics?: string[];
  created_at: string;
  updated_at: string;
  fork: boolean;
  archived?: boolean;
  private?: boolean;
}

function toRepository(repo: GitHubApiRepo): Repository {
  return {
    id: repo.id,
    name: repo.name,
    description: repo.description,
    html_url: repo.html_url,
    homepage: repo.homepage,
    language: repo.language,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    watchers_count: repo.watchers_count,
    topics: repo.topics ?? [],
    created_at: repo.created_at,
    updated_at: repo.updated_at,
  };
}

async function fetchGitHubRepos(): Promise<Repository[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "portfolio-refresh",
  };
  if (process.env.GITHUB_API_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_API_TOKEN}`;
  }

  const response = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
    { headers, cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}`);
  }

  const data = (await response.json()) as GitHubApiRepo[];
  return data
    .filter((r) => !r.fork && !r.archived && !r.private)
    .map(toRepository)
    .sort((a, b) => b.stargazers_count - a.stargazers_count);
}

async function fetchGitHubProfile(): Promise<GitHubStats> {
  try {
    const response = await fetch(`https://github.com/${GITHUB_USERNAME}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return { pinnedRepos: [], contributionChart: null };
    }

    const html = await response.text();
    return {
      pinnedRepos: parsePinnedRepos(html),
      contributionChart: parseContributionChart(html),
    };
  } catch {
    return { pinnedRepos: [], contributionChart: null };
  }
}

function parsePinnedRepos(html: string): PinnedRepo[] {
  const pinned: PinnedRepo[] = [];
  const blocks = html.match(/<div class="[^"]*pinned-item[^"]*"[\s\S]*?<\/div>/g) ?? [];

  for (const match of blocks) {
    const nameMatch = match.match(new RegExp(`href="/${GITHUB_USERNAME}/([^"]+)"`));
    if (!nameMatch) continue;

    const descMatch = match.match(
      /<p[^>]*class="[^"]*pinned-item-desc[^"]*"[^>]*>(.*?)<\/p>/s,
    );
    const starsMatch = match.match(/(\d+)\s*<svg[^>]*octicon-star/);
    const langMatch = match.match(
      /<span[^>]*class="[^"]*repo-language-color[^"]*"[^>]*><\/span>\s*([^<]+)/,
    );

    pinned.push({
      name: nameMatch[1],
      description: descMatch ? descMatch[1].replace(/<[^>]*>/g, "").trim() : "",
      stars: starsMatch ? Number.parseInt(starsMatch[1], 10) : 0,
      language: langMatch ? langMatch[1].trim() : "",
    });
  }

  return pinned;
}

function parseContributionChart(html: string) {
  const totalMatch = html.match(/(\d+)\s+contributions?\s+in\s+the\s+last\s+year/i);
  const streakMatch = html.match(/(\d+)\s+day\s+contribution\s+streak/i);
  const total = totalMatch ? Number.parseInt(totalMatch[1], 10) : 0;

  return {
    totalContributions: total,
    currentStreak: streakMatch ? Number.parseInt(streakMatch[1], 10) : 0,
    weeklyData: [],
    lastYearContributions: total,
  };
}

async function fetchInternal<T>(path: string, fallback: T): Promise<T> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  try {
    const response = await fetch(`${base}${path}`, { cache: "no-store" });
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

async function fetchMediumArticles(): Promise<MediumArticle[]> {
  return fetchInternal<MediumArticle[]>("/api/medium", []);
}

async function fetchLinkedInPosts(): Promise<LinkedInPost[]> {
  return fetchInternal<LinkedInPost[]>("/api/linkedin", []);
}

export async function refreshPortfolioData(): Promise<PortfolioData> {
  const [repos, stats, articles, linkedinPosts] = await Promise.all([
    fetchGitHubRepos(),
    fetchGitHubProfile(),
    fetchMediumArticles(),
    fetchLinkedInPosts(),
  ]);

  const portfolio: PortfolioData = {
    lastUpdated: new Date().toISOString(),
    repos,
    articles,
    linkedinPosts,
    githubStats: stats,
  };

  const dataDir = join(process.cwd(), "data");
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  writeFileSync(
    join(dataDir, "portfolio-data.json"),
    JSON.stringify(portfolio, null, 2),
    "utf8",
  );

  return portfolio;
}
