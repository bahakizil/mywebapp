import useSWR from 'swr';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function RepoFeed() {
  const { data: repos, error } = useSWR('/api/repos', fetcher);

  if (error) return <div>Failed to load repositories</div>;
  if (!repos) return <div>Loading repositories...</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {repos.map((repo: any) => (
        <Card key={repo.name} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{repo.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">⭐ {repo.stargazers_count}</span>
              <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                {repo.language}
              </span>
            </div>
          </div>
          <div className="prose prose-sm dark:prose-invert mb-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
            >
              {repo.description}
            </ReactMarkdown>
          </div>
          <Link
            href={`/projects/${repo.name}`}
            className="text-primary font-medium flex items-center hover:underline"
          >
            Read more <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Card>
      ))}
    </div>
  );
}