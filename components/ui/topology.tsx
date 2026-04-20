"use client";

import { motion } from "framer-motion";

/**
 * Agent-pipeline topology. One-shot reveal driven by IntersectionObserver
 * (via framer-motion's `whileInView`) — no scroll-bound math, so the
 * build happens once when the section enters the viewport and then
 * sits still. Packets flow via SMIL after the build completes.
 */

const NODE_W = 148;
const NODE_H = 52;

type NodeKind = "in" | "core" | "tool" | "out";

interface Node {
  id: string;
  x: number;
  y: number;
  tag: string;
  label: string;
  kind: NodeKind;
}

const NODES: Node[] = [
  { id: "user", x: 20, y: 168, tag: "01", label: "user.prompt", kind: "in" },
  { id: "router", x: 230, y: 168, tag: "02", label: "router / strands", kind: "core" },
  { id: "tool", x: 480, y: 50, tag: "03", label: "mcp.tool.call", kind: "tool" },
  { id: "vector", x: 480, y: 168, tag: "04", label: "pgvector.search", kind: "tool" },
  { id: "memory", x: 480, y: 286, tag: "05", label: "memory.recall", kind: "tool" },
  { id: "llm", x: 740, y: 168, tag: "06", label: "llm.route", kind: "core" },
  { id: "reply", x: 950, y: 168, tag: "07", label: "stream.out", kind: "out" },
];

const EDGES: Array<{ from: string; to: string; label?: string }> = [
  { from: "user", to: "router", label: "query" },
  { from: "router", to: "tool", label: "exec" },
  { from: "router", to: "vector", label: "embed" },
  { from: "router", to: "memory", label: "recall" },
  { from: "tool", to: "llm" },
  { from: "vector", to: "llm" },
  { from: "memory", to: "llm" },
  { from: "llm", to: "reply", label: "stream" },
];

const nodeById = (id: string) => NODES.find((n) => n.id === id)!;

function edgePath(from: Node, to: Node) {
  const sx = from.x + NODE_W;
  const sy = from.y + NODE_H / 2;
  const ex = to.x;
  const ey = to.y + NODE_H / 2;
  const mx = (sx + ex) / 2;
  return `M${sx},${sy} C${mx},${sy} ${mx},${ey} ${ex},${ey}`;
}

function edgeMidpoint(from: Node, to: Node) {
  const sx = from.x + NODE_W;
  const sy = from.y + NODE_H / 2;
  const ex = to.x;
  const ey = to.y + NODE_H / 2;
  return { x: (sx + ex) / 2, y: (sy + ey) / 2 };
}

const BUILD_EASE = [0.16, 1, 0.3, 1] as const;

export function TopologyDiagram() {
  return (
    <section
      className="relative border-t border-b border-ink/90 py-10 md:py-14"
      aria-label="Agent pipeline topology"
    >
      <div className="lab-container">
        <figcaption className="flex items-baseline justify-between mb-6 md:mb-8">
          <span className="section-index">§ Topology / agent graph</span>
          <span className="meta">7-node pipeline · built on reveal</span>
        </figcaption>

        <motion.svg
          viewBox="0 0 1100 360"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-auto"
          role="img"
          aria-label="Multi-agent pipeline: user prompt, router, tool/vector/memory, llm, stream reply"
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            shown: { transition: { staggerChildren: 0.08 } },
          }}
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
              className="text-ink"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
            </marker>
            <pattern
              id="grid"
              width="22"
              height="22"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="0.6" className="fill-ink/20" />
            </pattern>
          </defs>

          <rect width="1100" height="360" fill="url(#grid)" />

          {/* edges — drawn under nodes, stroke length animates from 0 → 1 */}
          <g className="text-ink/55" fill="none">
            {EDGES.map((e, i) => {
              const a = nodeById(e.from);
              const b = nodeById(e.to);
              const d = edgePath(a, b);
              const mid = edgeMidpoint(a, b);
              return (
                <motion.g key={`edge-${i}`} variants={{ hidden: {}, shown: {} }}>
                  <motion.path
                    d={d}
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    fill="none"
                    markerEnd="url(#arrow)"
                    variants={{
                      hidden: { pathLength: 0, opacity: 0 },
                      shown: {
                        pathLength: 1,
                        opacity: 1,
                        transition: { duration: 0.9, ease: BUILD_EASE },
                      },
                    }}
                  />
                  {e.label && (
                    <motion.g
                      transform={`translate(${mid.x}, ${mid.y - 8})`}
                      variants={{
                        hidden: { opacity: 0 },
                        shown: {
                          opacity: 1,
                          transition: { duration: 0.5, delay: 0.7 },
                        },
                      }}
                    >
                      <rect
                        x="-18"
                        y="-8"
                        width="36"
                        height="14"
                        className="fill-paper stroke-ink/40"
                        strokeWidth="0.5"
                      />
                      <text
                        textAnchor="middle"
                        y="2"
                        fontFamily="var(--font-mono)"
                        fontSize="8"
                        letterSpacing="0.14em"
                        className="uppercase fill-ink/70"
                      >
                        {e.label}
                      </text>
                    </motion.g>
                  )}
                </motion.g>
              );
            })}
          </g>

          {/* packets — fade in after the build */}
          <motion.g
            variants={{
              hidden: { opacity: 0 },
              shown: {
                opacity: 1,
                transition: { delay: 1.6, duration: 0.5 },
              },
            }}
          >
            {EDGES.map((e, i) => {
              const a = nodeById(e.from);
              const b = nodeById(e.to);
              const d = edgePath(a, b);
              return (
                <circle key={`packet-${i}`} r="3.5" fill="hsl(var(--lime))">
                  <animateMotion
                    dur={`${2.4 + (i % 4) * 0.4}s`}
                    begin={`${i * 0.35}s`}
                    repeatCount="indefinite"
                    path={d}
                    rotate="auto"
                  />
                </circle>
              );
            })}
          </motion.g>

          {/* nodes */}
          <g>
            {NODES.map((n) => {
              const isCore = n.kind === "core";
              const isTool = n.kind === "tool";
              return (
                <motion.g
                  key={n.id}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    shown: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, ease: BUILD_EASE },
                    },
                  }}
                >
                  <rect
                    x={n.x}
                    y={n.y}
                    width={NODE_W}
                    height={NODE_H}
                    className={`fill-paper ${
                      isCore ? "stroke-ink" : "stroke-ink/70"
                    }`}
                    strokeWidth={isCore ? "1.5" : "1"}
                  />
                  <text
                    x={n.x + 10}
                    y={n.y + 16}
                    fontFamily="var(--font-mono)"
                    fontSize="8.5"
                    letterSpacing="0.22em"
                    className="uppercase fill-ink/55"
                  >
                    [§ {n.tag} · {n.kind}]
                  </text>
                  <text
                    x={n.x + 10}
                    y={n.y + 38}
                    fontFamily="var(--font-mono)"
                    fontSize="12"
                    className="fill-ink"
                  >
                    {n.label}
                  </text>
                  <circle
                    cx={n.x + NODE_W - 10}
                    cy={n.y + 10}
                    r="2.4"
                    fill={
                      isCore || isTool ? "hsl(var(--lime))" : "hsl(var(--ink))"
                    }
                  />
                </motion.g>
              );
            })}
          </g>

          {/* corner brackets */}
          <g
            className="text-ink/70"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          >
            <path d="M 6 6 L 6 24 M 6 6 L 24 6" />
            <path d="M 1094 6 L 1094 24 M 1094 6 L 1076 6" />
            <path d="M 6 354 L 6 336 M 6 354 L 24 354" />
            <path d="M 1094 354 L 1094 336 M 1094 354 L 1076 354" />
          </g>
        </motion.svg>

        <ul className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 font-mono text-[0.62rem] tracking-widest uppercase text-mute">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" /> core
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" /> tool
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block h-px w-4 bg-ink/50" /> edges
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" /> packets
          </li>
        </ul>
      </div>
    </section>
  );
}
