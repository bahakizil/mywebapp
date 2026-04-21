"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Heart } from "lucide-react";
import { Section } from "@/src/components/Section";
import { SectionHeader } from "./sections/section-header";

interface HuggingFaceSpace {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  likes: number;
  url: string;
}

export default function HuggingFaceSpacesSection() {
  const [spaces, setSpaces] = useState<HuggingFaceSpace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/huggingface");
        const data = await res.json();
        if (!cancelled && Array.isArray(data.spaces)) {
          setSpaces(data.spaces);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalLikes = spaces.reduce((s, x) => s + x.likes, 0);

  return (
    <Section id="huggingface" className="!min-h-0 cv-section">
      <div className="lab-container w-full">
        <SectionHeader
          index="04"
          kicker="Apparatus"
          title={
            <>
              Public demos on <em className="lime-underline">Hugging Face</em>{" "}
              Spaces.
            </>
          }
          lede="Live apparatus: detection models, transcript tools, experimental agents — hosted and runnable on huggingface.co. Fed straight from the HF public API."
          count={spaces.length}
        />

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-ink/90 divide-x divide-rule mb-10">
          {[
            { k: "spaces live", v: loading ? "—" : spaces.length },
            { k: "cumulative ♡", v: loading ? "—" : totalLikes },
            {
              k: "categories",
              v: loading
                ? "—"
                : new Set(spaces.map((s) => s.category)).size,
            },
            { k: "runtime", v: "HF · Gradio" },
          ].map((s) => (
            <div
              key={s.k}
              className="px-4 py-5 md:px-6 md:py-6 first:pl-0 last:pr-0"
            >
              <div className="display-md leading-none tabular-nums">{s.v}</div>
              <div className="meta mt-2">{s.k}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/90 border border-ink/90">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-paper p-5 animate-pulse">
                <div className="h-4 bg-rule w-1/4 mb-4" />
                <div className="h-6 bg-rule w-2/3 mb-3" />
                <div className="h-4 bg-rule w-full mb-2" />
                <div className="h-4 bg-rule w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/90 border border-ink/90">
            {spaces.slice(0, 6).map((space, i) => {
              const id = `S-${String(i + 1).padStart(2, "0")}`;
              return (
                <a
                  key={space.id}
                  href={space.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="invert-card group bg-paper text-ink p-5 md:p-6 flex flex-col min-h-[220px]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="meta-strong">[{id}]</span>
                    <span className="meta">{space.category}</span>
                  </div>

                  <h3 className="display-md mb-3 line-clamp-2 capitalize">
                    {space.title}
                  </h3>

                  <p className="text-sm leading-relaxed line-clamp-3 mb-4">
                    {space.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-current flex items-center justify-between font-mono text-[0.62rem] tracking-widest uppercase">
                    <span className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" /> {space.likes}
                      </span>
                      <span>@{space.author}</span>
                    </span>
                    <span className="card-accent inline-flex items-center gap-1 opacity-0 translate-x-[-4px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                      launch <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </Section>
  );
}
