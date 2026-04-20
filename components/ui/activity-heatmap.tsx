"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import type {
  ContributionCalendar,
  ContributionDay,
} from "@/types/portfolio";

const CELL = 12;
const GAP = 3;

const FILL = [
  "hsl(var(--ink) / 0.07)",
  "hsl(var(--lime) / 0.30)",
  "hsl(var(--lime) / 0.55)",
  "hsl(var(--lime) / 0.80)",
  "hsl(var(--lime))",
];

function level(count: number, max: number) {
  if (count === 0) return 0;
  const ratio = count / Math.max(1, max);
  if (ratio < 0.2) return 1;
  if (ratio < 0.45) return 2;
  if (ratio < 0.75) return 3;
  return 4;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface Summary {
  total: number;
  longestStreak: number;
  currentStreak: number;
  busiest: ContributionDay | null;
  max: number;
  avgPerWeek: number;
}

function summarize(cal: ContributionCalendar): Summary {
  const days = cal.weeks.flatMap((w) => w.days);
  const max = days.reduce((m, d) => Math.max(m, d.count), 0);
  const busiest = days.reduce<ContributionDay | null>((best, d) => {
    if (!best || d.count > best.count) return d;
    return best;
  }, null);

  // Sort by date just in case
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));

  let longest = 0;
  let running = 0;
  for (const d of sorted) {
    if (d.count > 0) {
      running++;
      longest = Math.max(longest, running);
    } else {
      running = 0;
    }
  }

  // Current streak = trailing positive days from today backward
  let current = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].count > 0) current++;
    else break;
  }

  return {
    total: cal.totalContributions,
    longestStreak: longest,
    currentStreak: current,
    busiest,
    max,
    avgPerWeek: Math.round(cal.totalContributions / cal.weeks.length),
  };
}

function monthTicks(cal: ContributionCalendar) {
  // Return label objects for each month's first-appearance week column
  const ticks: { label: string; col: number }[] = [];
  let lastMonth = -1;
  cal.weeks.forEach((week, col) => {
    const firstDay = week.days[0];
    if (!firstDay) return;
    const m = new Date(firstDay.date).getMonth();
    if (m !== lastMonth) {
      ticks.push({
        label: new Date(firstDay.date).toLocaleDateString("en-GB", {
          month: "short",
        }),
        col,
      });
      lastMonth = m;
    }
  });
  return ticks;
}

export function ActivityHeatmap({
  calendar,
}: {
  calendar: ContributionCalendar;
}) {
  const summary = useMemo(() => summarize(calendar), [calendar]);
  const ticks = useMemo(() => monthTicks(calendar), [calendar]);
  const weeks = calendar.weeks;
  const width = weeks.length * (CELL + GAP) - GAP + 30;
  const gridHeight = 7 * (CELL + GAP) - GAP;
  const height = gridHeight + 36; // room for month ticks on top

  return (
    <figure className="cv-section border-t border-b border-ink/90 py-10 md:py-14">
      <div className="lab-container">
        <figcaption className="flex items-baseline justify-between mb-6 md:mb-8">
          <span className="section-index">§ Activity / contribution log</span>
          <span className="meta">
            pulled live · github graphql · last 12 months
          </span>
        </figcaption>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-8">
          {/* Heatmap */}
          <div className="overflow-x-auto no-scrollbar">
            <motion.svg
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio="xMidYMid meet"
              className="w-full min-w-[720px] h-auto"
              role="img"
              aria-label={`${summary.total} contributions in the last year`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              {/* Day labels (left) */}
              <g
                fontFamily="var(--font-mono)"
                fontSize="8.5"
                letterSpacing="0.18em"
                className="uppercase fill-mute"
              >
                <text x="0" y={18 + 1 * (CELL + GAP) + CELL * 0.75}>
                  mon
                </text>
                <text x="0" y={18 + 3 * (CELL + GAP) + CELL * 0.75}>
                  wed
                </text>
                <text x="0" y={18 + 5 * (CELL + GAP) + CELL * 0.75}>
                  fri
                </text>
              </g>

              {/* Month ticks */}
              <g
                fontFamily="var(--font-mono)"
                fontSize="8.5"
                letterSpacing="0.18em"
                className="uppercase fill-mute"
              >
                {ticks.map((t) => (
                  <text
                    key={`${t.col}-${t.label}`}
                    x={30 + t.col * (CELL + GAP)}
                    y="10"
                  >
                    {t.label}
                  </text>
                ))}
              </g>

              {/* Grid */}
              <g transform="translate(30, 18)">
                {weeks.map((week, wi) =>
                  week.days.map((day, di) => {
                    const lvl = level(day.count, summary.max);
                    return (
                      <rect
                        key={`${wi}-${di}`}
                        x={wi * (CELL + GAP)}
                        y={di * (CELL + GAP)}
                        width={CELL}
                        height={CELL}
                        rx="1.5"
                        fill={FILL[lvl]}
                        className="hover:stroke-ink hover:stroke-1"
                      >
                        <title>
                          {formatDate(day.date)} · {day.count}{" "}
                          {day.count === 1 ? "contribution" : "contributions"}
                        </title>
                      </rect>
                    );
                  }),
                )}
              </g>
            </motion.svg>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-2 font-mono text-[0.62rem] tracking-widest uppercase text-mute">
              <span>less</span>
              {FILL.map((f, i) => (
                <span
                  key={i}
                  style={{ background: f }}
                  className="h-3 w-3 rounded-sm border border-ink/10"
                  aria-hidden
                />
              ))}
              <span>more</span>
            </div>
          </div>

          {/* Summary stats */}
          <aside className="flex flex-col gap-6 border-l-0 lg:border-l lg:border-rule lg:pl-6">
            <div>
              <div className="meta mb-1">Total · 12 months</div>
              <div className="display-md tabular-nums">
                {summary.total.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="meta mb-1">Longest streak</div>
              <div className="display-md tabular-nums">
                {summary.longestStreak}
                <span className="text-base text-mute ml-1">days</span>
              </div>
            </div>
            <div>
              <div className="meta mb-1">Currently</div>
              <div className="display-md tabular-nums">
                {summary.currentStreak}
                <span className="text-base text-mute ml-1">
                  day{summary.currentStreak === 1 ? "" : "s"}
                </span>
              </div>
            </div>
            {summary.busiest && (
              <div>
                <div className="meta mb-1">Busiest day</div>
                <div className="text-base">
                  <span className="tabular-nums mr-1">
                    {summary.busiest.count}
                  </span>
                  <span className="text-mute">
                    · {formatDate(summary.busiest.date)}
                  </span>
                </div>
              </div>
            )}
            <div>
              <div className="meta mb-1">Average / week</div>
              <div className="text-base tabular-nums">
                {summary.avgPerWeek}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </figure>
  );
}
