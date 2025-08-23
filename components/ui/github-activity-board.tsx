"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Github, 
  GitCommit, 
  Star, 
  GitFork, 
  Calendar,
  Activity,
  Code,
  Plus,
  Eye,
  GitPullRequest,
  Bug
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityData {
  totalEvents: number;
  recentEvents: any[];
  eventsByType: Record<string, number>;
  activityCalendar: Record<string, number>;
  repositories: Record<string, number>;
  contributionChart: {
    totalContributions: number;
    currentStreak: number;
    weeklyData: number[];
    lastYearContributions: number;
  };
}

const getEventIcon = (eventType: string) => {
  switch (eventType) {
    case 'PushEvent':
      return <GitCommit className="h-3 w-3" />;
    case 'CreateEvent':
      return <Plus className="h-3 w-3" />;
    case 'WatchEvent':
      return <Star className="h-3 w-3" />;
    case 'ForkEvent':
      return <GitFork className="h-3 w-3" />;
    case 'PullRequestEvent':
      return <GitPullRequest className="h-3 w-3" />;
    case 'IssuesEvent':
      return <Bug className="h-3 w-3" />;
    default:
      return <Activity className="h-3 w-3" />;
  }
};

const getEventColor = (eventType: string) => {
  switch (eventType) {
    case 'PushEvent':
      return 'text-green-500';
    case 'CreateEvent':
      return 'text-blue-500';
    case 'WatchEvent':
      return 'text-yellow-500';
    case 'ForkEvent':
      return 'text-purple-500';
    case 'PullRequestEvent':
      return 'text-orange-500';
    case 'IssuesEvent':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

export function GitHubActivityBoard() {
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchActivityData() {
      try {
        const response = await fetch('/api/github-activity');
        const githubActivityData = await response.json();
        
        // Also fetch static data for contribution chart
        const staticResponse = await fetch('/api/static-data');
        const staticData = await staticResponse.json();
        
        const activityData: ActivityData = {
          totalEvents: githubActivityData.totalEvents,
          recentEvents: githubActivityData.recentEvents,
          eventsByType: githubActivityData.eventsByType,
          activityCalendar: githubActivityData.activityCalendar,
          repositories: githubActivityData.repositories,
          contributionChart: {
            totalContributions: staticData.githubStats?.contributionChart?.totalContributions || githubActivityData.totalEvents,
            currentStreak: staticData.githubStats?.contributionChart?.currentStreak || 7,
            weeklyData: staticData.githubStats?.contributionChart?.weeklyData || [],
            lastYearContributions: staticData.githubStats?.contributionChart?.totalContributions || githubActivityData.totalEvents
          }
        };
        setActivityData(activityData);
      } catch (error) {
        console.error('Failed to fetch GitHub activity:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchActivityData();
  }, []);

  if (isLoading) {
    return <ActivityBoardSkeleton />;
  }

  if (!activityData) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="border shadow-sm bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Github className="h-4 w-4 text-foreground" />
            <div>
              <CardTitle className="text-sm font-medium">GitHub Activity</CardTitle>
              <CardDescription className="text-xs">Recent contributions</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* GitHub Activity Chart */}
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{activityData.contributionChart.totalContributions}</div>
              <div className="text-xs text-muted-foreground">contributions this year</div>
            </div>
            
            {/* Contribution Grid */}
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Recent activity</div>
              <div className="grid grid-cols-7 gap-1">
                {activityData.contributionChart.weeklyData.slice(-21).map((count, index) => {
                  const intensity = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4;
                  const colors = [
                    'bg-muted/30', // No contributions
                    'bg-green-200 dark:bg-green-900/40', // Low
                    'bg-green-400 dark:bg-green-700/60', // Medium
                    'bg-green-600 dark:bg-green-600/80', // High
                    'bg-green-700 dark:bg-green-500' // Very high
                  ];
                  return (
                    <div
                      key={index}
                      className={cn(
                        'w-2.5 h-2.5 rounded-sm',
                        colors[intensity]
                      )}
                      title={`${count} contributions`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center p-2 bg-muted/20 rounded">
                <div className="font-semibold text-foreground">{activityData.contributionChart.currentStreak}</div>
                <div className="text-muted-foreground">day streak</div>
              </div>
              <div className="text-center p-2 bg-muted/20 rounded">
                <div className="font-semibold text-foreground">{Object.keys(activityData.repositories).length}</div>
                <div className="text-muted-foreground">repositories</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ActivityBoardSkeleton() {
  return (
    <div className="w-full max-w-md">
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Calendar Skeleton */}
          <div>
            <Skeleton className="h-3 w-24 mb-2" />
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 21 }).map((_, i) => (
                <Skeleton key={i} className="w-3 h-3 rounded-sm" />
              ))}
            </div>
          </div>

          {/* Events Skeleton */}
          <div>
            <Skeleton className="h-3 w-24 mb-2" />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3" />
                  <Skeleton className="h-3 w-12 flex-1" />
                  <Skeleton className="h-4 w-6" />
                </div>
              ))}
            </div>
          </div>

          {/* Repositories Skeleton */}
          <div>
            <Skeleton className="h-3 w-24 mb-2" />
            <div className="space-y-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3" />
                  <Skeleton className="h-3 w-20 flex-1" />
                  <Skeleton className="h-4 w-6" />
                </div>
              ))}
            </div>
          </div>

          {/* Footer Skeleton */}
          <div className="pt-2 border-t border-border">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}