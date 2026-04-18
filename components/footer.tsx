"use client";

import Link from "next/link";
import { siteConfig } from "@/src/config/siteConfig";
import { Github, Linkedin } from "lucide-react";

const STACK = [
  "PYTHON",
  "TYPESCRIPT",
  "NEXT.JS",
  "FASTAPI",
  "LANGCHAIN",
  "LANGGRAPH",
  "YOLO",
  "OPENCV",
  "POSTGRESQL",
  "PGVECTOR",
  "DOCKER",
  "JETSON",
  "MCP",
  "RAG",
  "EDGE AI",
  "DEEPSTREAM",
  "N8N",
  "HUGGING FACE",
  "RESEND",
  "VERCEL",
];

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  medium: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M2.846 6.887c.03-.295-.083-.586-.303-.784l-2.24-2.7v-.403h6.958l5.378 11.795 4.728-11.795h6.633v.403l-1.916 1.837c-.165.126-.247.333-.213.538v13.498c-.034.204.048.411.213.537l1.871 1.837v.403h-9.412v-.403l1.939-1.882c.19-.19.19-.246.19-.537v-10.91l-5.389 13.688h-.728l-6.275-13.688v9.174c-.052.385.076.774.347 1.052l2.521 3.058v.404h-7.148v-.404l2.521-3.058c.27-.279.39-.67.325-1.052v-10.608z" />
    </svg>
  ),
} as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule mt-24 bg-paper text-ink">
      {/* Stack marquee */}
      <div className="border-b border-rule py-3 overflow-hidden ticker-mask">
        <div className="flex gap-10 whitespace-nowrap animate-marquee-x">
          {[...STACK, ...STACK].map((s, i) => (
            <span
              key={`${s}-${i}`}
              className="font-mono text-[0.7rem] tracking-widest text-mute"
            >
              ◈ {s}
            </span>
          ))}
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="lab-container py-14 md:py-20 border-b border-rule">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7">
            <div className="meta mb-3">§ Colophon</div>
            <div className="display-xl leading-[0.9]">
              Let&apos;s <span className="not-italic font-light">build</span>{" "}
              something
            </div>
            <div className="display-xl leading-[0.9]">
              that <span className="lime-underline">matters</span>.
            </div>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-8 inline-flex items-center gap-2 meta-strong link-underline"
            >
              {siteConfig.email} →
            </a>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 gap-8 content-start">
            <div>
              <div className="meta mb-3">Directory</div>
              <ul className="space-y-1.5 text-sm">
                <li>
                  <Link href="/#projects" className="link-underline">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/#blog" className="link-underline">
                    Articles
                  </Link>
                </li>
                <li>
                  <Link href="/#insights" className="link-underline">
                    Insights
                  </Link>
                </li>
                <li>
                  <Link href="/#huggingface" className="link-underline">
                    HF Spaces
                  </Link>
                </li>
                <li>
                  <Link href="/#contact" className="link-underline">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="meta mb-3">Elsewhere</div>
              <ul className="space-y-1.5 text-sm">
                {siteConfig.socials.map((social) => {
                  const Icon =
                    socialIcons[social.icon as keyof typeof socialIcons];
                  return (
                    <li key={social.name}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline inline-flex items-center gap-2"
                      >
                        {Icon && <Icon className="h-3.5 w-3.5" />}
                        {social.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Colophon strip */}
      <div className="lab-container py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[0.7rem] font-mono tracking-widest uppercase text-mute">
        <span>
          © {year} · Baha Kızıl · Istanbul TR · All fieldnotes released under
          MIT
        </span>
        <span className="flex items-center gap-4">
          <span>
            set in{" "}
            <em className="not-italic font-display italic tracking-normal">
              Fraunces
            </em>{" "}
            &amp; Instrument Sans
          </span>
          <span>next.js 15 · vercel</span>
        </span>
      </div>
    </footer>
  );
}
