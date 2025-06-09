"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

import { navLinks } from "@/src/config/siteConfig";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  
  // Scroll-based animations
  const { scrollY } = useScroll();
  const navbarY = useTransform(scrollY, [0, 100], [0, -10]);
  const navbarOpacity = useTransform(scrollY, [0, 50, 100], [1, 0.95, 0.9]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Update active section based on scroll position
      const sections = document.querySelectorAll("section[id]");
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionId = section.getAttribute("id");
        
        if (sectionTop < window.innerHeight / 2 && sectionTop > -window.innerHeight / 2) {
          if (sectionId) setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle mobile menu
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Scroll to section
  const scrollToSection = (href: string) => {
    closeMobileMenu();
    if (href === "/") {
      const section = document.getElementById("hero");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      const id = href.replace("#", "");
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <motion.header
      style={{ y: navbarY, opacity: navbarOpacity }}
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 backdrop-blur-md navbar-bg",
        isScrolled
          ? "bg-background/95 border-b shadow-sm"
          : "bg-background/50"
      )}
    >
      <div className="container mx-auto max-w-7xl flex h-20 items-center justify-center px-4 md:px-6">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const id = link.href === "/" ? "hero" : link.href.replace("#", "");
            return (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className={cn(
                  "text-base font-medium transition-colors hover:text-primary relative",
                  activeSection === id
                    ? "text-foreground font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.title}
              </button>
            );
          })}
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <div className="absolute right-4 flex items-center space-x-4 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-b bg-background/95 backdrop-blur-sm"
          >
            <nav className="container mx-auto max-w-7xl py-4 flex flex-col space-y-4 px-4 md:px-6">
              {navLinks.map((link) => {
                const id = link.href === "/" ? "hero" : link.href.replace("#", "");
                return (
                  <button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className={cn(
                      "text-base font-medium transition-colors hover:text-primary py-2 relative text-left",
                      activeSection === id
                        ? "text-foreground font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {link.title}
                  </button>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}