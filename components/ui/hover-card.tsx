"use client";

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface HoverCardProps {
  children: ReactNode;
  className?: string;
}

export function HoverCard({ children, className = '' }: HoverCardProps) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-md transition-all duration-300 ${className}`}
      whileHover={{ 
        scale: 1.05,
        y: -10,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
        whileHover={{ translateX: "200%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Border glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg border-2 border-primary/0"
        whileHover={{ borderColor: "hsl(var(--primary) / 0.3)" }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
