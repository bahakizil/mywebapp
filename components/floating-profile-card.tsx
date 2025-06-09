"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingProfileCard() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide when scrolling down, show when scrolling up or at top
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true); // Scrolling up
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="fixed left-4 top-20 z-40 w-72 bg-card/95 backdrop-blur-sm border rounded-xl shadow-lg p-6 border-border/50"
        >
          {/* Profile Image */}
          <div className="text-center mb-4">
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-3 border-primary/30 shadow-lg">
              <Image
                src="/profile.jpg"
                alt="Baha Kizil"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="font-bold text-xl mt-3">Baha Kizil</h3>
            <p className="text-base text-primary font-medium">AI Engineer</p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>Istanbul, Turkey</span>
          </div>

          {/* Social Links */}
          <div className="space-y-2 mb-4">
            <a
              href="https://github.com/bahakizil"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/bahakizil"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
            <a
              href="mailto:kizilbaha26@gmail.com"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </a>
          </div>

          {/* Contact Button */}
          <Button size="sm" className="w-full" asChild>
            <a href="mailto:kizilbaha26@gmail.com">
              Contact Me
            </a>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 