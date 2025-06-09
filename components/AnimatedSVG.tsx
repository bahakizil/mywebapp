"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedSVGProps {
  className?: string;
  triggerOnScroll?: boolean;
  delay?: number;
}

export const AnimatedLogo: React.FC<AnimatedSVGProps> = ({ 
  className = "", 
  triggerOnScroll = true,
  delay = 0 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const paths = svg.querySelectorAll('path, circle, rect, line');

    // Set initial state
    paths.forEach(path => {
      gsap.set(path, { 
        strokeDasharray: '100%',
        strokeDashoffset: '100%',
        opacity: 1
      });
    });

    if (triggerOnScroll) {
      // Animate on scroll
      gsap.to(paths, {
        strokeDashoffset: '0%',
        duration: 2,
        ease: 'power2.inOut',
        stagger: 0.2,
        delay: delay,
        scrollTrigger: {
          trigger: svg,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });
    } else {
      // Animate immediately
      gsap.to(paths, {
        strokeDashoffset: '0%',
        duration: 2,
        ease: 'power2.inOut',
        stagger: 0.2,
        delay: delay
      });
    }
  }, [triggerOnScroll, delay]);

  return (
    <svg
      ref={svgRef}
      className={`${className}`}
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* AI Brain/Network Symbol */}
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Neural network nodes */}
      <circle cx="50" cy="30" r="3" fill="currentColor" />
      <circle cx="35" cy="45" r="3" fill="currentColor" />
      <circle cx="65" cy="45" r="3" fill="currentColor" />
      <circle cx="30" cy="65" r="3" fill="currentColor" />
      <circle cx="50" cy="65" r="3" fill="currentColor" />
      <circle cx="70" cy="65" r="3" fill="currentColor" />
      
      {/* Neural connections */}
      <path
        d="M50 33 L35 42"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M50 33 L65 42"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M35 48 L30 62"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M35 48 L50 62"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M65 48 L70 62"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M65 48 L50 62"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
};

export const AnimatedCodeBrackets: React.FC<AnimatedSVGProps> = ({ 
  className = "", 
  triggerOnScroll = true,
  delay = 0 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const paths = svg.querySelectorAll('path');

    // Set initial state for DrawSVG
    paths.forEach(path => {
      gsap.set(path, { 
        strokeDasharray: '100%',
        strokeDashoffset: '100%',
        opacity: 1
      });
    });

    if (triggerOnScroll) {
      gsap.to(paths, {
        strokeDashoffset: '0%',
        duration: 1.5,
        ease: 'power2.inOut',
        stagger: 0.3,
        delay: delay,
        scrollTrigger: {
          trigger: svg,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });
    } else {
      gsap.to(paths, {
        strokeDashoffset: '0%',
        duration: 1.5,
        ease: 'power2.inOut',
        stagger: 0.3,
        delay: delay
      });
    }
  }, [triggerOnScroll, delay]);

  return (
    <svg
      ref={svgRef}
      className={`${className}`}
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left bracket */}
      <path
        d="M20 15 L10 15 L10 45 L20 45"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Right bracket */}
      <path
        d="M40 15 L50 15 L50 45 L40 45"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Code dots */}
      <circle cx="25" cy="25" r="1.5" fill="currentColor" />
      <circle cx="30" cy="25" r="1.5" fill="currentColor" />
      <circle cx="35" cy="25" r="1.5" fill="currentColor" />
      
      <circle cx="25" cy="35" r="1.5" fill="currentColor" />
      <circle cx="30" cy="35" r="1.5" fill="currentColor" />
    </svg>
  );
};

export const AnimatedArrow: React.FC<AnimatedSVGProps & { direction?: 'down' | 'right' }> = ({ 
  className = "", 
  triggerOnScroll = true,
  delay = 0,
  direction = 'down'
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const paths = svg.querySelectorAll('path');

    // Set initial state
    paths.forEach(path => {
      gsap.set(path, { 
        strokeDasharray: '100%',
        strokeDashoffset: '100%',
        opacity: 1
      });
    });

    if (triggerOnScroll) {
      gsap.to(paths, {
        strokeDashoffset: '0%',
        duration: 1,
        ease: 'power2.inOut',
        delay: delay,
        scrollTrigger: {
          trigger: svg,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });
    } else {
      gsap.to(paths, {
        strokeDashoffset: '0%',
        duration: 1,
        ease: 'power2.inOut',
        delay: delay
      });
    }

    // Add floating animation
    gsap.to(svg, {
      y: direction === 'down' ? 5 : 0,
      x: direction === 'right' ? 5 : 0,
      duration: 2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1
    });
  }, [triggerOnScroll, delay, direction]);

  const arrowPath = direction === 'down' 
    ? "M12 5 L12 19 M5 12 L12 19 L19 12"
    : "M5 12 L19 12 M12 5 L19 12 L12 19";

  return (
    <svg
      ref={svgRef}
      className={`${className}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={arrowPath}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}; 