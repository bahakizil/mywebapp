"use client";

import dynamic from "next/dynamic";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ArticlesSection } from "@/components/sections/articles-section";
import { InsightsSection } from "@/components/sections/insights-section";
import { ContactFormSection } from "@/components/contact-form-section";
import { usePortfolioData, prioritizeRepos } from "@/hooks/use-portfolio-data";

const HuggingFaceSpacesSection = dynamic(
  () => import("@/components/HuggingFaceSpacesSection"),
  { ssr: false },
);

export default function Home() {
  const { repos, articles, linkedInPosts, githubStats, isLoading } =
    usePortfolioData();
  const prioritizedRepos = prioritizeRepos(repos, githubStats);

  return (
    <>
      <HeroSection />
      <ProjectsSection repos={prioritizedRepos} isLoading={isLoading} />
      <ArticlesSection articles={articles} isLoading={isLoading} />
      <InsightsSection posts={linkedInPosts} isLoading={isLoading} />
      <HuggingFaceSpacesSection />
      <ContactFormSection />
    </>
  );
}
