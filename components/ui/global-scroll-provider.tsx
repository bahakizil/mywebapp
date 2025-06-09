"use client";

import { ReactNode } from 'react';
import { ScrollProgress } from './scroll-progress';
import { motion, useScroll, useTransform } from 'framer-motion';

interface GlobalScrollProviderProps {
  children: ReactNode;
  showProgress?: boolean;
  enableParallax?: boolean;
}

export function GlobalScrollProvider({ 
  children, 
  showProgress = true,
  enableParallax = true 
}: GlobalScrollProviderProps) {
  const { scrollY } = useScroll();
  
  // Simplified parallax effects
  const backgroundParallax = useTransform(scrollY, [0, 1000], [0, -50]);
  const contentParallax = useTransform(scrollY, [0, 1000], [0, 25]);

  return (
    <div className="relative">
      {showProgress && <ScrollProgress />}
      
      {enableParallax && (
        <>
          {/* Background parallax layer */}
          <motion.div
            className="fixed inset-0 -z-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/4 via-background to-background"
            style={{ 
              y: backgroundParallax,
            }}
          />
          
          {/* Simple floating shapes */}
          <motion.div
            className="fixed inset-0 -z-40 will-change-transform"
            style={{ y: contentParallax }}
          >
            <motion.div 
              className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/8 rounded-full will-change-transform"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.div 
              className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-primary/6 rounded-full will-change-transform"
              animate={{
                rotate: [0, -360],
                scale: [1, 0.8, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        </>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
} 