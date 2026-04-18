#!/usr/bin/env node
/**
 * Refresh portfolio-data.json with live data from GitHub + Medium.
 * Designed for GitHub Actions cron; runs without Next.js runtime.
 *
 * Required env (optional ones fall back gracefully):
 *   GITHUB_USERNAME     (default: bahakizil)
 *   GITHUB_API_TOKEN    (optional; lifts API rate limit)
 *   MEDIUM_USER_ID      (default: 60a0e4269377)
 *   RAPIDAPI_KEY        (optional; enables Medium engagement data)
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? "bahakizil";
const GITHUB_TOKEN = process.env.GITHUB_API_TOKEN ?? process.env.GITHUB_TOKEN;
const MEDIUM_USER_ID = process.env.MEDIUM_USER_ID ?? "60a0e4269377";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

const DATA_DIR = join(process.cwd(), "data");
const DATA_FILE = join(DATA_DIR, "portfolio-data.json");

function log(msg) {
  console.log(`[refresh] ${msg}`);
}

async function fetchRepos() {
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "portfolio-refresh-bot",
  };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
    { headers },
  );
  if (!res.ok) throw new Error(`GitHub repos ${res.status}`);

  const raw = await res.json();
  return raw
    .filter((r) => !r.fork && !r.archived && !r.private)
    .map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      html_url: r.html_url,
      homepage: r.homepage,
      language: r.language,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      watchers_count: r.watchers_count,
      topics: r.topics ?? [],
      created_at: r.created_at,
      updated_at: r.updated_at,
    }))
    .sort((a, b) => b.stargazers_count - a.stargazers_count);
}

async function fetchProfile() {
  try {
    const res = await fetch(`https://github.com/${GITHUB_USERNAME}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Accept: "text/html",
      },
    });
    if (!res.ok) return { pinnedRepos: [], contributionChart: null };

    const html = await res.text();
    const pinnedBlocks =
      html.match(/<div class="[^"]*pinned-item[^"]*"[\s\S]*?<\/div>/g) ?? [];
    const pinnedRepos = [];

    for (const block of pinnedBlocks) {
      const nameMatch = block.match(
        new RegExp(`href="/${GITHUB_USERNAME}/([^"]+)"`),
      );
      if (!nameMatch) continue;
      const descMatch = block.match(
        /<p[^>]*class="[^"]*pinned-item-desc[^"]*"[^>]*>([\s\S]*?)<\/p>/,
      );
      const starsMatch = block.match(/(\d+)\s*<svg[^>]*octicon-star/);
      const langMatch = block.match(
        /<span[^>]*class="[^"]*repo-language-color[^"]*"[^>]*><\/span>\s*([^<]+)/,
      );
      pinnedRepos.push({
        name: nameMatch[1],
        description: descMatch
          ? descMatch[1].replace(/<[^>]*>/g, "").trim()
          : "",
        stars: starsMatch ? Number.parseInt(starsMatch[1], 10) : 0,
        language: langMatch ? langMatch[1].trim() : "",
      });
    }

    const totalMatch = html.match(
      /(\d+)\s+contributions?\s+in\s+the\s+last\s+year/i,
    );
    const streakMatch = html.match(/(\d+)\s+day\s+contribution\s+streak/i);
    const total = totalMatch ? Number.parseInt(totalMatch[1], 10) : 0;

    return {
      pinnedRepos,
      contributionChart: {
        totalContributions: total,
        currentStreak: streakMatch
          ? Number.parseInt(streakMatch[1], 10)
          : 0,
        weeklyData: [],
        lastYearContributions: total,
      },
    };
  } catch (err) {
    log(`profile fetch failed: ${err.message}`);
    return { pinnedRepos: [], contributionChart: null };
  }
}

async function fetchMediumArticles() {
  if (!RAPIDAPI_KEY) {
    log("RAPIDAPI_KEY missing, skipping Medium fetch");
    return null;
  }

  const headers = {
    "X-RapidAPI-Key": RAPIDAPI_KEY,
    "X-RapidAPI-Host": "medium2.p.rapidapi.com",
  };

  try {
    const listRes = await fetch(
      `https://medium2.p.rapidapi.com/user/${MEDIUM_USER_ID}/articles`,
      { headers },
    );
    if (!listRes.ok) throw new Error(`medium list ${listRes.status}`);
    const listData = await listRes.json();
    const ids = (listData.associated_articles ?? []).slice(0, 8);

    const details = await Promise.all(
      ids.map(async (id) => {
        const res = await fetch(
          `https://medium2.p.rapidapi.com/article/${id}`,
          { headers },
        );
        if (!res.ok) return null;
        return res.json();
      }),
    );

    return details
      .filter(Boolean)
      .map((a) => ({
        title: a.title,
        subtitle: a.subtitle,
        link: a.url,
        publishedDate: a.published_at,
        description:
          a.subtitle ||
          `${a.word_count} words • ${Math.ceil(a.reading_time)} min read`,
        thumbnail: a.image_url,
        image_url: a.image_url,
        categories: a.tags ?? [],
        claps: a.claps ?? 0,
        views: a.views ?? 0,
        reads: a.reads ?? 0,
        responses: a.responses_count ?? 0,
      }));
  } catch (err) {
    log(`medium fetch failed: ${err.message}`);
    return null;
  }
}

function loadExisting() {
  if (!existsSync(DATA_FILE)) return null;
  try {
    return JSON.parse(readFileSync(DATA_FILE, "utf8"));
  } catch {
    return null;
  }
}

async function main() {
  log("starting refresh");
  const [repos, githubStats, freshArticles] = await Promise.all([
    fetchRepos(),
    fetchProfile(),
    fetchMediumArticles(),
  ]);

  const previous = loadExisting();
  const articles =
    freshArticles && freshArticles.length > 0
      ? freshArticles
      : previous?.articles ?? [];
  const linkedinPosts = previous?.linkedinPosts ?? [];

  const portfolio = {
    lastUpdated: new Date().toISOString(),
    repos,
    articles,
    linkedinPosts,
    githubStats,
  };

  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(portfolio, null, 2), "utf8");

  log(
    `wrote ${repos.length} repos, ${articles.length} articles, ${linkedinPosts.length} linkedin posts`,
  );
}

main().catch((err) => {
  console.error("[refresh] fatal:", err);
  process.exit(1);
});
