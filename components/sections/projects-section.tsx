"use client";

import Image from "next/image";
import { ExternalLink, GitFork, Star } from "lucide-react";
import type { Repository } from "@/types/portfolio";
import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "@/src/components/Section";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178C6",
  JavaScript: "#F1E05A",
  Jupyter: "#DA5B0B",
  "Jupyter Notebook": "#DA5B0B",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Shell: "#89E051",
  Dockerfile: "#384D54",
  Go: "#00ADD8",
  Rust: "#DEA584",
  Java: "#B07219",
  Cpp: "#F34B7D",
  "C++": "#F34B7D",
  C: "#555555",
};

const GITHUB_OWNER = "bahakizil";

const githubOgImage = (name: string) =>
  `https://opengraph.githubassets.com/${encodeURIComponent(name)}/${GITHUB_OWNER}/${name}`;

interface ProjectsSectionProps {
  repos: Repository[];
  isLoading: boolean;
}

function humanize(name: string) {
  return name.replace(/[-_]/g, " ");
}

function RepoCard({ repo }: { repo: Repository }) {
  const color = repo.language ? LANGUAGE_COLORS[repo.language] ?? "#8B949E" : "#8B949E";
  const topics = (repo.topics ?? []).slice(0, 3);

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10"
    >
      <div className="relative aspect-[1200/600] w-full overflow-hidden bg-muted">
        <Image
          src={githubOgImage(repo.name)}
          alt={`${humanize(repo.name)} preview`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          unoptimized
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="font-semibold text-lg capitalize line-clamp-1 group-hover:text-primary transition-colors">
            {humanize(repo.name)}
          </h3>
          {repo.description && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {repo.description}
            </p>
          )}
        </div>

        {topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
              >
                {topic}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {repo.language && (
              <span className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                  aria-hidden
                />
                {repo.language}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5" /> {repo.stargazers_count}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="h-3.5 w-3.5" /> {repo.forks_count}
            </span>
          </div>
          <span className="flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100">
            View <ExternalLink className="h-3 w-3" />
          </span>
        </div>
      </div>
    </a>
  );
}

function RepoSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card">
      <Skeleton className="aspect-[1200/600] w-full" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-14" />
        </div>
      </div>
    </div>
  );
}

export function ProjectsSection({ repos, isLoading }: ProjectsSectionProps) {
  return (
    <Section id="projects">
      <div className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <ScrollReveal direction="up" delay={0.2}>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl leading-tight">
                Featured Projects {repos.length > 0 && `(${repos.length})`}
              </h2>
              <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
                A showcase of my latest work in AI engineering, computer vision, and machine learning.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <RepoSkeleton key={i} />)
              : repos.map((repo) => <RepoCard key={repo.id} repo={repo} />)}
          </div>

          {!isLoading && repos.length === 0 && (
            <p className="text-center py-12 text-muted-foreground">No projects found.</p>
          )}
        </div>
      </div>
    </Section>
  );
}
