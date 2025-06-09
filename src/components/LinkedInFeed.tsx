import useSWR from 'swr';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExternalLink, Linkedin } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function LinkedInFeed() {
  const { data: posts, error } = useSWR('/api/linkedin', fetcher);

  if (error) return <div>Failed to load LinkedIn posts</div>;
  if (!posts) return <div>Loading posts...</div>;

  return (
    <div className="space-y-6">
      {posts.map((post: any) => (
        <Card key={post.createdTime} className="p-6">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/avatar.jpg" alt="Profile" />
              <AvatarFallback>
                <Linkedin className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">AI Engineer</h3>
                <span className="text-sm text-muted-foreground">
                  {new Date(post.createdTime).toLocaleDateString()}
                </span>
              </div>
              <p className="text-muted-foreground mb-4">{post.text}</p>
              {post.mediaUrl && (
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                  <Image
                    src={post.mediaUrl}
                    alt="Post media"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <a
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium flex items-center hover:underline"
              >
                View on LinkedIn <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}