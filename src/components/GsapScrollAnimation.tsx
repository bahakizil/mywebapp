"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GsapScrollAnimationProps {
  children: ReactNode;
  animation: "fadeIn" | "slideUp" | "slideLeft" | "slideRight";
  delay?: number;
  className?: string;
}

export function GsapScrollAnimation({
  children,
  animation,
  delay = 0,
  className = "",
}: GsapScrollAnimationProps) {
  // Map animation type to CSS class
  const animationClass = `gsap-${animation === "fadeIn" ? "fade-in" : 
                               animation === "slideUp" ? "slide-up" : 
                               animation === "slideLeft" ? "slide-left" : 
                               "slide-right"}`;
  
  // Map delay to CSS class
  const delayClass = delay > 0 ? `delay-${Math.min(Math.ceil(delay * 10), 5)}` : '';
  
  return (
    <div className={cn(animationClass, delayClass, "animate-card", className)}>
      {children}
    </div>
  );
}