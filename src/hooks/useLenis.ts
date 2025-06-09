'use client';

import { useEffect } from 'react';

/**
 * Smooth-scroll helper based on `lenis`.
 *
 * - Only runs in the browser (useEffect).
 * - Package is never imported during SSR.
 * - Makes lenis available globally for ScrollTrigger integration
 */
export function useLenis() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let lenis: any;  // Type will be determined after dynamic import

    // Dynamic import in the browser
    import('@studio-freight/lenis').then(({ default: Lenis }) => {
      try {
        lenis = new Lenis({ 
          duration: 1.1, 
          lerp: 0.1,
          wheelMultiplier: 0.8,
          touchMultiplier: 2,
          infinite: false,
        });
        
        // Make lenis available globally for ScrollTrigger integration
        window.lenis = lenis;
        
        const raf = (time: number) => { 
          lenis.raf(time); 
          requestAnimationFrame(raf); 
        };
        
        requestAnimationFrame(raf);
      } catch (error) {
        console.error("Lenis initialization error:", error);
        // Fallback to default scrolling if Lenis fails
      }
    });

    // Cleanup
    return () => {
      if (lenis?.destroy) {
        lenis.destroy();
      } else if (lenis?.stop) {
        lenis.stop();
      }
      
      delete window.lenis;
    };
  }, []);
}

// Declare global lenis to avoid TypeScript errors
declare global {
  interface Window {
    lenis: any;
  }
}