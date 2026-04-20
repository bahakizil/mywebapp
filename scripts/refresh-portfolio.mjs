#!/usr/bin/env node
/**
 * Refresh data/portfolio-data.json using only free endpoints.
 *
 * Sources:
 *   - GitHub REST API (repos + profile HTML for pinned/contributions)
 *   - Medium public RSS feed (medium.com/feed/@USERNAME)
 *   - Hugging Face public API (huggingface.co/api/spaces)
 *   - data/linkedin-posts.json (manual curated list)
 *
 * No paid APIs, no auth required (GITHUB_API_TOKEN optional for rate limit).
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? "bahakizil";
const GITHUB_TOKEN = process.env.GITHUB_API_TOKEN ?? process.env.GITHUB_TOKEN;
const MEDIUM_USERNAME = process.env.MEDIUM_USERNAME ?? "bahakizil";
const HF_USERNAME = process.env.HUGGINGFACE_USERNAME ?? "bahakizil";

const DATA_DIR = join(process.cwd(), "data");
const DATA_FILE = join(DATA_DIR, "portfolio-data.json");
const LINKEDIN_FILE = join(DATA_DIR, "linkedin-posts.json");

const log = (msg) => console.log(`[refresh] ${msg}`);

// ---------------------------------------------------------------- GitHub ----

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

async function fetchContributionCalendar() {
  if (!GITHUB_TOKEN) {
    log("GITHUB_TOKEN missing, skipping contribution calendar");
    return null;
  }
  const query = `query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { contributionCount date color }
          }
        }
      }
    }
  }`;
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "portfolio-refresh-bot",
      },
      body: JSON.stringify({
        query,
        variables: { login: GITHUB_USERNAME },
      }),
    });
    if (!res.ok) {
      log(`graphql ${res.status}, skipping calendar`);
      return null;
    }
    const json = await res.json();
    const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) return null;
    return {
      totalContributions: cal.totalContributions,
      weeks: cal.weeks.map((w) => ({
        days: w.contributionDays.map((d) => ({
          date: d.date,
          count: d.contributionCount,
          color: d.color,
        })),
      })),
    };
  } catch (err) {
    log(`calendar fetch failed: ${err.message}`);
    return null;
  }
}

async function fetchGithubProfile() {
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

// ----------------------------------------------------------- Medium (RSS) ----

const stripCdata = (v) =>
  v.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
const decode = (v) =>
  v
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");

function pickTag(block, tag) {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);
  const m = block.match(re);
  return m ? decode(stripCdata(m[1])) : "";
}

function stripHtml(html, max = 260) {
  const text = html
    .replace(/<figure[\s\S]*?<\/figure>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

async function fetchMediumArticles() {
  try {
    const res = await fetch(
      `https://medium.com/feed/@${MEDIUM_USERNAME}`,
      { headers: { "User-Agent": "portfolio-medium-reader" } },
    );
    if (!res.ok) {
      log(`medium rss ${res.status}, skipping`);
      return null;
    }
    const xml = await res.text();
    const items = [];
    const itemRe = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRe.exec(xml)) !== null) {
      const block = match[1];
      const title = pickTag(block, "title");
      const link = pickTag(block, "link");
      const pubDate = pickTag(block, "pubDate");
      const description = pickTag(block, "description");
      const content = pickTag(block, "content:encoded");
      const categories = Array.from(
        block.matchAll(/<category>([\s\S]*?)<\/category>/g),
      ).map((m) => decode(stripCdata(m[1])));

      const imgMatch = (content || description).match(/<img[^>]+src="([^"]+)"/);
      const thumbnail = imgMatch ? imgMatch[1] : undefined;

      items.push({
        title,
        link,
        publishedDate: new Date(pubDate).toISOString(),
        description: stripHtml(description || content),
        thumbnail,
        image_url: thumbnail,
        categories,
        claps: 0,
      });
    }
    return items.slice(0, 8);
  } catch (err) {
    log(`medium fetch failed: ${err.message}`);
    return null;
  }
}

// --------------------------------------------------------------- LinkedIn ----

function loadLinkedInPosts() {
  if (!existsSync(LINKEDIN_FILE)) return [];
  try {
    const raw = JSON.parse(readFileSync(LINKEDIN_FILE, "utf8"));
    return raw.map((p) => ({
      id: p.id,
      text: p.text,
      date: p.publishedAt,
      publishedAt: p.publishedAt,
      engagement: p.engagement,
      likes: p.engagement?.likes ?? 0,
      comments: p.engagement?.comments ?? 0,
      shares: p.engagement?.shares ?? 0,
      url: p.url,
      image_url: p.image_url ?? undefined,
      author: p.author?.name ?? "Baha Kızıl",
    }));
  } catch (err) {
    log(`linkedin static read failed: ${err.message}`);
    return [];
  }
}

// ----------------------------------------------------------------- Main ----

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

  const [repos, profileStats, freshArticles, calendar] = await Promise.all([
    fetchRepos(),
    fetchGithubProfile(),
    fetchMediumArticles(),
    fetchContributionCalendar(),
  ]);
  const githubStats = { ...profileStats, calendar };

  const previous = loadExisting();
  const articles =
    freshArticles && freshArticles.length > 0
      ? freshArticles
      : previous?.articles ?? [];
  const linkedinPosts = loadLinkedInPosts();

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
    `wrote ${repos.length} repos, ${articles.length} medium articles, ${linkedinPosts.length} linkedin posts`,
  );
}

main().catch((err) => {
  console.error("[refresh] fatal:", err);
  process.exit(1);
});
