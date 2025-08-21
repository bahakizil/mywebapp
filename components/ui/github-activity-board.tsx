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
        const data = await response.json();
        setActivityData(data);
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
      <Card className="overflow-hidden border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Github className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">GitHub Activity</CardTitle>
              <CardDescription className="text-xs">Last 30 days</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Activity Calendar */}
          <div>
            <h4 className="text-xs font-medium mb-2 text-muted-foreground">Contribution Activity</h4>
            <div className="grid grid-cols-7 gap-1">
              {Object.entries(activityData.activityCalendar)
                .slice(0, 21)
                .map(([date, count]) => {
                  const intensity = Math.min(count, 4); // Cap at 4 for visual consistency
                  return (
                    <motion.div
                      key={date}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: Math.random() * 0.5 }}
                      className={cn(
                        "w-3 h-3 rounded-sm transition-colors",
                        intensity === 0 && "bg-muted",
                        intensity === 1 && "bg-primary/30",
                        intensity === 2 && "bg-primary/50",
                        intensity === 3 && "bg-primary/70",
                        intensity >= 4 && "bg-primary"
                      )}
                      title={`${date}: ${count} contributions`}
                    />
                  );
                })}
            </div>
          </div>

          {/* Event Types */}
          <div>
            <h4 className="text-xs font-medium mb-2 text-muted-foreground">Activity Breakdown</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(activityData.eventsByType)
                .slice(0, 4)
                .map(([type, count]) => (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-xs"
                  >
                    <span className={cn("flex-shrink-0", getEventColor(type))}>
                      {getEventIcon(type)}
                    </span>
                    <span className="text-muted-foreground truncate">
                      {type.replace('Event', '')}
                    </span>
                    <Badge variant="secondary" className="text-xs px-1 py-0 h-4 ml-auto">
                      {count}
                    </Badge>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Top Repositories */}
          <div>
            <h4 className="text-xs font-medium mb-2 text-muted-foreground">Active Repositories</h4>
            <div className="space-y-1">
              {Object.entries(activityData.repositories)
                .slice(0, 3)
                .map(([repo, count]) => (
                  <motion.div
                    key={repo}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-xs"
                  >
                    <Code className="h-3 w-3 text-primary flex-shrink-0" />
                    <span className="text-foreground truncate">
                      {repo.split('/')[1] || repo}
                    </span>
                    <Badge variant="outline" className="text-xs px-1 py-0 h-4 ml-auto">
                      {count}
                    </Badge>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Stats Footer */}
          <div className="pt-2 border-t border-border">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                <span>{activityData.totalEvents} events</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Recent activity</span>
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