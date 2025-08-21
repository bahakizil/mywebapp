import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Security token for manual refresh (you can change this)
const REFRESH_TOKEN = process.env.DATA_REFRESH_TOKEN || 'your-secret-token-here';

interface PortfolioData {
  lastUpdated: string;
  repos: any[];
  articles: any[];
  linkedinPosts: any[];
}

async function fetchGitHubRepos(): Promise<any[]> {
  try {
    const response = await fetch('https://api.github.com/users/bahakizil/repos?sort=updated&per_page=20', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-App',
        ...(process.env.GITHUB_API_TOKEN && {
          'Authorization': `token ${process.env.GITHUB_API_TOKEN}`
        })
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();
    return repos.filter((repo: any) => !repo.fork && repo.stargazers_count > 0);
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return [];
  }
}

async function fetchMediumArticles(): Promise<any[]> {
  try {
    const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@bahakizil');
    
    if (!response.ok) {
      throw new Error(`Medium API error: ${response.status}`);
    }

    const data = await response.json();
    return data.items?.slice(0, 10) || [];
  } catch (error) {
    console.error('Error fetching Medium articles:', error);
    return [];
  }
}

async function fetchLinkedInPosts(): Promise<any[]> {
  // For now, return static data since LinkedIn API requires complex OAuth
  // You can implement proper LinkedIn API here if needed
  return [
    {
      id: "manual-refresh-" + Date.now(),
      text: "Excited to share updates on AI engineering and computer vision projects!",
      date: new Date().toISOString(),
      likes: 0,
      comments: 0,
      url: "https://linkedin.com/in/bahakizil"
    }
  ];
}

export async function POST(request: NextRequest) {
  try {
    // Check for authorization token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token || token !== REFRESH_TOKEN) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid or missing token.' },
        { status: 401 }
      );
    }

    console.log('🔄 Starting manual data refresh...');
    
    // Fetch all data in parallel
    const [repos, articles, linkedinPosts] = await Promise.all([
      fetchGitHubRepos(),
      fetchMediumArticles(),
      fetchLinkedInPosts()
    ]);

    // Prepare the data
    const portfolioData: PortfolioData = {
      lastUpdated: new Date().toISOString(),
      repos: repos,
      articles: articles,
      linkedinPosts: linkedinPosts
    };

    // Ensure data directory exists
    const dataDir = join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }

    // Write to file
    const dataFile = join(dataDir, 'portfolio-data.json');
    writeFileSync(dataFile, JSON.stringify(portfolioData, null, 2), 'utf8');

    console.log('✅ Data refresh completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Data refreshed successfully',
      timestamp: portfolioData.lastUpdated,
      counts: {
        repos: repos.length,
        articles: articles.length,
        linkedinPosts: linkedinPosts.length
      }
    });

  } catch (error) {
    console.error('❌ Error during data refresh:', error);
    return NextResponse.json(
      { error: 'Failed to refresh data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}