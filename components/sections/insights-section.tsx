"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/src/components/Section";
import { SectionHeader } from "./section-header";
import type { LinkedInPost } from "@/types/portfolio";

function formatDate(value?: string) {
  if (!value) return "recently";
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "recently";
  return date
    .toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    })
    .toUpperCase();
}

function InsightCard({
  post,
  index,
}: {
  post: LinkedInPost;
  index: number;
}) {
  const id = `I-${String(index + 1).padStart(2, "0")}`;
  const likes = post.engagement?.likes ?? post.likes ?? 0;
  const comments = post.engagement?.comments ?? post.comments ?? 0;
  const shares = post.engagement?.shares ?? post.shares ?? 0;
  const published = formatDate(post.publishedAt || post.date);

  return (
    <motion.a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.6,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="invert-card group flex flex-col justify-between border border-ink/90 bg-paper text-ink p-5 min-h-[280px]"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="meta-strong">[{id}]</span>
        <span className="meta">{published}</span>
      </div>

      {post.image_url && (
        <div className="relative aspect-video w-full overflow-hidden border border-current mb-5">
          <Image
            src={post.image_url}
            alt={post.text?.slice(0, 50) ?? "LinkedIn post"}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      <p className="font-display italic text-xl leading-snug text-balance line-clamp-6 flex-1">
        <span className="card-accent text-ink">“</span>
        {(post.text || post.content || "Professional insight shared on LinkedIn.")
          .replace(/\n/g, " ")
          .slice(0, 240)}
        <span className="card-accent text-ink">”</span>
      </p>

      <div className="mt-6 pt-4 border-t border-current flex items-center justify-between font-mono text-[0.62rem] tracking-widest uppercase">
        <span className="flex items-center gap-3">
          <span>♡ {likes}</span>
          <span>✎ {comments}</span>
          {shares > 0 && <span>⇉ {shares}</span>}
        </span>
        <span className="card-accent inline-flex items-center gap-1 opacity-0 translate-x-[-4px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          read <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
    </motion.a>
  );
}

interface InsightsSectionProps {
  posts: LinkedInPost[];
  isLoading: boolean;
}

export function InsightsSection({ posts, isLoading }: InsightsSectionProps) {
  return (
    <Section id="insights" className="!min-h-0">
      <div className="lab-container w-full">
        <SectionHeader
          index="03"
          kicker="Broadcast"
          title={
            <>
              Short-form <em>signal</em> — curated from LinkedIn.
            </>
          }
          lede="Dispatches that landed: capstone projects, training experiments, certifications, client-facing wins. Engagement numbers are frozen at the time of posting."
          count={posts.length}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/90 border border-ink/90">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-paper min-h-[260px] p-5 flex flex-col justify-between animate-pulse"
                >
                  <div className="h-4 bg-rule w-1/3" />
                  <div className="space-y-2">
                    <div className="h-6 bg-rule w-full" />
                    <div className="h-6 bg-rule w-11/12" />
                    <div className="h-6 bg-rule w-3/4" />
                  </div>
                  <div className="h-4 bg-rule w-1/2" />
                </div>
              ))
            : posts
                .slice(0, 6)
                .map((post, i) => (
                  <InsightCard
                    key={post.id ?? post.url ?? i}
                    post={post}
                    index={i}
                  />
                ))}
        </div>

        {!isLoading && posts.length === 0 && (
          <p className="py-12 text-center text-mute">
            No insights indexed yet.
          </p>
        )}
      </div>
    </Section>
  );
}
