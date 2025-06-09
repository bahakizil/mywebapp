"use client";

import { ReactNode, useEffect } from "react";
import { useLenis } from "@/src/hooks/useLenis";
import { useGsap } from "@/src/hooks/useGsap";

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  // Initialize smooth scrolling with Lenis
  useLenis();
  
  // Initialize GSAP animations
  useGsap();
  
  return <>{children}</>;
};