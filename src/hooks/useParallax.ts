"use client";

import { useScroll, useTransform, MotionValue } from "framer-motion";

export const useParallax = (offset = 50): MotionValue<number> => {
  const { scrollY } = useScroll();
  return useTransform(scrollY, [0, 1000], [0, offset]);
};