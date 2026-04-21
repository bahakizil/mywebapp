"use client";

import { ReactNode } from "react";

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
}

/**
 * Thin section wrapper — no min-height, no flex centering. Previously
 * forced every section to at least one viewport which made the page
 * feel like it was snapping between full-screen blocks.
 */
export const Section = ({ id, children, className = "" }: SectionProps) => (
  <section id={id} className={`relative ${className}`}>
    {children}
  </section>
);
