"use client";

import Link from "next/link";
import { siteConfig } from "@/src/config/siteConfig";
import { Github, Linkedin } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  medium: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M2.846 6.887c.03-.295-.083-.586-.303-.784l-2.24-2.7v-.403h6.958l5.378 11.795 4.728-11.795h6.633v.403l-1.916 1.837c-.165.126-.247.333-.213.538v13.498c-.034.204.048.411.213.537l1.871 1.837v.403h-9.412v-.403l1.939-1.882c.19-.19.19-.246.19-.537v-10.91l-5.389 13.688h-.728l-6.275-13.688v9.174c-.052.385.076.774.347 1.052l2.521 3.058v.404h-7.148v-.404l2.521-3.058c.27-.279.39-.67.325-1.052v-10.608z"/>
    </svg>
  ),
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background py-8">
      <ScrollReveal direction="up" delay={0.2}>
        <div className="container mx-auto px-4 md:px-6 max-w-7xl flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-mono text-lg font-bold">BAHA KIZIL</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {siteConfig.socials.map((social) => {
            const Icon = socialIcons[social.icon as keyof typeof socialIcons];
            return (
              <Link
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {Icon && <Icon className="h-5 w-5" />}
                <span className="sr-only">{social.name}</span>
              </Link>
            );
          })}
        </div>
        </div>
      </ScrollReveal>
    </footer>
  );
}