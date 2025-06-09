const GITHUB_API_URL = 'https://api.github.com';

export interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  homepage: string | null;
  private: boolean;
  fork?: boolean;
}

// Mock repositories (fallback data) - Updated with user's actual repositories
const mockRepositories: Repository[] = [
  {
    id: 1,
    name: "Smart-Traffic-Analysis-With-Yolo",
    description: "Smart Traffic Monitoring: Real-Time CCTV Analysis with YOLOv12N",
    html_url: "https://github.com/bahakizil/Smart-Traffic-Analysis-With-Yolo",
    stargazers_count: 24,
    forks_count: 9,
    language: "Python",
    topics: ["yolo", "traffic-analysis", "computer-vision", "cctv", "real-time", "monitoring"],
    updated_at: "2024-05-22T11:30:00Z",
    homepage: null,
    private: false
  },
  {
    id: 2,
    name: "Vehicle_Detection",
    description: "Fine-tuned YOLOv12N for vehicle detection from CCTV with Gradio interface",
    html_url: "https://github.com/bahakizil/Vehicle_Detection",
    stargazers_count: 19,
    forks_count: 8,
    language: "Python",
    topics: ["vehicle-detection", "yolo", "computer-vision", "gradio", "fine-tuning", "cctv"],
    updated_at: "2024-05-20T10:30:00Z",
    homepage: null,
    private: false
  },
  {
    id: 3,
    name: "ThreatDetection",
    description: "Deepseek 1.5B LLM with fine-tuned YOLO11 to detect guns and analyze the danger.",
    html_url: "https://github.com/bahakizil/ThreatDetection",
    stargazers_count: 4,
    forks_count: 0,
    language: "Python",
    topics: ["threat-detection", "gun-detection", "yolo", "llm", "deepseek", "security"],
    updated_at: "2024-05-18T14:45:00Z",
    homepage: null,
    private: false
  },
  {
    id: 4,
    name: "FireDetection",
    description: "Fire detection with fine tuned Yolov12n",
    html_url: "https://github.com/bahakizil/FireDetection",
    stargazers_count: 4,
    forks_count: 1,
    language: "Python",
    topics: ["fire-detection", "yolo", "computer-vision", "safety", "fine-tuning"],
    updated_at: "2024-05-19T16:20:00Z",
    homepage: null,
    private: false
  },
  {
    id: 5,
    name: "Gun_Detection_Agent",
    description: "YOLO object detection model into a LangChain tool",
    html_url: "https://github.com/bahakizil/Gun_Detection_Agent",
    stargazers_count: 3,
    forks_count: 1,
    language: "Python",
    topics: ["gun-detection", "yolo", "langchain", "object-detection", "agent", "security"],
    updated_at: "2024-05-15T16:20:00Z",
    homepage: null,
    private: false
  },
  {
    id: 6,
    name: "deepstream-pipeline",
    description: "DeepStream pipeline for real-time video analytics",
    html_url: "https://github.com/bahakizil/deepstream-pipeline",
    stargazers_count: 1,
    forks_count: 0,
    language: "Python",
    topics: ["deepstream", "video-analytics", "nvidia", "real-time", "pipeline"],
    updated_at: "2024-05-17T09:15:00Z",
    homepage: null,
    private: false
  }
];

export async function getRepos(): Promise<Repository[]> {
  const githubToken = process.env.GITHUB_TOKEN;
  const githubUsername = process.env.GITHUB_USERNAME;

  if (!githubToken || !githubUsername) {
    console.log('No GitHub API token or username provided, returning mock data');
    return mockRepositories;
  }

  try {
    // Fetch more repositories to get a better selection
    const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-App'
      },
      // Cache for 24 hours in production, no cache in development
      next: {
        revalidate: process.env.NODE_ENV === 'production' ? 86400 : 0
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const repos: Repository[] = await response.json();
    
    // Filter out private repos, forks, and sort by stars descending
    const publicRepos = repos
      .filter(repo => !repo.private && !repo.fork) // Exclude private repos and forks
      .sort((a, b) => {
        // Primary sort: by stars (descending)
        if (b.stargazers_count !== a.stargazers_count) {
          return b.stargazers_count - a.stargazers_count;
        }
        // Secondary sort: by update date (most recent first)
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      })
      .slice(0, 6); // Limit to 6 repositories

    console.log(`Fetched ${publicRepos.length} repositories from GitHub API`);
    return publicRepos.length > 0 ? publicRepos : mockRepositories;

  } catch (error) {
    console.error('Error fetching repositories from GitHub:', error);
    console.log('Falling back to mock data');
    return mockRepositories;
  }
} 