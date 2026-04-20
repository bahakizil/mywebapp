"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Download, Mail, Phone } from "lucide-react";
import { Section } from "@/src/components/Section";
import { SectionHeader } from "@/components/sections/section-header";
import { siteConfig } from "@/src/config/siteConfig";

const SKILLS = {
  Languages: ["Python"],
  "AI / ML": [
    "Model Training & Fine-Tuning",
    "Time Series Forecasting",
    "NLP · Prompt & Context Engineering",
    "Computer Vision",
    "LLMs & Multi-Agent Systems",
    "RAG Architectures",
    "Chatbot Development",
    "Workflow Automation",
  ],
  "Libraries & Frameworks": [
    "OpenCV",
    "Pandas · NumPy · Matplotlib",
    "FastAPI",
    "FastMCP",
    "LangChain",
    "LangGraph",
    "Strands Agents",
    "Supervision",
    "PyTorch",
  ],
  "Platforms & Integrations": [
    "n8n · Langflow · Flowise",
    "OpenAI · Gemini",
    "Hugging Face",
    "ElevenLabs",
    "Supabase",
    "Roboflow",
    "DeepStream",
    "Tavily",
    "LangSmith",
  ],
  "Cloud & Infra": [
    "AWS (Bedrock · Lambda · SQS · DynamoDB · S3)",
    "Google Cloud",
    "Docker",
    "Linux",
    "Runpod",
    "Celery",
    "PostgreSQL + PGVector",
  ],
};

const EXPERIENCE = [
  {
    period: "09/2025 — now",
    role: "AI Engineer",
    org: "Cool Digital Solutions",
    bullets: [
      "Built a fintech stock-market analysis platform powered by multi-agent AI — parallel agent pipelines with Strands Agents + LangGraph on AWS Bedrock for sentiment and technical-indicator analysis.",
      "Developed MCP servers (FastMCP) for agent-to-tool communication; deployed serverless infra on AWS (Lambda · SQS · DynamoDB · S3) with full CI/CD.",
      "Sole AI + backend engineer behind Maxeo.ai — an AI platform optimizing brand visibility across SEO/GEO/AEO search engines.",
      "Architecting agentic orchestration with LangChain, LangGraph, Tavily, MCP across multiple LLM providers (OpenAI, Gemini, open-source).",
      "Designed prompt pipelines with intelligent fallback chains; managed async task orchestration via Celery on AWS.",
      "Implementing end-to-end observability with LangSmith and cost optimization at scale.",
    ],
  },
  {
    period: "06/2025 — 09/2025",
    role: "AI Engineer",
    org: "Kafein Technology Solutions",
    bullets: [
      "Contributed to an enterprise AI workflow-automation platform: modular MCP servers (FastMCP), FastAPI backend services, and LangChain/LangGraph orchestration.",
      "Integrated flow tools (n8n, Langflow, Flowise) for visual workflow design.",
      "Designed RAG systems on PostgreSQL + PGVector with optimized chunking, dynamic embeddings, and reranker integration.",
      "Improved observability with LangSmith.",
    ],
  },
  {
    period: "08/2024 — 02/2025",
    role: "IT Intern (Full-time)",
    org: "GUESS — Turkey",
    bullets: [
      "Handled regional tech support and head-office equipment.",
      "Developed Power Automate solutions for HR workflows and finance ERP automation.",
      "Collaborated with GUESS Europe IT Lugano on cross-regional initiatives.",
    ],
  },
  {
    period: "02/2024 — 06/2024",
    role: "R&D Intern",
    org: "TAV Technologies",
    bullets: [
      "Worked on AI projects covering Time-Series Analysis, Human Action Recognition, and Object Detection.",
      "Developed internal APIs; explored SOTA models via Hugging Face, Papers with Code, Kaggle, and GitHub.",
      "Hands-on CNN/RNN work in PyTorch — focused on training, fine-tuning, and optimization while contributing to dataset design.",
    ],
  },
];

const CERTIFICATIONS = [
  { name: "MCP Tools", issuer: "Hugging Face", date: "06/2025" },
  { name: "AI Agents", issuer: "Hugging Face", date: "02/2025" },
  { name: "PyTorch Bootcamp", issuer: "OpenCV University", date: "02/2025" },
  { name: "AI Developer Specialization", issuer: "IBM", date: "12/2024" },
];

const HIGHLIGHT_PROJECTS = [
  {
    id: "SEMANTIC CV",
    title: "Semantic CV Management Web App",
    date: "06/2025",
    body: "FastAPI + React + Supabase + LangChain + OpenAI. Hybrid keyword-plus-embeddings search in Supabase with GPT-4.1-nano reranking and natural-language CV queries via LangChain agents.",
  },
  {
    id: "SMART TRAFFIC",
    title: "Smart Traffic Monitoring",
    date: "03/2025",
    body: "Real-time RTSP system classifying vehicles, estimating per-lane speeds, detecting emergency-lane violations. Fine-tuned YOLOv12n on a custom Roboflow dataset with polygon-based lane zones and multi-camera tracking.",
  },
  {
    id: "THREAT DETECTION",
    title: "Real-Time Threat Detection",
    date: "02/2025",
    body: "Fully local CCTV firearms-detection system — fine-tuned YOLOv11n on a custom Roboflow dataset plus DeepSeek 1.5B for scene analysis. Automated email alerts orchestrated via LangChain.",
  },
  {
    id: "SMART GROWBOX",
    title: "AI-Supported Smart Growbox (Capstone)",
    date: "10/2024 — 05/2025",
    body: "Closed growbox for fully autonomous indoor cultivation: Raspberry Pi 5 environmental control, YOLO camera for plant-health assessment, OpenAI-powered decision loop, FastAPI dashboard with time-series analytics.",
  },
  {
    id: "VOICE AI",
    title: "MVP AI Web App (Freelance)",
    date: "03/2025 — 06/2025",
    body: "Voice-enabled AI web app generating structured documents from real-time conversations. Whisper + GPT-4o mini + ElevenLabs, Python/FastAPI backend, prompt-engineering logic, Supabase integration.",
  },
  {
    id: "COFFEE SALES",
    title: "Coffee Sales Analysis & Prediction",
    date: "07/2024",
    body: "PyTorch time-series forecasting on sales + weather data to predict daily café sales. Pandas/NumPy preprocessing, Matplotlib visualizations for business efficiency decisions.",
  },
];

export default function About() {
  return (
    <Section id="about" className="!min-h-0">
      <div className="lab-container w-full">
        <SectionHeader
          index="00"
          kicker="About / Long-form"
          title={
            <>
              Engineer of <em>machine perception</em> &amp; agent systems.
            </>
          }
          lede="Istanbul-based AI engineer working the seam between computer-vision pipelines and LLM-driven orchestration. Background in mechatronics, fluency in Python, FastAPI and AWS, bias toward shipping."
        />

        {/* Portrait + intro */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-ink/90">
          <div className="md:col-span-4">
            <div className="aspect-[4/5] relative overflow-hidden border border-ink/90">
              <Image
                src="/profile.jpg"
                alt="Baha Kızıl"
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className="object-cover grayscale"
                priority
              />
            </div>
            <div className="mt-4 space-y-1 meta">
              <div className="meta-strong">Baha Kızıl — AI Engineer</div>
              <div>{siteConfig.coords} · Ortaköy · Istanbul</div>
              <div>{siteConfig.email}</div>
              <div>{siteConfig.phone}</div>
            </div>
          </div>

          <div className="md:col-span-8 space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg leading-relaxed"
            >
              Ambitious, motivated AI engineer focused on turning advanced
              research into{" "}
              <span className="lime-underline">practical products</span>. My
              thread through four teams in two years: build the AI the way
              you&apos;d build any other backend — measurable, observable,
              cost-aware, ship-ready.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-base leading-relaxed text-mute"
            >
              Currently the sole AI + backend engineer for Maxeo.ai at{" "}
              <span className="font-medium text-ink">
                Cool Digital Solutions
              </span>
              . Before that, architected enterprise agent workflows at Kafein
              Technology Solutions, interned at GUESS for IT automation, and
              started as an R&amp;D intern at TAV Technologies on computer
              vision and time-series work.
            </motion.p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="/api/download-cv"
                download
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-ink bg-ink text-paper hover:bg-lime hover:text-ink transition-colors font-mono text-xs tracking-widest uppercase"
              >
                <Download className="h-3.5 w-3.5" /> CV
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-ink hover:bg-ink hover:text-paper transition-colors font-mono text-xs tracking-widest uppercase"
              >
                <Mail className="h-3.5 w-3.5" /> Email
              </a>
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-ink hover:bg-ink hover:text-paper transition-colors font-mono text-xs tracking-widest uppercase"
              >
                <Phone className="h-3.5 w-3.5" /> Call
              </a>
            </div>
          </div>
        </div>

        {/* Experience timeline */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-b border-ink/90">
          <div className="md:col-span-3">
            <span className="section-index">§ Chronology</span>
            <p className="mt-3 text-sm text-mute max-w-xs">
              Four roles · two years · one throughline — making AI shippable.
            </p>
          </div>
          <div className="md:col-span-9 space-y-10">
            {EXPERIENCE.map((t, i) => (
              <motion.div
                key={t.period}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="grid grid-cols-1 md:grid-cols-[170px_1fr] gap-4 pb-8 border-b border-rule last:border-0"
              >
                <div className="meta-strong">{t.period}</div>
                <div>
                  <div className="display-md mb-1 leading-tight">{t.role}</div>
                  <div className="meta mb-4">{t.org}</div>
                  <ul className="space-y-2 text-sm md:text-base leading-relaxed text-ink/85">
                    {t.bullets.map((b, j) => (
                      <li
                        key={j}
                        className="flex gap-3 before:content-['–'] before:text-mute before:shrink-0"
                      >
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-b border-ink/90">
          <div className="md:col-span-3">
            <span className="section-index">§ Stack</span>
            <p className="mt-3 text-sm text-mute max-w-xs">
              Daily drivers across the agent · vision · infra split.
            </p>
          </div>
          <div className="md:col-span-9 space-y-8">
            {Object.entries(SKILLS).map(([group, items]) => (
              <div
                key={group}
                className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 pb-6 border-b border-rule last:border-0"
              >
                <div className="meta-strong">{group}</div>
                <ul className="flex flex-wrap gap-x-5 gap-y-2">
                  {items.map((s) => (
                    <li key={s} className="text-sm leading-snug">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education + Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-b border-ink/90">
          <div className="md:col-span-3">
            <span className="section-index">§ Credentials</span>
          </div>
          <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="meta mb-3">Education</div>
              <div className="display-md leading-tight mb-1">
                B.Sc. Mechatronics Engineering
              </div>
              <div className="meta-strong mb-1">Bahçeşehir University</div>
              <div className="meta">Istanbul · 2020 — 2025</div>
            </div>
            <div>
              <div className="meta mb-3">Certifications · 04</div>
              <ul className="space-y-2">
                {CERTIFICATIONS.map((c) => (
                  <li
                    key={c.name}
                    className="flex items-baseline justify-between gap-3 border-b border-rule pb-2 last:border-0"
                  >
                    <span>
                      <span className="text-ink">{c.name}</span>{" "}
                      <span className="text-mute">— {c.issuer}</span>
                    </span>
                    <span className="meta shrink-0">{c.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Highlighted projects */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12">
          <div className="md:col-span-3">
            <span className="section-index">§ Case Studies</span>
            <p className="mt-3 text-sm text-mute max-w-xs">
              Six projects that shaped the current stack.
            </p>
          </div>
          <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/90 border border-ink/90">
            {HIGHLIGHT_PROJECTS.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="invert-card bg-paper text-ink p-5 md:p-6 flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="meta-strong">[{p.id}]</span>
                  <span className="meta">{p.date}</span>
                </div>
                <h3 className="display-md mb-3 leading-tight">{p.title}</h3>
                <p className="text-sm leading-relaxed text-current">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
