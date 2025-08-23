"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { navLinks } from "@/src/config/siteConfig";

export const NavigationDots = () => {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      
      // Debounce section detection
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        try {
          const sections = document.querySelectorAll("section[id]");
          if (sections.length === 0) return;
          
          sections.forEach((section) => {
            if (!section || !section.getBoundingClientRect) return;
            
            const sectionTop = section.getBoundingClientRect().top;
            const sectionId = section.getAttribute("id");
            
            if (sectionTop < window.innerHeight / 2 && sectionTop > -window.innerHeight / 2) {
              if (sectionId) setActiveSection(sectionId);
            }
          });
        } catch (error) {
          console.debug('Navigation dots section detection error (safe to ignore):', error);
        }
      }, 100);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", handleScroll);
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, []);

  const scrollToSection = (href: string) => {
    if (typeof window === 'undefined') return;
    
    try {
      if (href === "/") {
        const section = document.getElementById("hero");
        if (section && section.scrollIntoView) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        const id = href.replace("#", "");
        const section = document.getElementById(id);
        if (section && section.scrollIntoView) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }
    } catch (error) {
      console.debug('Navigation dots scroll error (safe to ignore):', error);
    }
  };

  // Filter navigation links to display in dots (show all except home)
  const navDots = navLinks.filter(link => 
    link.href !== "/"
  );

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:flex flex-col items-center space-y-4">
      {navDots.map((link) => {
        const id = link.href === "/" ? "hero" : link.href.replace("#", "");
        const isActive = activeSection === id;
        
        return (
          <button
            key={link.href}
            onClick={() => scrollToSection(link.href)}
            className="relative group flex items-center justify-center"
            aria-label={`Navigate to ${link.title}`}
          >
            <span className="absolute right-full mr-4 opacity-0 whitespace-nowrap text-sm transition-opacity group-hover:opacity-100">
              {link.title}
            </span>
            <motion.div
              animate={{
                scale: isActive ? 1.3 : 1,
                opacity: isActive ? 1 : 0.5,
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                isActive 
                  ? "bg-primary" 
                  : "bg-muted-foreground/50"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};