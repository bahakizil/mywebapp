"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Download, Mail, Phone } from "lucide-react";
import { Section } from "@/src/components/Section";
import { SectionHeader } from "@/components/sections/section-header";
import { siteConfig } from "@/src/config/siteConfig";

interface Practice {
  id: string;
  title: string;
  summary: string;
  depth: string[];
  stack: string[];
}

const PRACTICES: Practice[] = [
  {
    id: "AGENTS",
    title: "Multi-Agent Systems",
    summary:
      "I architect agentic platforms that stay stable under real traffic — parallel pipelines with fallback chains, tool-calling via MCP, and deterministic handoffs between specialized agents.",
    depth: [
      "Orchestration with LangGraph, Strands Agents, LangChain, and custom MCP servers built on FastMCP.",
      "Multi-provider routing across OpenAI, Gemini, and open-source models with intelligent fallback and cost-aware selection.",
      "Async task orchestration on Celery for long-running workflows; synchronous tool calls for sub-second replies.",
      "End-to-end observability via LangSmith — traces, evals, latency + token budgets per agent node.",
    ],
    stack: [
      "LangGraph",
      "Strands Agents",
      "LangChain",
      "FastMCP · MCP",
      "Tavily",
      "Celery",
      "LangSmith",
      "OpenAI",
      "Gemini",
    ],
  },
  {
    id: "RAG",
    title: "RAG & Semantic Search",
    summary:
      "I build retrieval systems that actually retrieve the right thing — hybrid indexes, aggressive chunking experiments, dynamic embeddings, and rerankers tuned against a hold-out set.",
    depth: [
      "Hybrid keyword + embedding retrieval on PostgreSQL + PGVector and Supabase vector store.",
      "Custom chunking strategies tuned per content type; dynamic embedding models selected by query intent.",
      "GPT-4.1-nano and open-source rerankers layered over raw retrieval, measured against reference queries.",
      "Natural-language query interfaces wired through LangChain agents that decide when to search versus answer directly.",
    ],
    stack: [
      "PostgreSQL",
      "PGVector",
      "Supabase",
      "LangChain",
      "OpenAI embeddings",
      "GPT-4.1-nano",
      "Hybrid retrieval",
      "Reranking",
    ],
  },
  {
    id: "VISION",
    title: "Computer Vision",
    summary:
      "I ship vision systems that have to hold up on live video — fine-tuned detectors, real-time tracking, and deployment on consumer or edge hardware, not just benchmarks.",
    depth: [
      "Fine-tuned YOLOv11 / YOLOv12 detectors on custom Roboflow datasets for vehicle, firearm, plant-health, and fire / smoke classes.",
      "Real-time RTSP ingestion with polygon-based lane or zone tracking via OpenCV + Supervision.",
      "Multi-camera flow analysis, emergency-lane violation detection, per-lane speed and density estimation.",
      "Local CCTV threat-detection pipelines combining YOLO with DeepSeek 1.5B for scene-level reasoning and automated alert agents.",
    ],
    stack: [
      "YOLOv11 · YOLOv12",
      "OpenCV",
      "Supervision",
      "Roboflow",
      "DeepStream",
      "PyTorch",
      "Colab",
      "DeepSeek",
    ],
  },
  {
    id: "INFRA",
    title: "Backend & Serverless Infrastructure",
    summary:
      "Under every AI feature there is a plain boring backend that has to not fall over. I build those the same way I build the models — measurable, reproducible, cheap to run.",
    depth: [
      "FastAPI services with typed contracts, structured logging, and OpenTelemetry traces.",
      "Serverless on AWS — Lambda, SQS, DynamoDB, S3 — with full CI/CD pipelines and infrastructure as code.",
      "Docker-based deploys, GPU compute on Runpod, managed Postgres on Supabase for auth + data.",
      "Prompt-engineering layer with intelligent fallback chains; cost optimization at scale across LLM providers.",
    ],
    stack: [
      "FastAPI",
      "Python",
      "AWS Bedrock",
      "AWS Lambda",
      "SQS · DynamoDB · S3",
      "Docker",
      "Runpod",
      "Google Cloud",
      "Linux",
    ],
  },
  {
    id: "WORKFLOW",
    title: "Workflow Automation & Integrations",
    summary:
      "The AI is only a part of it — most of the value comes from wiring it into existing tools. I build the glue: visual workflows, low-code integrations, voice front-ends.",
    depth: [
      "Visual workflow orchestration with n8n, Langflow, and Flowise for business-facing operators.",
      "Voice-first interfaces: Whisper for STT, ElevenLabs for TTS, GPT-4o mini for structured generation.",
      "Power Automate + ERP integrations for HR and finance workflows at a global retail brand.",
      "Time-series forecasting pipelines in PyTorch with Pandas / NumPy / Matplotlib for operational dashboards.",
    ],
    stack: [
      "n8n",
      "Langflow",
      "Flowise",
      "Whisper",
      "ElevenLabs",
      "GPT-4o mini",
      "Power Automate",
      "Pandas",
      "PyTorch",
    ],
  },
];

const EXPERIENCE = [
  {
    period: "09/2025 — now",
    role: "AI Engineer · Fintech + Marketing-Tech",
    domain: "Multi-agent platforms · serverless AWS",
    bullets: [
      "Architecting a fintech stock-market analysis platform with parallel Strands + LangGraph agent pipelines running on AWS Bedrock.",
      "Sole AI + backend engineer behind a brand-visibility engine that optimizes presence across SEO / GEO / AEO search surfaces.",
      "Designed MCP servers (FastMCP) for agent-to-tool comms; deployed full serverless stack (Lambda · SQS · DynamoDB · S3) with CI/CD.",
      "Wired end-to-end observability and cost controls via LangSmith; async task orchestration with Celery on AWS.",
    ],
  },
  {
    period: "06/2025 — 09/2025",
    role: "AI Engineer · Enterprise Workflow Automation",
    domain: "Agent workflows · RAG · FastMCP",
    bullets: [
      "Contributed to an enterprise AI workflow-automation platform: modular FastMCP servers, FastAPI backend services, and LangChain / LangGraph orchestration.",
      "Integrated n8n, Langflow, and Flowise to let non-engineers assemble and monitor agent flows visually.",
      "Designed RAG systems on PostgreSQL + PGVector with optimized chunking, dynamic embeddings, and reranker integration.",
    ],
  },
  {
    period: "08/2024 — 02/2025",
    role: "IT Automation Intern · Global Retail",
    domain: "Power Automate · ERP integrations",
    bullets: [
      "Full-time IT intern handling regional support and head-office equipment at a global fashion retailer.",
      "Developed Power Automate solutions for HR workflows and finance ERP automation.",
      "Collaborated with a European IT team on cross-regional automation initiatives.",
    ],
  },
  {
    period: "02/2024 — 06/2024",
    role: "R&D Intern · Aviation Tech",
    domain: "CV · Time-series · Human action recognition",
    bullets: [
      "Five-month R&D internship on computer-vision and time-series projects — object detection, human action recognition, forecasting.",
      "Built internal APIs and explored SOTA models via Hugging Face, Papers with Code, Kaggle, and GitHub.",
      "Hands-on CNN / RNN work in PyTorch focused on training, fine-tuning, and optimization while contributing to dataset design.",
    ],
  },
];

const CERTIFICATIONS = [
  { name: "MCP Tools", issuer: "Hugging Face", date: "06/2025" },
  { name: "AI Agents", issuer: "Hugging Face", date: "02/2025" },
  { name: "PyTorch Bootcamp", issuer: "OpenCV University", date: "02/2025" },
  { name: "AI Developer Specialization", issuer: "IBM", date: "12/2024" },
];

const CASE_STUDIES = [
  {
    id: "SEMANTIC CV",
    title: "Semantic CV Management Web App",
    date: "06/2025",
    body: "FastAPI + React + Supabase + LangChain + OpenAI. Hybrid keyword-plus-embeddings search with GPT-4.1-nano reranking; natural-language CV queries handled by a LangChain agent that decides when to search and when to synthesize.",
  },
  {
    id: "SMART TRAFFIC",
    title: "Smart Traffic Monitoring",
    date: "03/2025",
    body: "Real-time RTSP system classifying vehicles, estimating per-lane speeds, and detecting emergency-lane violations. Fine-tuned YOLOv12n on a custom Roboflow dataset with polygon-based lane zones and multi-camera flow tracking (OpenCV + Supervision).",
  },
  {
    id: "THREAT DETECTION",
    title: "Real-Time Threat Detection",
    date: "02/2025",
    body: "Fully local CCTV firearms-detection stack — fine-tuned YOLOv11n on a custom Roboflow dataset plus DeepSeek 1.5B for scene-level reasoning. Automated email alerting orchestrated by a LangChain agent.",
  },
  {
    id: "SMART GROWBOX",
    title: "AI-Supported Smart Growbox (Capstone)",
    date: "10/2024 — 05/2025",
    body: "Closed growbox for fully autonomous indoor cultivation — Raspberry Pi 5 environmental control, a YOLO camera for plant-health assessment, an OpenAI-powered decision loop, and a FastAPI dashboard with time-series analytics.",
  },
  {
    id: "VOICE AI",
    title: "Voice-First AI MVP",
    date: "03/2025 — 06/2025",
    body: "Voice-enabled AI web app that generated structured documents from real-time conversations. Whisper + GPT-4o mini + ElevenLabs, Python / FastAPI backend, prompt-engineering logic, Supabase integration.",
  },
  {
    id: "COFFEE SALES",
    title: "Coffee Sales Forecasting",
    date: "07/2024",
    body: "PyTorch time-series forecasting on sales + weather data to predict daily café sales. Pandas / NumPy preprocessing, Matplotlib visualizations for operational decisions.",
  },
];

export default function About() {
  return (
    <Section id="about" className="!min-h-0">
      <div className="lab-container w-full">
        <SectionHeader
          index="00"
          kicker="About / Practice"
          title={
            <>
              I build <em>production AI</em> — agents, vision, and the infra
              under them.
            </>
          }
          lede="Istanbul-based AI engineer. Four years of computer vision, two years of shipping multi-agent LLM platforms, one thread through all of it — make the AI work the way a backend works: measurable, observable, cost-aware, ready to hand off."
        />

        {/* Portrait + long intro */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-ink/90">
          <div className="md:col-span-4">
            <div className="aspect-[4/5] relative overflow-hidden border border-ink/90">
              <Image
                src="/profile.jpg"
                alt="Baha Kızıl"
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className="object-cover"
                priority
              />
            </div>
            <dl className="mt-4 space-y-2 meta">
              <div>
                <dt className="meta-strong">Baha Kızıl — AI Engineer</dt>
              </div>
              <div>
                <dt className="meta">
                  {siteConfig.coords} · Ortaköy · Istanbul
                </dt>
              </div>
              <div>
                <dt className="meta">{siteConfig.email}</dt>
              </div>
              <div>
                <dt className="meta">{siteConfig.phone}</dt>
              </div>
            </dl>
          </div>

          <div className="md:col-span-8 space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg leading-relaxed"
            >
              My practice sits between{" "}
              <span className="lime-underline font-medium">
                agentic AI systems
              </span>{" "}
              and the backend infrastructure they run on. I started with
              robotics, picked up mechatronics, then pivoted hard into computer
              vision when a single YOLO training run showed me what a fine-tuned
              model can do on consumer hardware.
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
              Today I build multi-agent platforms on AWS Bedrock, RAG systems
              on PGVector, and real-time CV pipelines shipped to edge devices.
              I treat observability (LangSmith · OpenTelemetry), evals, and
              cost per 1k-tokens as first-class concerns — not as
              afterthoughts. The best AI I&apos;ve shipped is the AI nobody
              had to patch at 3 a.m.
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

        {/* Practice depth */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-b border-ink/90">
          <div className="md:col-span-3">
            <span className="section-index">§ Practice</span>
            <p className="mt-3 text-sm text-mute max-w-xs">
              Five overlapping surfaces where most of the shipping happens.
            </p>
          </div>
          <div className="md:col-span-9 space-y-10">
            {PRACTICES.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="grid grid-cols-1 md:grid-cols-[170px_1fr] gap-4 pb-10 border-b border-rule last:border-0"
              >
                <div>
                  <div className="meta-strong">[{p.id}]</div>
                </div>
                <div>
                  <h3 className="display-md mb-3 leading-tight">{p.title}</h3>
                  <p className="text-base leading-relaxed text-ink/90 mb-4 max-w-3xl">
                    {p.summary}
                  </p>
                  <ul className="space-y-2 text-sm md:text-base leading-relaxed text-mute mb-5">
                    {p.depth.map((d, j) => (
                      <li
                        key={j}
                        className="flex gap-3 before:content-['–'] before:shrink-0"
                      >
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                  <ul className="flex flex-wrap gap-1.5">
                    {p.stack.map((s) => (
                      <li
                        key={s}
                        className="font-mono text-[0.62rem] tracking-widest uppercase px-2 py-1 border border-current"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Field experience — anonymized */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-b border-ink/90">
          <div className="md:col-span-3">
            <span className="section-index">§ Field Experience</span>
            <p className="mt-3 text-sm text-mute max-w-xs">
              Four roles · two years · different domains — same engineering
              discipline. Employer names live in the CV.
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
                  <div className="meta mb-4">{t.domain}</div>
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

        {/* Case studies */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12">
          <div className="md:col-span-3">
            <span className="section-index">§ Case Studies</span>
            <p className="mt-3 text-sm text-mute max-w-xs">
              Six projects that shaped the current stack.
            </p>
          </div>
          <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/90 border border-ink/90">
            {CASE_STUDIES.map((p, i) => (
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
