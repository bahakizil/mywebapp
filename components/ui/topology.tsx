"use client";

import { motion } from "framer-motion";

/**
 * Agent-pipeline topology: user → router → [tool · vector · memory] →
 * llm → reply. Static SVG with animated lime packets travelling along
 * every edge via SMIL `animateMotion`. Compositor-only work.
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

const EDGES: [string, string, string?][] = [
  ["user", "router", "query"],
  ["router", "tool", "exec"],
  ["router", "vector", "embed"],
  ["router", "memory", "recall"],
  ["tool", "llm"],
  ["vector", "llm"],
  ["memory", "llm"],
  ["llm", "reply", "stream"],
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

export function TopologyDiagram() {
  return (
    <figure className="cv-section border-t border-b border-ink/90 py-10 md:py-14">
      <div className="lab-container">
        <figcaption className="flex items-baseline justify-between mb-6 md:mb-8">
          <span className="section-index">§ Topology / agent graph</span>
          <span className="meta">schema · v2026.04 · 7-node pipeline</span>
        </figcaption>

        <motion.svg
          viewBox="0 0 1100 360"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-auto"
          role="img"
          aria-label="Multi-agent pipeline topology — user prompt, router, tool/vector/memory, llm, stream reply"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
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
              <circle
                cx="1"
                cy="1"
                r="0.6"
                className="fill-ink/20"
              />
            </pattern>
          </defs>

          {/* technical grid */}
          <rect width="1100" height="360" fill="url(#grid)" />

          {/* edges */}
          <g className="text-ink/55" fill="none">
            {EDGES.map(([from, to, label], i) => {
              const a = nodeById(from);
              const b = nodeById(to);
              const d = edgePath(a, b);
              const mid = edgeMidpoint(a, b);
              return (
                <g key={`edge-${i}`}>
                  <path
                    d={d}
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    markerEnd="url(#arrow)"
                  />
                  {label && (
                    <g transform={`translate(${mid.x}, ${mid.y - 8})`}>
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
                        {label}
                      </text>
                    </g>
                  )}
                  {/* animated data packet travelling along the edge */}
                  <circle r="3.5" fill="hsl(var(--lime))">
                    <animateMotion
                      dur={`${2.4 + (i % 4) * 0.4}s`}
                      begin={`${i * 0.35}s`}
                      repeatCount="indefinite"
                      path={d}
                      rotate="auto"
                    />
                  </circle>
                </g>
              );
            })}
          </g>

          {/* nodes */}
          <g>
            {NODES.map((n, i) => {
              const isCore = n.kind === "core";
              const isTool = n.kind === "tool";
              return (
                <motion.g
                  key={n.id}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 + i * 0.05,
                    ease: [0.16, 1, 0.3, 1],
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
                  {/* tag row */}
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
                  {/* status dot */}
                  <circle
                    cx={n.x + NODE_W - 10}
                    cy={n.y + 10}
                    r="2.4"
                    fill={
                      isCore || isTool
                        ? "hsl(var(--lime))"
                        : "hsl(var(--ink))"
                    }
                  />
                </motion.g>
              );
            })}
          </g>

          {/* corner brackets for schematic feel */}
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

        {/* legend */}
        <ul className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 font-mono text-[0.62rem] tracking-widest uppercase text-mute">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" /> core nodes
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" /> tool calls
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block h-px w-4 bg-ink/50" /> dashed · edges
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />{" "}
            packets · in-flight
          </li>
        </ul>
      </div>
    </figure>
  );
}
