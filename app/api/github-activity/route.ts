import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';
export const revalidate = 3600; // 1 hour cache

interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    id: number;
    login: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: any;
  public: boolean;
  created_at: string;
}

interface ActivityData {
  totalEvents: number;
  recentEvents: GitHubEvent[];
  eventsByType: Record<string, number>;
  activityCalendar: Record<string, number>;
  repositories: Record<string, number>;
}

export async function GET() {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    const githubUsername = process.env.GITHUB_USERNAME || 'bahakizil';

    if (!githubToken) {
      // Return mock activity data
      return NextResponse.json(getMockActivityData(), {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=1800'
        }
      });
    }

    // Fetch recent events
    const eventsResponse = await fetch(`https://api.github.com/users/${githubUsername}/events?per_page=100`, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-App'
      }
    });

    if (!eventsResponse.ok) {
      throw new Error(`GitHub API error: ${eventsResponse.status}`);
    }

    const events: GitHubEvent[] = await eventsResponse.json();
    
    // Process events for activity data
    const activityData = processActivityData(events);
    
    return NextResponse.json(activityData, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=1800'
      }
    });

  } catch (error) {
    console.error('Error fetching GitHub activity:', error);
    return NextResponse.json(getMockActivityData(), {
      headers: {
        'Cache-Control': 'public, max-age=300'
      }
    });
  }
}

function processActivityData(events: GitHubEvent[]): ActivityData {
  const eventsByType: Record<string, number> = {};
  const activityCalendar: Record<string, number> = {};
  const repositories: Record<string, number> = {};

  // Process last 30 days for calendar
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  events.forEach(event => {
    const eventDate = new Date(event.created_at);
    const dateKey = eventDate.toISOString().split('T')[0];
    
    // Count by event type
    eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
    
    // Count by date (last 30 days)
    if (eventDate > thirtyDaysAgo) {
      activityCalendar[dateKey] = (activityCalendar[dateKey] || 0) + 1;
    }
    
    // Count by repository
    if (event.repo) {
      repositories[event.repo.name] = (repositories[event.repo.name] || 0) + 1;
    }
  });

  return {
    totalEvents: events.length,
    recentEvents: events.slice(0, 10),
    eventsByType,
    activityCalendar,
    repositories
  };
}

function getMockActivityData(): ActivityData {
  try {
    // Try to read GitHub stats from portfolio data
    const dataFile = join(process.cwd(), 'data', 'portfolio-data.json');
    
    if (existsSync(dataFile)) {
      const portfolioData = JSON.parse(readFileSync(dataFile, 'utf8'));
      const githubStats = portfolioData.githubStats;
      
      if (githubStats) {
        // Use real contribution data
        const activityCalendar = generateActivityCalendar(githubStats.contributionChart.weeklyData);
        
        // Create repository activity from pinned repos
        const repositories: Record<string, number> = {};
        githubStats.pinnedRepos.forEach((repo: any, index: number) => {
          repositories[`bahakizil/${repo.name}`] = Math.max(1, 15 - index * 2);
        });
        
        return {
          totalEvents: githubStats.contributionChart.totalContributions || 142,
          recentEvents: [],
          eventsByType: {
            'PushEvent': 52,
            'CreateEvent': 18,
            'WatchEvent': 12,
            'IssuesEvent': 8,
            'PullRequestEvent': 6
          },
          activityCalendar,
          repositories
        };
      }
    }
  } catch (error) {
    console.error('Error reading GitHub stats from portfolio data:', error);
  }
  
  // Fallback to original mock data
  const now = new Date();
  const mockCalendar: Record<string, number> = {};
  
  // Generate mock calendar data for last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    mockCalendar[dateKey] = Math.floor(Math.random() * 5);
  }

  return {
    totalEvents: 47,
    recentEvents: [],
    eventsByType: {
      'PushEvent': 25,
      'CreateEvent': 8,
      'WatchEvent': 7,
      'IssuesEvent': 4,
      'PullRequestEvent': 3
    },
    activityCalendar: mockCalendar,
    repositories: {
      'bahakizil/Smart-Traffic-Analysis-With-Yolo': 12,
      'bahakizil/Vehicle_Detection': 8,
      'bahakizil/ThreatDetection': 6,
      'bahakizil/FireDetection': 5,
      'bahakizil/Gun_Detection_Agent': 4
    }
  };
}

function generateActivityCalendar(weeklyData: number[]): Record<string, number> {
  const calendar: Record<string, number> = {};
  const today = new Date();
  
  // Generate last 21 days (3 weeks) of activity data
  for (let i = 20; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Use weekly data with some variation
    const weekIndex = Math.floor(i / 7);
    const baseValue = weeklyData[weekIndex] || 0;
    const variation = Math.floor(Math.random() * 3) - 1; // Add some daily variation (-1 to +1)
    calendar[dateStr] = Math.max(0, Math.min(4, Math.floor(baseValue / 5) + variation)); // Scale to 0-4 range
  }
  
  return calendar;
}