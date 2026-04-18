"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/src/components/Section";
import { SectionHeader } from "./sections/section-header";

export function ContactFormSection() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      setError("Every field is required.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        const data = await res.json();
        setError(data.error ?? "Delivery failed. Try email directly.");
      }
    } catch {
      setError("Transport error. Reach out via email.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section id="contact" className="!min-h-0">
      <div className="lab-container w-full">
        <SectionHeader
          index="05"
          kicker="Correspondence"
          title={
            <>
              Send a note. <em>I read everything.</em>
            </>
          }
          lede="Currently accepting AI engineering consulting and collaboration requests. Replies within 48h on weekdays from Istanbul."
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-16">
          {/* Contact metadata */}
          <aside className="md:col-span-4 flex flex-col gap-8">
            <dl className="space-y-5">
              <div>
                <dt className="meta mb-1">Direct</dt>
                <dd>
                  <a
                    href="mailto:kizilbaha26@gmail.com"
                    className="display-md leading-none link-underline"
                  >
                    kizilbaha26@gmail.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="meta mb-1">Social</dt>
                <dd className="flex flex-col gap-1 text-sm">
                  <a
                    href="https://linkedin.com/in/bahakizil"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline"
                  >
                    linkedin.com/in/bahakizil
                  </a>
                  <a
                    href="https://github.com/bahakizil"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline"
                  >
                    github.com/bahakizil
                  </a>
                  <a
                    href="https://medium.com/@bahakizil"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline"
                  >
                    medium.com/@bahakizil
                  </a>
                </dd>
              </div>
              <div>
                <dt className="meta mb-1">Station</dt>
                <dd className="text-sm leading-relaxed">
                  Beşiktaş · Istanbul · Türkiye
                  <br />
                  41.01°N · 28.97°E · UTC+3
                </dd>
              </div>
              <div>
                <dt className="meta mb-1">Availability</dt>
                <dd className="text-sm leading-relaxed flex items-center gap-2">
                  <span className="dot-live" />
                  taking requests for 2026 engagements
                </dd>
              </div>
            </dl>
          </aside>

          {/* Form */}
          <div className="md:col-span-8 border border-ink/90 bg-paper">
            {success ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 md:p-12"
              >
                <div className="meta mb-6">◈ Transmission received</div>
                <h3 className="display-lg mb-4">
                  Thanks — I&apos;ll be in touch.
                </h3>
                <p className="text-mute mb-8 max-w-md">
                  Your note is on its way to my inbox. Expect a reply within
                  48 hours (Istanbul time, excluding weekends).
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="font-mono text-xs tracking-widest uppercase link-underline"
                >
                  send another →
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="divide-y divide-rule text-ink"
              >
                <label className="grid grid-cols-[110px_1fr] items-baseline gap-4 px-5 py-4">
                  <span className="meta-strong">Name</span>
                  <input
                    name="name"
                    required
                    className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-base placeholder:text-mute/70"
                    placeholder="Who&#x2019;s writing?"
                  />
                </label>
                <label className="grid grid-cols-[110px_1fr] items-baseline gap-4 px-5 py-4">
                  <span className="meta-strong">Email</span>
                  <input
                    type="email"
                    name="email"
                    required
                    className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-base placeholder:text-mute/70"
                    placeholder="your@domain.com"
                  />
                </label>
                <label className="grid grid-cols-[110px_1fr] items-baseline gap-4 px-5 py-4">
                  <span className="meta-strong">Subject</span>
                  <input
                    name="subject"
                    required
                    className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-base placeholder:text-mute/70"
                    placeholder="What&#x2019;s the premise?"
                  />
                </label>
                <label className="grid grid-cols-[110px_1fr] items-baseline gap-4 px-5 py-4">
                  <span className="meta-strong pt-2">Message</span>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-base placeholder:text-mute/70 resize-none"
                    placeholder="Tell me the story — problem, constraints, timeline."
                  />
                </label>

                {error && (
                  <div className="px-5 py-3 text-oxide font-mono text-[0.7rem] tracking-widest uppercase">
                    ! {error}
                  </div>
                )}

                <div className="flex items-center justify-between px-5 py-4">
                  <span className="meta">
                    powered by resend · free-tier friendly
                  </span>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-5 py-3 border border-ink bg-ink text-paper hover:bg-lime hover:text-ink transition-colors font-mono text-xs tracking-widest uppercase disabled:opacity-60"
                  >
                    {submitting ? "transmitting…" : "send"}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
