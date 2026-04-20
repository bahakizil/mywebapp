"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, GitFork, Star } from "lucide-react";
import { Section } from "@/src/components/Section";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "./section-header";
import type { Repository } from "@/types/portfolio";

const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  "Jupyter Notebook": "#DA5B0B",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Shell: "#89E051",
  Go: "#00ADD8",
  Rust: "#DEA584",
  Java: "#B07219",
};

const OWNER = "bahakizil";

function ghPreview(name: string) {
  return `https://opengraph.githubassets.com/${encodeURIComponent(
    name,
  )}/${OWNER}/${name}`;
}

function humanize(name: string) {
  return name.replace(/[-_]/g, " ");
}

function RepoCard({ repo, index }: { repo: Repository; index: number }) {
  const color = repo.language
    ? LANGUAGE_COLORS[repo.language] ?? "#7a7467"
    : "#7a7467";
  const id = `P-${String(index + 1).padStart(2, "0")}`;
  const topics = (repo.topics ?? []).slice(0, 3);

  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.7,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="invert-card group flex flex-col border border-ink/90 bg-paper text-ink"
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-current">
        <span className="meta-strong">[{id}]</span>
        <span className="meta">{new Date(repo.updated_at).getFullYear()}</span>
      </div>

      <div className="relative aspect-[1200/600] w-full overflow-hidden border-b border-current">
        <Image
          src={ghPreview(repo.name)}
          alt={`${humanize(repo.name)} preview`}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <h3 className="display-md capitalize line-clamp-2">
          {humanize(repo.name)}
        </h3>

        {repo.description && (
          <p className="text-sm leading-relaxed line-clamp-3">
            {repo.description}
          </p>
        )}

        {topics.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {topics.map((t) => (
              <li
                key={t}
                className="font-mono text-[0.62rem] tracking-widest uppercase px-2 py-1 border border-current"
              >
                {t}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-current font-mono text-[0.65rem] tracking-widest uppercase">
          <span className="flex items-center gap-3">
            {repo.language && (
              <span className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: color }}
                  aria-hidden
                />
                {repo.language}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3" /> {repo.stargazers_count}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="h-3 w-3" /> {repo.forks_count}
            </span>
          </span>
          <span className="card-accent inline-flex items-center gap-1 opacity-0 translate-x-[-4px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            open <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </motion.a>
  );
}

function RepoSkeleton() {
  return (
    <div className="border border-ink/20 bg-paper flex flex-col">
      <div className="h-9 border-b border-ink/10" />
      <Skeleton className="aspect-[1200/600] w-full" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

interface ProjectsSectionProps {
  repos: Repository[];
  isLoading: boolean;
}

export function ProjectsSection({ repos, isLoading }: ProjectsSectionProps) {
  const visible = repos.slice(0, 6);

  return (
    <Section id="projects" className="!min-h-0 cv-section">
      <div className="lab-container w-full">
        <SectionHeader
          index="01"
          kicker="Fieldwork"
          title={
            <>
              Shipped systems — from{" "}
              <span className="lime-underline">CCTV vision</span> to{" "}
              <span className="italic">LLM agents</span>.
            </>
          }
          lede="Repositories I actively maintain. Every one is open-source, every one shipped to real users or embedded hardware. Star counts refresh daily via a GitHub Actions cron job."
          count={repos.length}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/90 border border-ink/90">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-paper">
                  <RepoSkeleton />
                </div>
              ))
            : visible.map((repo, i) => (
                <RepoCard key={repo.id} repo={repo} index={i} />
              ))}
        </div>

        {!isLoading && repos.length > visible.length && (
          <div className="mt-6 flex justify-end">
            <a
              href={`https://github.com/${OWNER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline font-mono text-xs tracking-widest uppercase"
            >
              All {repos.length} repos on GitHub →
            </a>
          </div>
        )}
      </div>
    </Section>
  );
}
