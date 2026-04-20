export interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage?: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
}

export interface MediumArticle {
  title: string;
  subtitle?: string;
  link: string;
  publishedDate?: string;
  pubDate?: string;
  description: string;
  thumbnail?: string;
  image_url?: string;
  categories: string[];
  content?: string;
  views?: number;
  reads?: number;
  claps: number;
  responses?: number;
}

export interface LinkedInPost {
  id?: string;
  text?: string;
  content?: string;
  date?: string;
  publishedAt?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
  url: string;
  image_url?: string;
}

export interface PinnedRepo {
  name: string;
  description: string;
  stars: number;
  language: string;
}

export interface ContributionChart {
  totalContributions: number;
  currentStreak: number;
  weeklyData: number[];
  lastYearContributions: number;
}

export interface ContributionDay {
  date: string;
  count: number;
  color: string;
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface GitHubStats {
  pinnedRepos: PinnedRepo[];
  contributionChart: ContributionChart | null;
  calendar?: ContributionCalendar | null;
}

export interface PortfolioData {
  lastUpdated: string;
  repos: Repository[];
  articles: MediumArticle[];
  linkedinPosts: LinkedInPost[];
  githubStats: GitHubStats | null;
}
