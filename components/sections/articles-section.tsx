"use client";

import Image from "next/image";
import { BookOpen, ExternalLink, Eye } from "lucide-react";
import type { MediumArticle } from "@/types/portfolio";
import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "@/src/components/Section";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface ArticlesSectionProps {
  articles: MediumArticle[];
  isLoading: boolean;
}

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ArticleCard({ article }: { article: MediumArticle }) {
  const thumbnail = article.thumbnail || article.image_url;
  const published = article.publishedDate || article.pubDate;

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10"
    >
      {thumbnail && (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={thumbnail}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            unoptimized
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Medium</span>
          {published && <span>{formatDate(published)}</span>}
        </div>
        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-green-600 transition-colors">
          {article.title}
        </h3>
        {article.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {article.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {article.claps > 0 && <span>👏 {article.claps.toLocaleString()}</span>}
            {article.reads && (
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" /> {article.reads.toLocaleString()}
              </span>
            )}
            {article.views && (
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" /> {article.views.toLocaleString()}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 text-green-600 opacity-0 transition-opacity group-hover:opacity-100">
            Read <ExternalLink className="h-3 w-3" />
          </span>
        </div>
      </div>
    </a>
  );
}

function ArticleSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card">
      <Skeleton className="aspect-video w-full" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}

export function ArticlesSection({ articles, isLoading }: ArticlesSectionProps) {
  return (
    <Section id="blog">
      <div className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <ScrollReveal direction="down" delay={0.3}>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl leading-tight">
                Latest Articles {articles.length > 0 && `(${articles.length})`}
              </h2>
              <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
                My thoughts and insights on AI engineering, computer vision, and related topics.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <ArticleSkeleton key={i} />)
              : articles.slice(0, 6).map((article) => (
                  <ArticleCard key={article.link} article={article} />
                ))}
          </div>

          {!isLoading && articles.length === 0 && (
            <p className="text-center py-12 text-muted-foreground">No articles found.</p>
          )}
        </div>
      </div>
    </Section>
  );
}
