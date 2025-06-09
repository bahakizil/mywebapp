import useSWR from 'swr';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function MediumFeed() {
  const { data: articles, error } = useSWR('/api/medium', fetcher);

  if (error) return <div>Failed to load articles</div>;
  if (!articles) return <div>Loading articles...</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article: any) => (
        <Card key={article.link} className="overflow-hidden group">
          <div className="aspect-video relative">
            {article.thumbnail && (
              <Image
                src={article.thumbnail}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary">Medium</Badge>
              <span className="text-sm text-muted-foreground">
                {new Date(article.pubDate).toLocaleDateString()}
              </span>
            </div>
            <h3 className="font-bold mb-2 line-clamp-2">{article.title}</h3>
            <div
              className="text-muted-foreground text-sm mb-4 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium flex items-center hover:underline"
            >
              Read on Medium <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </div>
        </Card>
      ))}
    </div>
  );
}