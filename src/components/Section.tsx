"use client";

import { ReactNode } from "react";

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export const Section = ({ id, children, className = "" }: SectionProps) => {
  return (
    <section 
      id={id} 
      className={`min-h-screen flex items-center justify-center relative ${className}`}
    >
      <div className="w-full opacity-100">
        {children}
      </div>
    </section>
  );
};