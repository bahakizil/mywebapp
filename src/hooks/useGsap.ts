'use client';

import { useEffect, useRef } from 'react';

/**
 * useGsap hook to handle GSAP animations
 * Dynamically imports GSAP and ScrollTrigger to avoid SSR issues
 * Sets up all animations in a GSAP context for proper cleanup
 */
export function useGsap() {
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations or running during SSR
    if (initialized.current || typeof window === 'undefined') return;

    let ctx: any;
    let lenis: any;

    // Async import of GSAP and ScrollTrigger
    const setupGsap = async () => {
      try {
        // Import GSAP and ScrollTrigger
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        
        // Try to get lenis instance for smooth scrolling integration
        if (window.lenis) {
          lenis = window.lenis;
        }

        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Create a context for all animations (for cleanup)
        ctx = gsap.context(() => {
          /* ========== PROGRESS BAR ========== */
          const progressBar = document.createElement('div');
          progressBar.className = 'fixed top-0 left-0 right-0 h-1 bg-primary/50 origin-left z-50';
          document.body.appendChild(progressBar);

          gsap.to(progressBar, {
            scaleX: 1,
            ease: 'none',
            transformOrigin: 'left center',
            scrollTrigger: {
              scrub: 0.3,
              start: 'top top',
              end: 'bottom bottom',
              invalidateOnRefresh: true,
            }
          });

          /* ========== HERO PARALLAX ========== */
          const heroSection = document.querySelector('#hero');
          if (heroSection) {
            const heroTitle = heroSection.querySelector('h1');
            const heroSubtitle = heroSection.querySelector('.h-12');
            const heroBg = heroSection.querySelector('motion.div');
            
            if (heroTitle) {
              gsap.fromTo(heroTitle, 
                { y: 0 }, 
                {
                  y: -80,
                  scrollTrigger: {
                    trigger: heroSection,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                  }
                }
              );
            }
            
            if (heroSubtitle) {
              gsap.fromTo(heroSubtitle, 
                { y: 0 }, 
                {
                  y: -40,
                  scrollTrigger: {
                    trigger: heroSection,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                  }
                }
              );
            }
          }

          /* ========== SECTION TRANSITIONS ========== */
          const sections = document.querySelectorAll('section');
          sections.forEach(section => {
            ScrollTrigger.create({
              trigger: section,
              start: 'top 80%',
              onEnter: () => section.classList.add('active'),
              once: true
            });
          });

          /* ========== STAGGERED CARD REVEALS ========== */
          // For Project Cards
          const projectCards = gsap.utils.toArray('.project-card') as Element[];
          if (projectCards.length) {
            gsap.set(projectCards, { y: 50, opacity: 0 });
            
            ScrollTrigger.batch(projectCards, {
              interval: 0.1,
              batchMax: 3,
              onEnter: (batch: Element[]) => gsap.to(batch, {
                opacity: 1,
                y: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power3.out'
              }),
            });
          }

          // Apply animation to all .gsap-* elements
          ['fade-in', 'slide-up', 'slide-left', 'slide-right'].forEach(animClass => {
            const elements = document.querySelectorAll(`.gsap-${animClass}`);
            if (elements.length) {
              elements.forEach((el, i) => {
                ScrollTrigger.create({
                  trigger: el,
                  start: 'top 85%',
                  onEnter: () => el.classList.add('active'),
                  once: true
                });
              });
            }
          });

          /* ========== PROJECTS HORIZONTAL SCROLL ========== */
          const projectsSection = document.querySelector('#projects');
          if (projectsSection) {
            const projectsContainer = projectsSection.querySelector('.grid');
            if (projectsContainer && window.innerWidth >= 1024) {  // Only on desktop
              // Create a horizontal scroll section
              let cards = gsap.utils.toArray(projectsContainer.children);
              if (cards.length >= 3) {
                gsap.set(projectsContainer, { 
                  display: 'flex',
                  flexWrap: 'nowrap',
                  overflowX: 'hidden',
                  width: '100%',
                });
                
                gsap.set(cards, {
                  flex: 'none',
                  width: '33.333%'
                });

                let scrollTween = gsap.to(cards, {
                  xPercent: -100 * (cards.length - 3),
                  ease: "none",
                  scrollTrigger: {
                    trigger: projectsContainer,
                    pin: true,
                    pinSpacing: true,
                    start: "top top",
                    end: () => "+=" + ((projectsContainer as HTMLElement).offsetWidth * (cards.length / 3)),
                    scrub: 1,
                    invalidateOnRefresh: true,
                  }
                });
              }
            }
          }
        });

        // Handle ScrollTrigger refresh with lenis
        if (lenis) {
          ScrollTrigger.addEventListener("refresh", () => lenis.resize());
          ScrollTrigger.refresh();
        }

        initialized.current = true;
      } catch (error) {
        console.error('Error initializing GSAP animations:', error);
      }
    };

    setupGsap();

    // Cleanup function
    return () => {
      if (ctx) {
        ctx.revert();
      }
    };
  }, []);
}

// Declare global lenis to avoid TypeScript errors
declare global {
  interface Window {
    lenis: any;
  }
}