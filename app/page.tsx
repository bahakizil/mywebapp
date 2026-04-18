"use client";

import dynamic from "next/dynamic";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ArticlesSection } from "@/components/sections/articles-section";
import { InsightsSection } from "@/components/sections/insights-section";
import { usePortfolioData, prioritizeRepos } from "@/hooks/use-portfolio-data";
import { Section } from "@/src/components/Section";
import { ScrollProvider } from "@/src/providers/ScrollProvider";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionDivider } from "@/components/ui/section-divider";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import { ContactFormSection } from "@/components/contact-form-section";
import HuggingFaceSpacesSection from "@/components/HuggingFaceSpacesSection";

const AnimatedGradient = dynamic(
  () => import("@/components/ui/animated-gradient").then((mod) => ({ default: mod.AnimatedGradient })),
  { ssr: false },
);
const FloatingCards = dynamic(
  () => import("@/components/ui/floating-cards").then((mod) => ({ default: mod.FloatingCards })),
  { ssr: false },
);
const NavigationDots = dynamic(
  () => import("@/src/components/NavigationDots").then((mod) => ({ default: mod.NavigationDots })),
  { ssr: false },
);

export default function Home() {
  const { repos, articles, linkedInPosts, githubStats, isLoading } = usePortfolioData();
  const prioritizedRepos = prioritizeRepos(repos, githubStats);

  return (
    <ScrollProvider>
      <AnimatedGradient />
      <FloatingCards />
      <NavigationDots />

      <HeroSection />

      <ParallaxScroll speed={20} direction="up">
        <SectionDivider />
      </ParallaxScroll>

      <ProjectsSection repos={prioritizedRepos} isLoading={isLoading} />

      <ArticlesSection articles={articles} isLoading={isLoading} />

      <ParallaxScroll speed={30} direction="down">
        <SectionDivider />
      </ParallaxScroll>

      <InsightsSection posts={linkedInPosts} isLoading={isLoading} />

      <ParallaxScroll speed={25} direction="up">
        <SectionDivider />
      </ParallaxScroll>

      <Section id="huggingface">
        <ScrollReveal direction="up" delay={0.5}>
          <HuggingFaceSpacesSection />
        </ScrollReveal>
      </Section>

      <ParallaxScroll speed={35} direction="down">
        <SectionDivider />
      </ParallaxScroll>

      <Section id="contact">
        <ContactFormSection />
      </Section>
    </ScrollProvider>
  );
}
