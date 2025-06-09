import { useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const useGSAPAnimations = () => {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    // TEMPORARILY DISABLED - Make all elements visible immediately
    const ctx = gsap.context(() => {
      console.log('🎬 GSAP animations DISABLED - Making elements visible...');
      
      // Make all animated elements visible immediately
      const allAnimatedElements = document.querySelectorAll(
        '.animate-card, .hero-title, .hero-subtitle, .section-header, .animate-image, .gsap-slide-up, .gsap-fade-in, .gsap-scale-in'
      );
      
      allAnimatedElements.forEach((element) => {
        gsap.set(element, {
          opacity: 1,
          visibility: 'visible',
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          clearProps: 'all'
        });
      });

      console.log(`✅ Made ${allAnimatedElements.length} elements visible`);
    });

    return () => {
      ctx.revert();
    };
  }, []);

  const refreshScrollTrigger = () => {
    if (typeof window !== 'undefined' && ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  };

  return { refreshScrollTrigger };
};

// Custom hook for page transitions
export const usePageTransition = () => {
  useEffect(() => {
    console.log('📄 Page transition hook - animations disabled');
  }, []);
}; 