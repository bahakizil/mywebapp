"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";

/**
 * Agent-pipeline topology that powers itself on as the reader scrolls.
 * Nodes and edges are tied to the section's scroll progress; once the
 * graph is complete, lime packets start flowing along the paths (SMIL
 * animateMotion, compositor-only). Pinned for ~2 viewports on desktop;
 * on mobile the whole graph scrolls naturally so the pin-and-reveal
 * trick doesn't trap touch users.
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

// Progress windows — spread elements across the pin so each reveal
// takes roughly 8% of the scroll.
const NODE_START = 0.02;
const NODE_SPAN = 0.5;
const EDGE_START = 0.08;
const EDGE_SPAN = 0.5;
const PACKET_ON = [0.62, 0.72] as const;

function AnimatedNode({
  node,
  progress,
  triggerAt,
}: {
  node: Node;
  progress: MotionValue<number>;
  triggerAt: number;
}) {
  const opacity = useTransform(progress, [triggerAt, triggerAt + 0.04], [0, 1]);
  const y = useTransform(progress, [triggerAt, triggerAt + 0.04], [12, 0]);
  const isCore = node.kind === "core";
  const isTool = node.kind === "tool";

  return (
    <motion.g style={{ opacity, y }}>
      <rect
        x={node.x}
        y={node.y}
        width={NODE_W}
        height={NODE_H}
        className={`fill-paper ${
          isCore ? "stroke-ink" : "stroke-ink/70"
        }`}
        strokeWidth={isCore ? "1.5" : "1"}
      />
      <text
        x={node.x + 10}
        y={node.y + 16}
        fontFamily="var(--font-mono)"
        fontSize="8.5"
        letterSpacing="0.22em"
        className="uppercase fill-ink/55"
      >
        [§ {node.tag} · {node.kind}]
      </text>
      <text
        x={node.x + 10}
        y={node.y + 38}
        fontFamily="var(--font-mono)"
        fontSize="12"
        className="fill-ink"
      >
        {node.label}
      </text>
      <circle
        cx={node.x + NODE_W - 10}
        cy={node.y + 10}
        r="2.4"
        fill={isCore || isTool ? "hsl(var(--lime))" : "hsl(var(--ink))"}
      />
    </motion.g>
  );
}

function AnimatedEdge({
  d,
  label,
  midX,
  midY,
  progress,
  triggerAt,
}: {
  d: string;
  label?: string;
  midX: number;
  midY: number;
  progress: MotionValue<number>;
  triggerAt: number;
}) {
  const pathLength = useTransform(progress, [triggerAt, triggerAt + 0.06], [0, 1]);
  const labelOpacity = useTransform(
    progress,
    [triggerAt + 0.05, triggerAt + 0.09],
    [0, 1],
  );
  const arrowOpacity = useTransform(
    progress,
    [triggerAt + 0.04, triggerAt + 0.07],
    [0, 1],
  );
  return (
    <g>
      <motion.path
        d={d}
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 4"
        fill="none"
        style={{ pathLength, opacity: arrowOpacity }}
        markerEnd="url(#arrow)"
      />
      {label && (
        <motion.g
          transform={`translate(${midX}, ${midY - 8})`}
          style={{ opacity: labelOpacity }}
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
            {label}
          </text>
        </motion.g>
      )}
    </g>
  );
}

export function TopologyDiagram() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Remap the full enter→exit range into an "active build" window so the
  // drama happens while the diagram is centred, not as it enters/leaves.
  // Map the full enter→exit range so build completes comfortably while
  // the section is on screen — no pin, just normal scroll flow.
  const p = useTransform(scrollYProgress, [0.15, 0.75], [0, 1], {
    clamp: true,
  });

  const packetOpacity = useTransform(p, [PACKET_ON[0], PACKET_ON[1]], [0, 1]);
  const captionOpacity = useTransform(p, [0.05, 0.2], [0.4, 1]);
  const progressDash = useTransform(p, [0, 1], [0, 1]);

  return (
    <section
      ref={ref}
      className="relative border-t border-b border-ink/90 py-10 md:py-14"
      aria-label="Agent pipeline topology"
    >
      <div>
        <figure className="w-full">
          <div className="lab-container">
            <motion.figcaption
              className="flex items-baseline justify-between mb-6 md:mb-8"
              style={{ opacity: captionOpacity }}
            >
              <span className="section-index">§ Topology / agent graph</span>
              <span className="meta">
                build-on-scroll · 7-node pipeline
              </span>
            </motion.figcaption>

            <svg
              viewBox="0 0 1100 360"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-auto"
              role="img"
              aria-label="Multi-agent pipeline topology — user prompt, router, tool/vector/memory, llm, stream reply"
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

              {/* edges (drawn under nodes) */}
              <g className="text-ink/55" fill="none">
                {EDGES.map((e, i) => {
                  const a = nodeById(e.from);
                  const b = nodeById(e.to);
                  const d = edgePath(a, b);
                  const mid = edgeMidpoint(a, b);
                  const triggerAt =
                    EDGE_START + (i / Math.max(1, EDGES.length - 1)) * EDGE_SPAN;
                  return (
                    <AnimatedEdge
                      key={`edge-${i}`}
                      d={d}
                      label={e.label}
                      midX={mid.x}
                      midY={mid.y}
                      progress={p}
                      triggerAt={triggerAt}
                    />
                  );
                })}
              </g>

              {/* packets — fade in after the graph is complete */}
              <motion.g style={{ opacity: packetOpacity }}>
                {EDGES.map((e, i) => {
                  const a = nodeById(e.from);
                  const b = nodeById(e.to);
                  const d = edgePath(a, b);
                  return (
                    <circle
                      key={`packet-${i}`}
                      r="3.5"
                      fill="hsl(var(--lime))"
                    >
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
                {NODES.map((n, i) => {
                  const triggerAt =
                    NODE_START +
                    (i / Math.max(1, NODES.length - 1)) * NODE_SPAN;
                  return (
                    <AnimatedNode
                      key={n.id}
                      node={n}
                      progress={p}
                      triggerAt={triggerAt}
                    />
                  );
                })}
              </g>

              {/* schematic corner brackets */}
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
            </svg>

            {/* Progress rail + legend */}
            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 font-mono text-[0.62rem] tracking-widest uppercase text-mute">
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
                  <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
                  packets
                </li>
              </ul>

              {/* Build progress rail */}
              <div className="relative h-px bg-rule w-full md:w-64 overflow-hidden">
                <motion.span
                  className="absolute inset-y-0 left-0 bg-lime origin-left"
                  style={{ width: "100%", scaleX: progressDash }}
                />
              </div>
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}
