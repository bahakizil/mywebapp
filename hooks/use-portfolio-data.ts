"use client";

import { useEffect, useState } from "react";
import type {
  GitHubStats,
  LinkedInPost,
  MediumArticle,
  Repository,
} from "@/types/portfolio";

export interface PortfolioDataState {
  repos: Repository[];
  articles: MediumArticle[];
  linkedInPosts: LinkedInPost[];
  githubStats: GitHubStats | null;
  isLoading: boolean;
  lastUpdated: string | null;
}

const INITIAL_STATE: PortfolioDataState = {
  repos: [],
  articles: [],
  linkedInPosts: [],
  githubStats: null,
  isLoading: true,
  lastUpdated: null,
};

export function usePortfolioData(): PortfolioDataState {
  const [state, setState] = useState<PortfolioDataState>(INITIAL_STATE);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/static-data");
        if (!response.ok) throw new Error(`Static data ${response.status}`);
        const data = await response.json();
        if (cancelled) return;

        setState({
          repos: Array.isArray(data.repos) ? data.repos : [],
          articles: Array.isArray(data.articles) ? data.articles : [],
          linkedInPosts: Array.isArray(data.linkedinPosts) ? data.linkedinPosts : [],
          githubStats: data.githubStats ?? null,
          lastUpdated: data.lastUpdated ?? null,
          isLoading: false,
        });
      } catch (error) {
        if (cancelled) return;
        setState({ ...INITIAL_STATE, isLoading: false });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

export function prioritizeRepos(
  repos: Repository[],
  stats: GitHubStats | null,
  limit = 6,
): Repository[] {
  if (!stats?.pinnedRepos?.length) {
    return [...repos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, limit);
  }

  const pinnedNames = new Set(stats.pinnedRepos.map((p) => p.name));
  const pinned: Repository[] = [];
  const rest: Repository[] = [];

  for (const repo of repos) {
    if (pinnedNames.has(repo.name)) pinned.push(repo);
    else rest.push(repo);
  }

  rest.sort((a, b) => b.stargazers_count - a.stargazers_count);
  return [...pinned, ...rest].slice(0, limit);
}
