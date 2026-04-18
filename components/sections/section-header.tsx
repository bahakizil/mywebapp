"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  index: string;
  kicker: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  count?: number;
  className?: string;
}

export function SectionHeader({
  index,
  kicker,
  title,
  lede,
  count,
  className,
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        "grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-6 pt-10 pb-10 md:pt-14 md:pb-12 border-t border-rule",
        className,
      )}
    >
      <div className="md:col-span-3 flex items-start justify-between md:block">
        <span className="section-index">
          § {index}
          <span className="mx-2">/</span>
          {kicker}
        </span>
        {count !== undefined && (
          <span className="font-mono text-[0.7rem] tracking-widest text-mute md:mt-2 md:block">
            [{String(count).padStart(2, "0")} entries]
          </span>
        )}
      </div>

      <div className="md:col-span-9">
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="display-lg text-balance"
        >
          {title}
        </motion.h2>
        {lede && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              duration: 0.85,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.1,
            }}
            className="mt-6 max-w-xl text-mute text-base md:text-lg leading-relaxed"
          >
            {lede}
          </motion.p>
        )}
      </div>
    </header>
  );
}
