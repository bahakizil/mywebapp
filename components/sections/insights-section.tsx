"use client";

import Image from "next/image";
import { ExternalLink, Heart, Linkedin, MessagesSquare, Share2 } from "lucide-react";
import type { LinkedInPost } from "@/types/portfolio";
import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "@/src/components/Section";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface InsightsSectionProps {
  posts: LinkedInPost[];
  isLoading: boolean;
}

function formatDate(value?: string) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "Recently";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function PostCard({ post }: { post: LinkedInPost }) {
  const likes = post.engagement?.likes ?? post.likes ?? 0;
  const comments = post.engagement?.comments ?? post.comments ?? 0;
  const shares = post.engagement?.shares ?? post.shares ?? 0;
  const published = post.publishedAt || post.date;

  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10"
    >
      {post.image_url && (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={post.image_url}
            alt={post.text?.slice(0, 60) ?? "LinkedIn post"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            unoptimized
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 text-blue-600">
            <Linkedin className="h-3.5 w-3.5" /> LinkedIn
          </span>
          <span>{formatDate(published)}</span>
        </div>

        <p className="text-sm leading-relaxed text-foreground line-clamp-4">
          {post.text || post.content || "Professional insight shared on LinkedIn."}
        </p>

        <div className="mt-auto flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" /> {likes}
            </span>
            <span className="flex items-center gap-1">
              <MessagesSquare className="h-3.5 w-3.5" /> {comments}
            </span>
            {shares > 0 && (
              <span className="flex items-center gap-1">
                <Share2 className="h-3.5 w-3.5" /> {shares}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
            View <ExternalLink className="h-3 w-3" />
          </span>
        </div>
      </div>
    </a>
  );
}

function PostSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card">
      <Skeleton className="aspect-video w-full" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}

export function InsightsSection({ posts, isLoading }: InsightsSectionProps) {
  return (
    <Section id="insights">
      <div className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <ScrollReveal direction="right" delay={0.4}>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Latest Insights {posts.length > 0 && `(${posts.length})`}
              </h2>
              <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
                Professional insights and thoughts from my LinkedIn posts.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <PostSkeleton key={i} />)
              : posts.slice(0, 12).map((post, index) => (
                  <PostCard key={post.id ?? post.url ?? index} post={post} />
                ))}
          </div>

          {!isLoading && posts.length === 0 && (
            <p className="text-center py-12 text-muted-foreground">No insights yet.</p>
          )}
        </div>
      </div>
    </Section>
  );
}
