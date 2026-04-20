"use client";

import { Command } from "cmdk";
import {
  ArrowUpRight,
  Download,
  Github,
  Linkedin,
  Mail,
  Search,
  Terminal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { siteConfig } from "@/src/config/siteConfig";

const SECTIONS = [
  { id: "hero", label: "Home", tag: "§ 00" },
  { id: "projects", label: "Work · Featured projects", tag: "§ 01" },
  { id: "blog", label: "Writing · Medium dispatches", tag: "§ 02" },
  { id: "insights", label: "Signal · LinkedIn insights", tag: "§ 03" },
  { id: "huggingface", label: "Demos · Hugging Face Spaces", tag: "§ 04" },
  { id: "contact", label: "Contact · send a note", tag: "§ 05" },
];

const EXTERNAL = [
  { label: "GitHub · @bahakizil", href: siteConfig.links.github, Icon: Github },
  {
    label: "LinkedIn · in/bahakizil",
    href: siteConfig.links.linkedin,
    Icon: Linkedin,
  },
  {
    label: "Medium · @bahakizil",
    href: siteConfig.links.medium,
    Icon: Terminal,
  },
  {
    label: "Hugging Face · bahakizil",
    href: siteConfig.links.huggingface,
    Icon: Terminal,
  },
];

const ACTIONS = [
  {
    label: "Send email",
    href: `mailto:${siteConfig.email}`,
    Icon: Mail,
    hint: "mailto",
  },
  {
    label: "Download CV (pdf)",
    href: "/api/download-cv",
    Icon: Download,
    hint: "download",
    download: true,
  },
  {
    label: "About · long-form",
    href: "/about",
    Icon: ArrowUpRight,
    hint: "page",
  },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!mounted || !open) return null;

  const close = () => setOpen(false);

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[12vh] bg-ink/30"
      onClick={close}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-lg border border-ink bg-paper text-ink shadow-[0_20px_60px_-20px_hsl(var(--ink)/0.45)]"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Site navigation" loop>
          <div className="flex items-center justify-between px-4 py-2 border-b border-rule bg-card">
            <span className="section-index">§ console · ⌘K</span>
            <span className="meta">esc to close</span>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 border-b border-rule">
            <Search className="h-4 w-4 text-mute" aria-hidden />
            <Command.Input
              placeholder="Jump to a section, find a link…"
              className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-mute/70"
              autoFocus
            />
          </div>

          <Command.List className="max-h-[60vh] overflow-y-auto py-2">
            <Command.Empty className="px-4 py-8 text-center text-mute">
              No matches. Try &quot;projects&quot; or &quot;writing&quot;.
            </Command.Empty>

            <Command.Group heading="Navigate">
              {SECTIONS.map((s) => (
                <Command.Item
                  key={s.id}
                  value={`${s.label} ${s.tag}`}
                  onSelect={() => {
                    close();
                    scrollToSection(s.id);
                  }}
                  className="flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm aria-selected:bg-ink aria-selected:text-paper"
                >
                  <span className="flex items-baseline gap-3">
                    <span className="font-mono text-[0.62rem] tracking-widest uppercase opacity-60">
                      {s.tag}
                    </span>
                    <span>{s.label}</span>
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-50" />
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Actions">
              {ACTIONS.map((a) => (
                <Command.Item
                  key={a.label}
                  value={a.label}
                  onSelect={() => {
                    close();
                    if (a.download) {
                      const link = document.createElement("a");
                      link.href = a.href;
                      link.download = "";
                      link.click();
                    } else {
                      window.location.href = a.href;
                    }
                  }}
                  className="flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm aria-selected:bg-ink aria-selected:text-paper"
                >
                  <span className="flex items-center gap-3">
                    <a.Icon className="h-3.5 w-3.5" aria-hidden />
                    {a.label}
                  </span>
                  <span className="font-mono text-[0.6rem] tracking-widest uppercase opacity-60">
                    {a.hint}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Elsewhere">
              {EXTERNAL.map((link) => (
                <Command.Item
                  key={link.href}
                  value={link.label}
                  onSelect={() => {
                    close();
                    window.open(link.href, "_blank", "noopener,noreferrer");
                  }}
                  className="flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm aria-selected:bg-ink aria-selected:text-paper"
                >
                  <span className="flex items-center gap-3">
                    <link.Icon className="h-3.5 w-3.5" aria-hidden />
                    {link.label}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-50" />
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          <div className="flex items-center justify-between px-4 py-2 border-t border-rule bg-card meta">
            <span>navigate ↑↓ · open ↵</span>
            <span>⌘K · ctrl+K</span>
          </div>
        </Command>
      </div>
    </div>,
    document.body,
  );
}

/** Discrete ⌘K hint you can drop anywhere (footer, navbar). */
export function CommandHint() {
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[0.62rem] tracking-widest uppercase text-mute">
      press
      <kbd className="px-1.5 py-0.5 border border-rule text-ink">⌘K</kbd>
      to navigate
    </span>
  );
}
