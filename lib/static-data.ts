import fs from "fs";
import path from "path";
import type { PortfolioData } from "@/types/portfolio";

let cachedData: PortfolioData | null = null;
let lastFileCheck = 0;
const CACHE_DURATION_MS = 60_000;

function loadFromDisk(): PortfolioData | null {
  try {
    const dataFile = path.join(process.cwd(), "data", "portfolio-data.json");
    if (!fs.existsSync(dataFile)) return null;
    const contents = fs.readFileSync(dataFile, "utf8");
    return JSON.parse(contents) as PortfolioData;
  } catch {
    return null;
  }
}

function getFallbackData(): PortfolioData {
  return {
    lastUpdated: new Date().toISOString(),
    repos: [],
    articles: [],
    linkedinPosts: [],
    githubStats: null,
  };
}

export function getStaticData(): PortfolioData {
  const now = Date.now();
  if (!cachedData || now - lastFileCheck > CACHE_DURATION_MS) {
    cachedData = loadFromDisk() ?? getFallbackData();
    lastFileCheck = now;
  }
  return cachedData;
}

export function getStaticRepos() {
  return getStaticData().repos;
}

export function getStaticArticles() {
  return getStaticData().articles;
}

export function getStaticLinkedInPosts() {
  return getStaticData().linkedinPosts;
}

export function getLastUpdateTime() {
  return getStaticData().lastUpdated;
}
