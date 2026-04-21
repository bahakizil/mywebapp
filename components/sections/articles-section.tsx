"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/src/components/Section";
import { SectionHeader } from "./section-header";
import type { MediumArticle } from "@/types/portfolio";

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "";
  return date
    .toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    })
    .toUpperCase();
}

function readTime(description: string) {
  const words = description?.split(/\s+/).length ?? 0;
  return Math.max(2, Math.round(words / 180));
}

function ArticleRow({
  article,
  index,
}: {
  article: MediumArticle;
  index: number;
}) {
  const id = `A-${String(index + 1).padStart(2, "0")}`;
  const thumbnail = article.thumbnail ?? article.image_url;
  const published = formatDate(article.publishedDate ?? article.pubDate);

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group grid grid-cols-12 gap-6 items-start py-8 border-b border-rule hover:border-ink transition-colors"
    >
      <div className="col-span-12 md:col-span-1 flex md:block items-baseline justify-between gap-2">
        <span className="meta-strong">[{id}]</span>
        <span className="meta md:block md:mt-2">
          {readTime(article.description)} min
        </span>
      </div>

      <div className="col-span-12 md:col-span-6 space-y-3">
        <h3 className="display-md transition-transform duration-500 ease-smooth-out group-hover:-translate-x-1">
          {article.title}
        </h3>
        {article.description && (
          <p className="text-sm md:text-base text-mute leading-relaxed max-w-xl line-clamp-2">
            {article.description}
          </p>
        )}
        {(article.categories?.length ?? 0) > 0 && (
          <ul className="flex flex-wrap gap-x-3 gap-y-1 pt-1">
            {article.categories.slice(0, 4).map((c) => (
              <li
                key={c}
                className="font-mono text-[0.62rem] tracking-widest uppercase text-mute"
              >
                ◈ {c}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="col-span-8 md:col-span-3">
        {thumbnail && (
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-rule bg-card">
            <Image
              src={thumbnail}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 60vw, 20vw"
              className="object-cover"
              unoptimized
            />
          </div>
        )}
      </div>

      <div className="col-span-4 md:col-span-2 flex flex-col items-end justify-between h-full text-right">
        <span className="meta">{published}</span>
        <span className="mt-6 md:mt-0 inline-flex items-center gap-1 meta-strong">
          read <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
    </a>
  );
}

interface ArticlesSectionProps {
  articles: MediumArticle[];
  isLoading: boolean;
}

export function ArticlesSection({ articles, isLoading }: ArticlesSectionProps) {
  return (
    <Section id="blog" className="!min-h-0 cv-section">
      <div className="lab-container w-full">
        <SectionHeader
          index="02"
          kicker="Writing"
          title={
            <>
              Notes I&apos;ve published on the way — <em>Medium dispatches</em>.
            </>
          }
          lede="Fresh from medium.com/@bahakizil via RSS. Traffic YOLO, fire & smoke detectors, and the practical side of agent engineering."
          count={articles.length}
        />

        <div className="border-t border-ink/90">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-6 py-8 border-b border-rule animate-pulse"
                >
                  <div className="col-span-1 h-4 bg-rule" />
                  <div className="col-span-6 space-y-2">
                    <div className="h-8 bg-rule/60 w-3/4" />
                    <div className="h-4 bg-rule/40 w-full" />
                  </div>
                  <div className="col-span-3 aspect-[4/3] bg-rule" />
                  <div className="col-span-2 h-4 bg-rule" />
                </div>
              ))
            : articles
                .slice(0, 6)
                .map((article, i) => (
                  <ArticleRow key={article.link} article={article} index={i} />
                ))}
        </div>

        {!isLoading && articles.length === 0 && (
          <p className="py-12 text-center text-mute">
            No articles indexed yet.
          </p>
        )}
      </div>
    </Section>
  );
}
